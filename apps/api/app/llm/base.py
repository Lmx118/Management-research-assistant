from abc import ABC, abstractmethod
from typing import TypeVar

from pydantic import BaseModel


ModelT = TypeVar("ModelT", bound=BaseModel)


class LLMProvider(ABC):
    @abstractmethod
    def generate_object(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        response_model: type[ModelT],
    ) -> ModelT:
        raise NotImplementedError

