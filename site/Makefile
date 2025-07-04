.PHONY: build ci
default: run

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