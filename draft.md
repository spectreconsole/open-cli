# OpenCLI Specification

Version 0.1

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT",
"SHOULD", "SHOULD NOT", "RECOMMENDED", "NOT RECOMMENDED", "MAY", and
"OPTIONAL" in this document are to be interpreted as described in [BCP 14][bcp14], [RFC2119][rfc2119], and [RFC8174][rfc8174] when, and only when, they appear in all capitals, as shown here.

This document is licensed under the MIT license

## Introduction

The OpenCLI specification (OCS) defines a standard, platform and
language agnostic interface to CLI applications which allows both humans
and computers to understand how a CLI tool should be invoked without
access to source code or documentation.

An OpenCLI Description can be used by documentation software to display
usage of a tool, or code generation tools to create clients for
interoping with a CLI tool.

In short, an OpenCLI description can be used for the following:

* Create documentation for CLI tools
* Generate clients for interacting with CLI tools
* Automate external tools such as MCP servers
* Detect changes in CLI APIs
* Generate auto-completion scripts

This specification is heavily influenced by the [OpenAPI specification][openapi].

## Change log

| Date | Author | Description |
|------|--------|-------------|
| 2025-07-15 | Patrik Svensson | Added `interactive` to root command and commands |
| 2025-07-16 | Patrik Svensson | Added [Metadata Object](#metadata-object) |
| 2025-07-16 | Patrik Svensson | Changed maps to arrays |
| 2025-07-18 | Patrik Svensson | `name` property in [License Object](#license-object) is no longer required |

## Definitions

### OpenCLI Description

An OpenCLI Description is a single JSON or YAML document that
conforms to the OpenCLI Specification.

### CLI

Command Line Application. A text based interface to an appliction.

### Schema

A "schema" is a formal description of syntax and structure.

### Object

When capitalized, the word "Object" refers to any of the Objects that
are named by section headings in this document.

### Case sensitivity

All field names in the OpenCLI specification is case sensitive unless
otherwise stated.

### Arity

The number of argument values an option expect.

## Specification

### Versions

The OpenCLI Specification is versioned using a `major.minor.patch`
versioning scheme. The `major.minor` portion of the version string (for
example 1.1) SHALL designate the OCS feature set. `.patch` versions
address errors in, or provide clarifications to, this document, not the
feature set. Tooling which supports OCS `1.1` SHOULD be compatible with
all OCS `1.1.*` versions. The patch version SHOULD NOT be considered by
tooling, making no distinction between `1.1.0` and `1.1.1` for example.

### Ordering

The ordering of items within arrays MUST be considered normative.

### Schema

This section describes the structure of the OpenCLI Description format.
This text is the only normative description of the format.

#### Document Object

This is the root object of the OpenCLI Description.

| Field Name | Type | Description |
|------------|:----:|-------------|
| opencli | `string` | **REQUIRED** The OpenCLI version number |
| info | [CliInfo Object](#cliinfo-object) | **REQUIRED** Information about the CLI |
| conventions | [Conventions Object](#conventions-object) | The conventions used by the CLI |
| arguments | [[Argument Object](#argument-object)] | Root command arguments |
| options | [[Option Object](#option-object)] | Root command options |
| commands | [[Command Object](#command-object)] | Root command sub commands |
| exitCodes | [[ExitCode Object](#exitcode-object)] | Root command exit codes |
| examples | [`string`] | Examples of how to use the CLI |
| interactive | `bool` | Indicates whether or not the command requires interactive input |
| metadata | [[Metadata Object](#metadata-object)] | Custom metadata |

#### CliInfo Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| title | `string` | **REQUIRED** The application title |
| description | `string` | A description of the application |
| contact | [Contact Object](#contact-object) | The contact information |
| license | [License Object](#license-object) | The application license |
| version | `string` | **REQUIRED** The application version |

#### Conventions Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| groupOptions | `bool` | Whether or not grouping of short options are allowed |
| optionArgumentSeparator | `string` | The option argument separator |

#### Contact Object

| Field Name | Format | Description |
|------------|:------:|-------------|
| name | `string` | The identifying name of the contact person/organization |
| url | `string` | The URI for the contact information. This MUST be in the form of a URI |
| email | `string` | The email address of the contact person/organization. This MUST be in the form of an email address |

#### License Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| name | `string` | The license name |
| identifier | `string` | The [SPDX](https://spdx.org/licenses/) license identifier |

#### Command Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| name | `string` | **REQUIRED** The command name |
| aliases | [`string`] | The command aliases |
| options | [[Option Object](#option-object)] | The command's options |
| arguments | [[Argument Object](#argument-object)] | The command's arguments |
| commands | [[Command Object](#command-object)] | The command's sub commands |
| exitCodes | [[ExitCode Object](#exitcode-object)] | The command's exit codes |
| description | `string` | The command description |
| hidden | `bool` | Whether or not the command is hidden |
| examples | [`string`] | Examples of how to use the command |
| interactive | `bool` | Indicates whether or not the command requires interactive input |
| metadata | [[Metadata Object](#metadata-object)] | Custom metadata |

#### Argument Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| name | `string` | **REQUIRED** The argument name |
| required | `bool` | Whether or not the argument is required |
| ordinal | `int` | The relative position to other arguments |
| arity | [Arity Object](#arity-object) | The argument arity. Arity defines the minimum and maximum number of argument values |
| acceptedValues | [`string`] | A list of accepted values |
| group | `string` | The argument group |
| decription | `string` | The argument description |
| hidden | `bool` | Whether or not the argument is hidden |
| metadata | [[Metadata Object](#metadata-object)] | Custom metadata |

#### Option Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| name | `string` | **REQUIRED** The option name |
| required | `bool` | Whether or not the option is required |
| aliases | [`string`] | The option's aliases |
| arguments | [[Argument](#argument-object)] | The option's arguments |
| group | `string` | The option group |
| description | `string` | The option description |
| recursive | `bool` | Specifies whether the option is accessible from the immediate parent command and, recursively, from its subcommands |
| hidden | `bool` | Whether or not the option is hidden |
| metadata | [[Metadata Object](#metadata-object)] | Custom metadata |

#### Arity Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| minimum | `int` | The minimum number of values allowed |
| maximum | `int` | The maximum number of values allowed |

#### ExitCode Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| code | `int` | **REQUIRED** The exit code |
| description | `string` | The exit code description |

#### Metadata Object

| Field Name | Type | Description |
|------------|:----:|-------------|
| name | `string` | **REQUIRED** The metadata name |
| value | `object` | The metadata value |

[bcp14]: https://tools.ietf.org/html/bcp14
[rfc2119]: https://tools.ietf.org/html/rfc2119
[rfc8174]: https://tools.ietf.org/html/rfc8174
[openapi]: https://spec.openapis.org/oas/latest.html