public static class Utilities
{
    public static void Npm(
        this ICakeContext context,
        string[] arguments,
        DirectoryPath? workingDirectory = null)
    {
        var executable = GetNpmExecutable(context);
        if (executable == null)
        {
            throw new InvalidOperationException("Could not locate 'npm'");
        }

        RunProcess(context, executable, arguments, workingDirectory);
    }

    public static void Npx(
        this ICakeContext context,
        string[] arguments,
        DirectoryPath? workingDirectory = null)
    {
        var executable = GetNpxExecutable(context);
        if (executable == null)
        {
            throw new InvalidOperationException("Could not locate 'npm'");
        }

        RunProcess(context, executable, arguments, workingDirectory);
    }

    public static void RunProcess(
        this ICakeContext context,
        string executable,
        string[] arguments,
        DirectoryPath? workingDirectory = null)
    {
        var args = ProcessArgumentBuilder.FromStrings(arguments);
        var exitCode = StartProcess(executable, new ProcessSettings
        {
            Arguments = args,
            WorkingDirectory = workingDirectory?.MakeAbsolute(context.Environment),
        });

        if (exitCode != 0)
        {
            throw new InvalidOperationException(
                $"The tool '{executable}' returned a non-zero exit code");
        }
    }

    private static string? GetNpmExecutable(ICakeContext context)
    {
        if (context.IsRunningOnWindows())
        {
            return context.Tools.Resolve("npm.cmd")?.FullPath;
        }
        else
        {
            return context.Tools.Resolve("npm")?.FullPath;
        }
    }
    
    private static string? GetNpxExecutable(ICakeContext context)
    {
        if (context.IsRunningOnWindows())
        {
            return context.Tools.Resolve("npx.cmd")?.FullPath;
        }
        else
        {
            return context.Tools.Resolve("npx")?.FullPath;
        }
    }
}