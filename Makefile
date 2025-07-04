.PHONY: schema ci
default: help

help:
	@echo "Targets:"
	@echo "--------"
	@echo "schema    Generates the JSON schema"
	@echo "ci        Builds the site"

init:
	@echo "Initializing..."
	@mkdir -p ./.artifacts

schema: init
	@echo "Generating JSON schema..."
	@npm --prefix ./typespec install
	@tsp compile ./typespec --output-dir ./.artifacts
	@mv ./.artifacts/@typespec/json-schema/OpenCLI.json ./schema.json

ci: init
	@cd site && make ci