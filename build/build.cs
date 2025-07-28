var target = Argument("target", defaultValue: "Default");
if (target == "Default")
{
    AnsiConsole.Write(new FigletText("OpenCLI"));
    AnsiConsole.Write(
        new Table()
        .AddColumns("Target", "")
        .AddRow("[yellow]clean[/]", "Cleans up artifacts")
        .AddRow("[yellow]build-schema[/]", "Builds the JSON schema")
        .AddRow("[yellow]build-site[/]", "Builds the site")
        .AddRow("[yellow]run-site[/]", "Runs the site locally")
        .AddRow("[yellow]ci[/]", "Runs the CI build locally")
    );

    Environment.Exit(1);
}

//////////////////////////////////////////////////////////////////////
// TARGETS
//////////////////////////////////////////////////////////////////////

Task("CI")
    .IsDependentOn("Build-Schema")
    .IsDependentOn("Build-Site");

//////////////////////////////////////////////////////////////////////
// TASKS
//////////////////////////////////////////////////////////////////////

// Clears all artifacts
Task("Clean")
    .Does(ctx =>
{
    ctx.CleanDirectory("./.artifacts");
});

// Updates the site contents
Task("Update-Site-Contents")
    .Does(ctx =>
{
    // Copy the draft.md content into the site
    ctx
        .TransformTextFile("./site/docs/spec.template", "<%", "%>")
        .WithToken("SPEC", System.IO.File.ReadAllText("./draft.md"))
        .Save("./site/docs/spec.md");

    // Copy the schema
    ctx.CopyFile("./schema.json", "./site/static/draft.json");
});

// Builds the JSON schema
Task("Build-Schema")
    .IsDependentOn("Clean")
    .Does(ctx =>
{
    ctx.Npm(arguments: ["install"], workingDirectory: "./typespec");
    ctx.Npm(arguments: ["run", "tsp-compile"], workingDirectory: "./typespec");

    // TODO: No overload for overwriting?
    if (ctx.FileExists("./schema.json"))
    {
        ctx.DeleteFile("./schema.json");
    }

    ctx.CopyFile("./.artifacts/@typespec/json-schema/OpenCLI.json", "./.artifacts/schema.json");
    ctx.CopyFile("./.artifacts/@typespec/json-schema/OpenCLI.json", "./schema.json");
});

// Builds the site
Task("Build-Site")
    .IsDependentOn("Clean")
    .IsDependentOn("Update-Site-Contents")
    .Does(ctx =>
{
    ctx.Npm(
        arguments: ["ci"],
        workingDirectory: "./site");

    ctx.Npm(
        arguments: ["run build"],
        workingDirectory: "./site");
});

// Runs the site locally
Task("Run-Site")
    .IsDependentOn("Update-Site-Contents")
    .Does(ctx =>
{
    ctx.Npm(
        arguments: ["install"],
        workingDirectory: "./site");

    ctx.Npx(
        arguments: ["docusaurus", "start"],
        workingDirectory: "./site");
});

//////////////////////////////////////////////////////////////////////
// EXECUTION
//////////////////////////////////////////////////////////////////////

RunTarget(target);
