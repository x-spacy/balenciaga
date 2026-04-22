FROM oven/bun:slim AS setup

# Create app directory

WORKDIR /home/node/nest-template

# Install app dependencies

COPY package.json /home/node/nest-template/package.json
COPY bun.lock /home/node/nest-template/bun.lock

# Install app dependencies

FROM setup AS installation

RUN bun install --frozen-lockfile

# Install production dependencies

FROM setup AS production

RUN bun install --frozen-lockfile --production

# Build app

FROM installation AS build

# Copy app source

COPY @types /home/node/nest-template/@types
COPY drizzle /home/node/nest-template/drizzle
COPY i18n /home/node/nest-template/i18n
COPY src /home/node/nest-template/src
COPY tsconfig.json /home/node/nest-template/tsconfig.json

RUN bun run build

# Release the app

FROM setup AS release

ENV NODE_ENV=production

# Copy generated app files

COPY --from=build /home/node/nest-template/dist /home/node/nest-template/src
COPY --from=production /home/node/nest-template/node_modules /home/node/nest-template/node_modules
COPY --from=setup /home/node/nest-template/package.json /home/node/nest-template/package.json
COPY --from=build /home/node/nest-template/i18n /home/node/nest-template/i18n
COPY --from=build /home/node/nest-template/tsconfig.json /home/node/nest-template/tsconfig.json

# Expose port

EXPOSE 3333

# Run app

CMD ["bun", "src/main.js"]
