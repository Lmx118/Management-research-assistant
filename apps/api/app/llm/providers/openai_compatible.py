import json
from json import JSONDecodeError

import httpx

from app.llm.base import LLMProvider, ModelT


class OpenAICompatibleProvider(LLMProvider):
    def __init__(self, *, base_url: str, api_key: str, model: str):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model

    def generate_object(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ModelT],
    ) -> ModelT:
        schema = response_model.model_json_schema()
        structured_system_prompt = (
            f"{system_prompt}\n\n"
            "Return only a single JSON object. Do not add markdown or commentary.\n"
            f"Target schema:\n{json.dumps(schema, indent=2)}"
        )

        payload = {
            "model": self.model,
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": structured_system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        }
        response_json = self._post_chat_completion(payload)
        message_content = response_json["choices"][0]["message"]["content"]

        try:
            parsed = json.loads(message_content)
        except JSONDecodeError:
            parsed = self._extract_json_object(message_content)

        return response_model.model_validate(parsed)

    def _post_chat_completion(self, payload: dict) -> dict:
        try:
            response = self._send_request(payload)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as exc:
            if payload.get("response_format") and exc.response.status_code == 400:
                fallback_payload = dict(payload)
                fallback_payload.pop("response_format", None)
                response = self._send_request(fallback_payload)
                response.raise_for_status()
                return response.json()
            raise

    def _send_request(self, payload: dict) -> httpx.Response:
        return httpx.post(
            f"{self.base_url}/chat/completions",
            headers={
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json",
            },
            json=payload,
            timeout=60.0,
        )

    @staticmethod
    def _extract_json_object(message_content: str) -> dict:
        start = message_content.find("{")
        end = message_content.rfind("}")

        if start == -1 or end == -1 or end < start:
            raise ValueError("The model response did not contain a valid JSON object.")

        return json.loads(message_content[start : end + 1])
