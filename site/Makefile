.PHONY: build ci

build:
	@npm install
	@npx docusaurus start

ci:
	@echo "Updating contents..."
	@./update.sh
	@echo "Installing dependencies..."
	@npm ci
	@echo "Building..."
	@npm run build