setup:
	bun install --frozen-lockfile
	cp .env.example .env

setup-docker:
  docker compose up -d
