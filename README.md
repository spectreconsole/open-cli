# OpenCLI

The OpenCLI specification (OCS) defines a standard, platform and
language agnostic interface to CLI applications which allows both humans
and computers to understand how a CLI tool should be invoked without
access to source code or documentation.

[https://opencli.org][opencli]  

## Usage

* Create documentation for CLI tools
* Generate clients for interacting with CLI tools
* Automate external tools such as MCP servers
* Detect changes in CLI APIs
* Generate auto-completion scripts

## Contribute

The OpenCLI specification is currently a draft, and we need discussions 
with the community to make sure that the first version can be as good as possible.

Head over to our [discussions][discussions] if you have feedback or ideas!

## Building

We're using [Cake][cake] 
to build the OpenCLI JSON schema, and site. 

For this you will need to have the .NET 9.0 SDK installed
which you can find over at [https://dotnet.microsoft.com/en-us/download][dotnet].

After installing the .NET SDK, make sure that you've 
restored Cake by running the following in the repository root:

```shell
$ dotnet tool restore
```

After that, running the build is as easy as writing:

```shell
$ dotnet make
```

[opencli]: https://opencli.org
[discussions]: https://github.com/spectreconsole/open-cli/discussions
[cake]: https://github.com/cake-build/cake
[dotnet]: https://dotnet.microsoft.com/en-us/download