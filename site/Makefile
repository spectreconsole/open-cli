.PHONY: build ci
default: run

help:                                                                                    
	@echo "Targets:"
	@echo "--------"
	@echo "update    Syncs the OpenCLI spec with the site"
	@echo "run       Runs the site"
	@echo "ci        Builds the site (for CI)"

update:
	@echo "Updating contents..."
	@./update.sh

run: update
	@echo "Installing dependencies..."
	@npm install
	@echo "Running..."
	@npx docusaurus start

ci: update
	@echo "Installing dependencies..."
	@npm ci
	@echo "Building..."
	@npm run build