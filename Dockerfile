FROM oven/bun:slim AS setup

# Create app directory

WORKDIR /home/node/balenciaga

# Install app dependencies

COPY package.json /home/node/balenciaga/package.json
COPY bun.lock /home/node/balenciaga/bun.lock

# Install app dependencies

FROM setup AS installation

RUN bun install --frozen-lockfile

# Install production dependencies

FROM setup AS production

RUN bun install --frozen-lockfile --production

# Build app

FROM installation AS build

# Copy app source

COPY @types /home/node/balenciaga/@types
COPY drizzle /home/node/balenciaga/drizzle
COPY i18n /home/node/balenciaga/i18n
COPY src /home/node/balenciaga/src
COPY tsconfig.json /home/node/balenciaga/tsconfig.json

RUN bun run build

# Release the app

FROM setup AS release

ENV NODE_ENV=production

# Copy generated app files

COPY --from=build /home/node/balenciaga/dist /home/node/balenciaga/src
COPY --from=production /home/node/balenciaga/node_modules /home/node/balenciaga/node_modules
COPY --from=setup /home/node/balenciaga/package.json /home/node/balenciaga/package.json
COPY --from=build /home/node/balenciaga/i18n /home/node/balenciaga/i18n
COPY --from=build /home/node/balenciaga/tsconfig.json /home/node/balenciaga/tsconfig.json

# Expose port

EXPOSE 3333

# Run app

CMD ["bun", "src/main.js"]
