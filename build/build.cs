var target = Argument("target", defaultValue: "Default");
if (target == "Default")
{
    AnsiConsole.Write(new FigletText("OpenCLI"));
    AnsiConsole.Write(
        new Table()
        .AddColumns("Target", "")
        .AddRow("[yellow]clean[/]", "Cleans up artifacts")
        .AddRow("[yellow]build-schema[/]", "Builds the JSON schema")
        .AddRow("[yellow]build-explorer[/]", "Builds the OpenCLI explorer")
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

Task("Clean")
    .Does(ctx =>
{
    ctx.CleanDirectory("./.artifacts");
});

Task("Update-Site-Contents")
    .Does(ctx =>
{
    ctx
        .TransformTextFile("./site/docs/spec.template", "<%", "%>")
        .WithToken("SPEC", System.IO.File.ReadAllText("./draft.md"))
        .Save("./site/docs/spec.md");

    ctx.EnsureDirectoryExists("./site/static/descriptions");
    foreach (var file in ctx.GetFiles("./examples/*.json"))
    {
        var json = System.IO.File.ReadAllText(file.FullPath)
            .Replace("\"../schema.json\"", "\"https://opencli.org/draft.json\"");

        System.IO.File.WriteAllText(
            $"./site/static/descriptions/{file.GetFilename()}", json);
    }

    ctx.CopyFile("./schema.json", "./site/static/draft.json");
});

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

Task("Build-Explorer")
    .Does(ctx =>
{
    ctx.Npm(arguments: ["ci"], workingDirectory: "./explorer");
    ctx.Npm(arguments: ["run build"], workingDirectory: "./explorer");

    ctx.CopyFile(
        "./explorer/dist/opencli-explorer.js",
        "./site/static/opencli-explorer.js");
});

Task("Build-Site")
    .IsDependentOn("Clean")
    .IsDependentOn("Update-Site-Contents")
    .IsDependentOn("Build-Explorer")
    .Does(ctx =>
{
    ctx.Npm(
        arguments: ["ci"],
        workingDirectory: "./site");

    ctx.Npm(
        arguments: ["run build"],
        workingDirectory: "./site");
});

Task("Run-Site")
    .IsDependentOn("Update-Site-Contents")
    .IsDependentOn("Build-Explorer")
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
