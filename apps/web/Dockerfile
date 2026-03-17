FROM node:22-alpine

WORKDIR /workspace

COPY package.json /workspace/package.json
COPY tsconfig.base.json /workspace/tsconfig.base.json
COPY packages/api-client/package.json /workspace/packages/api-client/package.json
COPY apps/web/package.json /workspace/apps/web/package.json

RUN npm install

COPY . /workspace

WORKDIR /workspace/apps/web

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0", "--port", "3000"]

