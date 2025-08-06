import "@typespec/json-schema";
import "./scalars.tsp";

using TypeSpec.JsonSchema;

@jsonSchema
@doc("The OpenCLI description")
model OpenCLI {
  @doc("The OpenCLI version number")
  opencli: string;

  @doc("Information about the CLI")
  info: CliInfo;

  @doc("The conventions used by the CLI")
  conventions?: Conventions;

  @doc("Root command arguments")
  arguments?: Argument[];

  @doc("Root command options")
  options?: Option[];

  @doc("Root command sub commands")
  commands?: Command[];

  @doc("Root command exit codes")
  exitCodes?: ExitCode[];

  @doc("Examples of how to use the CLI")
  examples?: string[];

  @doc("Indicates whether or not the command requires interactive input")
  interactive?: boolean;

  @doc("Custom metadata")
  metadata?: Metadata[];
}

model CliInfo {
  @doc("The application title")
  title: string;

  @doc("A description of the application")
  description?: string;

  @doc("The contact information")
  contact?: Contact;

  @doc("The application license")
  license?: License;

  @doc("The application version")
  version: string;
}

model Conventions {
  @doc("Whether or not grouping of short options are allowed")
  groupOptions?: boolean = true;

  @doc("The option argument separator")
  optionSeparator?: string = " ";
}

@doc("Contact information")
model Contact {
  @doc("The identifying name of the contact person/organization")
  name?: string;

  @doc("The URI for the contact information. This MUST be in the form of a URI.")
  url?: url;

  @doc("The email address of the contact person/organization. This MUST be in the form of an email address.")
  email?: email;
}

model License {
  @doc("The license name")
  name?: string;

  @doc("The SPDX license identifier")
  identifier?: string;
}

model Command {
  @doc("The command name")
  name: string;

  @doc("The command aliases")
  @uniqueItems
  aliases?: string[];

  @doc("The command options")
  options?: Option[];

  @doc("The command arguments")
  arguments?: Argument[];

  @doc("The command's sub commands")
  commands?: Command[];

  @doc("The command's exit codes")
  exitCodes?: ExitCode[];

  @doc("The command description")
  description?: string;

  @doc("Whether or not the command is hidden")
  hidden?: boolean = false;

  @doc("Examples of how to use the command")
  examples?: string[];

  @doc("Indicate whether or not the command requires interactive input")
  interactive?: boolean;

  @doc("Custom metadata")
  metadata?: Metadata[];
}

model Argument {
  @doc("The argument name")
  name: string;

  @doc("Whether or not the argument is required")
  required?: boolean;

  @doc("The argument arity. Arity defines the minimum and maximum number of argument values")
  arity?: Arity;

  @doc("A list of accepted values")
  acceptedValues?: string[];

  @doc("The argument group")
  group?: string;

  @doc("The argument description")
  description?: string;

  @doc("Whether or not the argument is hidden")
  hidden?: boolean = false;

  @doc("Custom metadata")
  metadata?: Metadata[];
}

model Option {
  @doc("The option name")
  name: string;

  @doc("Whether or not the option is required")
  required?: boolean;

  @doc("The option's aliases")
  @uniqueItems
  aliases?: string[];

  @doc("The option's arguments")
  arguments?: Argument[];

  @doc("The option group")
  group?: string;

  @doc("The option description")
  description?: string;

  @doc("Specifies whether the option is accessible from the immediate parent command and, recursively, from its subcommands")
  recursive?: boolean = false;

  @doc("Whether or not the option is hidden")
  hidden?: boolean = false;

  @doc("Custom metadata")
  metadata?: Metadata[];
}

model ExitCode {
  @doc("The exit code")
  code: integer;

  @doc("The exit code description")
  description?: string;
}

@doc("Arity defines the minimum and maximum number of argument values")
model Arity {
  @doc("The minimum number of values allowed")
  @minValue(0)
  minimum?: integer;

  @doc("The maximum number of values allowed")
  @minValue(0)
  maximum?: integer;
}

model Metadata {
  name: string;
  value?: unknown;
}