.PHONY: schema ci

schema:
	@mkdir -p ./.artifacts
	@echo "Generating JSON schema"
	@npm --prefix ./typespec install
	@tsp compile ./typespec --output-dir ./.artifacts
	@mv ./.artifacts/@typespec/json-schema/OpenCLI.json ./schema.json

ci:
	@mkdir -p ./.artifacts	
	@cd site && make ci