build:
	@echo "===================================================================="
	@echo "Building services"
	@echo "===================================================================="
	@docker compose build 
up:
	@echo "===================================================================="
	@echo "Run $(MODE) system"
	@echo "===================================================================="
	@docker compose up -d

clean:
	@echo "===================================================================="
	@echo "Clean up docker compose with orphans"
	@echo "===================================================================="
	@docker compose down --remove-orphans

deploy:
	@echo "===================================================================="
	@echo "Start production node"
	@echo "===================================================================="
	@docker compose -f docker-compose.yaml -f docker-compose.prod.yaml up -d

down: clean

.PHONY: build clean deploy down up

# check:
# 	@while inotifywait -q -e modify -e create -e delete -e move --recursive /home/python/ ; do \
# 		clear; \
# 		echo "===================================================================="; \
# 		echo "Check & correct format via black"; \
# 		echo "===================================================================="; \
# 		black --check /home/python/imktk; \
# 		echo ""; \
# 		echo ""; \
# 		echo "===================================================================="; \
# 		echo "Formatting and linting"; \
# 		echo "===================================================================="; \
# 		flake8 /home/python/imktk; \
# 	done
# 
# watch: container
# 	@echo "===================================================================="
# 	@echo "Starting watch environment in docker container"
# 	@echo "===================================================================="
# 	@docker run --pull never --workdir /home/python --rm -it -v $(shell pwd)/imktk:/home/python/imktk imktk/imktk make check
# 

