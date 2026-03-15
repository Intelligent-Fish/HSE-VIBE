using System;
using System.IO;

namespace BatManagerSuite.Services;

public class AppPaths
{
    public string BaseDirectory { get; }
    public string CacheDirectory { get; }
    public string LogsDirectory { get; }
    public string ConfigFilePath { get; }

    public AppPaths()
    {
        var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        BaseDirectory = Path.Combine(appData, "BatManager");
        CacheDirectory = Path.Combine(BaseDirectory, "cache");
        LogsDirectory = Path.Combine(BaseDirectory, "logs");
        ConfigFilePath = Path.Combine(BaseDirectory, "config.json");

        Directory.CreateDirectory(BaseDirectory);
        Directory.CreateDirectory(CacheDirectory);
        Directory.CreateDirectory(LogsDirectory);
    }
}

