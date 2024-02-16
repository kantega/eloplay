FROM node:latest
ARG DATABASE_URL

COPY . /app

WORKDIR /app

ENV DATABASE_URL=$DATABASE_URL

RUN /usr/local/lib/node_modules/corepack/shims/pnpm install

RUN /usr/local/lib/node_modules/corepack/shims/pnpm build

CMD /usr/local/lib/node_modules/corepack/shims/pnpm start
