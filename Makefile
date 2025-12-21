run:
	docker compose -f local.yaml up -d --remove-orphans

run-watch:
	docker compose -f local.yaml up --remove-orphans --watch
build:
	docker compose -f local.yaml build --no-cache

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
makeMigrations:
	docker exec -it farm-orm python manage.py makemigrations

collectstatic:
	docker exec -it farm-orm python manage.py collectstatic
