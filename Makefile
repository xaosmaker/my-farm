run:
	docker compose -f local.yaml --env-file=.env up -d --remove-orphans
run-prod:
	docker compose -f prod.yaml --env-file=.env up -d --remove-orphans

run-watch:
	docker compose -f local.yaml --env-file=.env up --remove-orphans --watch

build:
	docker compose -f local.yaml --env-file=.env build --no-cache
build-prod:
	docker compose -f prod.yaml --env-file=.env build --no-cache

django-inspectdb:
	docker exec -it farm-orm /py/bin/python3 manage.py inspectdb > orm/ui/models.py
test:
	docker compose -f test.yaml --env-file=.env up
test-show:
	cd server && go tool cover -html=coverage.out

down:
	docker compose -f local.yaml down

down-v:
	docker compose -f local.yaml down -v

logs:
	docker compose -f local.yaml logs -f

createsuperuser:
	docker exec -it farm-orm python manage.py createsuperuser

migrate:
	docker exec -it farm-orm python manage.py migrate

collectstatic:
	docker exec -it farm-orm python manage.py collectstatic
