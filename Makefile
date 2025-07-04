.PHONY: schema ci
default: run

help:                                                                                    
	@echo "Targets:"
	@echo "--------"
	@echo "schema    Generates the JSON schema"
	@echo "run       Runs the site"
	@echo "ci        Builds the site (for CI)"

init:
	@echo "Initializing..."
	@mkdir -p ./.artifacts

schema: init
	@echo "Generating JSON schema..."
	@npm --prefix ./typespec install
	@tsp compile ./typespec --output-dir ./.artifacts
	@mv ./.artifacts/@typespec/json-schema/OpenCLI.json ./schema.json

run: init
	@cd site && make run

ci: init
	@cd site && make ci