UID := $(shell id -u)
GID := $(shell id -g)

BIN_DIR = ./node_modules/.bin
DOCKER_COMPOSE = docker-compose
NODE_EXEC = $(DOCKER_COMPOSE) run --rm -u $(UID):$(GID) web

.PHONY: install
install: package.json
	$(NODE_EXEC) npm install

.PHONY: build
build:
	$(NODE_EXEC) npm run build

.PHONY: watch
watch:
	$(NODE_EXEC) npm run build -- --mode development --watch --sourcemap

.PHONY: clean
clean:
	$(DOCKER_COMPOSE) rm -f
	rm -rf ./node_modules

.PHONY: test
test:
	$(NODE_EXEC) npm test

.PHONY: publish
publish: test
	$(NODE_EXEC) npm run publish

.PHONY: start
start: node_modules
	$(DOCKER_COMPOSE) up --remove-orphans

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) stop

.PHONY: release
release: test .releaserc.json
	$(NODE_EXEC) ${BIN_DIR}/semantic-release --no-ci

node_modules: install
