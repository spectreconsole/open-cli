//go:generate go get github.com/atombender/go-jsonschema@v0.20.0
//go:generate go run github.com/atombender/go-jsonschema -p opencli -o schema.gen.go ../.artifacts/@typespec/json-schema/OpenCLI.json
//go:generate go mod tidy

package opencli
