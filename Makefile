up:
	docker compose -f ./infra/compose.yml up -d

down:
	docker compose -f ./infra/compose.yml down

down_v:
	docker compose -f ./infra/compose.yml down -v