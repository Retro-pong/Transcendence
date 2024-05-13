frontendImg = frontend:transcendence
nginxImg = nginx:inception

up: build
	docker compose -f ./docker-compose.yml up

build:
	docker compose -f ./docker-compose.yml build

stop:
	docker compose -f ./docker-compose.yml stop

start:
	docker compose -f ./docker-compose.yml start

down:
	docker compose -f ./docker-compose.yml down

downV:
	docker compose -f ./docker-compose.yml down -v

imgClean:
	@if [ $(shell docker image ls | grep frontend | wc -l) -eq 1 ]; \
		then docker rmi $(frontendImg); fi
	@if [ $(shell docker image ls | grep nginx | wc -l) -eq 1 ]; \
		then docker rmi $(nginxImg); fi

clean: downV imgClean

# Remove all stoped containers, all unused images, all networks not used by at least one container, unused build cache
fclean:
	yes | docker container prune
	yes | docker image prune
	yes | docker network prune
	yes | docker system prune

re: down all

.PHONY: up build all stop down downVolume re imgClean clean
