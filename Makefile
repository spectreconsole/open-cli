.PHONY: schema ci

schema:
	@echo "Generating JSON schema"
	@npm --prefix ./typespec install
	@tsp compile ./typespec --output-dir ./.artifacts
	@mv ./.artifacts/@typespec/json-schema/OpenCLI.json ./schema.json

ci:
	@cd site && make ci