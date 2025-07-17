---
sidebar_position: 50
slug: /examples
toc_min_heading_level: 2
toc_max_heading_level: 5
title: Examples
---

## .NET SDK

```json
{
    "$schema": "https://raw.githubusercontent.com/spectreconsole/open-cli/refs/heads/main/schema.json",
    "opencli": "0.1",
    "info": {
        "title": "dotnet",
        "version": "9.0.1",
        "description": "The .NET CLI",
        "license": {
            "name": "MIT License",
            "identifier": "MIT"
        }
    },
    "options": [
        {
            "name": "--help",
            "aliases": [ "-h" ],
            "description": "Display help."
        },
        {
            "name": "--info",
            "description": "Display .NET information."
        },
        {
            "name": "--list-sdks",
            "description": "Display the installed SDKs."
        },
        {
            "name": "--list-runtimes",
            "description": "Display the installed runtimes."
        }
    ],
    "commands": [
        {
            "name": "build",
            "arguments": [
                {
                    "name": "PROJECT | SOLUTION",
                    "description": "The project or solution file to operate on. If a file is not specified, the command will search the current directory for one.",
                }
            ],
            "options": [
                {
                    "name": "--configuration",
                    "aliases": [ "-c" ],
                    "description": "The configuration to use for building the project. The default for most projects is 'Debug'.",
                    "arguments": [
                        {
                            "name": "CONFIGURATION",
                            "required": true,
                            "arity": {
                                "minimum": 1,
                                "maximum": 1
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
```