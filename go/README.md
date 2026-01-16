# OpenCLI Go Package

Go package for working with OpenCLI specification files. This package provides type-safe Go structs generated from the OpenCLI JSON schema.

## Installation

```bash
go get github.com/spectreconsole/open-cli/go
```

## Usage

```go
import "github.com/spectreconsole/open-cli/go"

import (
    "encoding/json"
    "github.com/spectreconsole/open-cli/go"
)

// Unmarshal an OpenCLI JSON file
var cli opencli.OpenCLIJson
data, _ := os.ReadFile("cli.json")
json.Unmarshal(data, &cli)

// Access CLI information
fmt.Println(cli.Info.Title)
fmt.Println(cli.Info.Version)

// Iterate over commands
for _, cmd := range cli.Commands {
    fmt.Println(cmd.Name, cmd.Description)
}
```

## Code Generation

The Go types in this package are automatically generated from the OpenCLI JSON schema. To regenerate the code:

1. **First, compile the TypeSpec schema** (from the repository root):
   ```bash
   cd typespec
   npm run tsp-compile
   ```
   This generates the JSON schema file at `.artifacts/@typespec/json-schema/OpenCLI.json`.

2. **Then, generate the Go code** (from the `go/` directory):
   ```bash
   cd go
   go generate
   ```

The `go generate` command will:
- Download the `go-jsonschema` tool if needed
- Generate `schema.gen.go` from the JSON schema
- Clean up the module dependencies

## License

See the main repository [LICENSE](../LICENSE.md) file.
