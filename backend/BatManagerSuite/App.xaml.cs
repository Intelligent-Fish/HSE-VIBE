using System;
using System.IO;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using BatManagerSuite.Services;
using BatManagerSuite.ViewModels;

namespace BatManagerSuite;

public partial class App : Application
{
    private IHost? _host;

    protected override void OnStartup(StartupEventArgs e)
    {
        base.OnStartup(e);

        var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
        var baseDir = Path.Combine(appData, "BatManager");
        Directory.CreateDirectory(baseDir);

        var logDir = Path.Combine(baseDir, "logs");
        Directory.CreateDirectory(logDir);

        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.Async(c => c.File(
                Path.Combine(logDir, "app-.log"),
                rollingInterval: RollingInterval.Day,
                retainedFileCountLimit: 7,
                outputTemplate: "[{Timestamp:yyyy-MM-dd HH:mm:ss}]" +
                                " [{Level:u3}] {Message:lj}{NewLine}{Exception}"))
            .CreateLogger();

        _host = Host.CreateDefaultBuilder()
            .ConfigureServices(ConfigureServices)
            .Build();

        var updateService = _host.Services.GetRequiredService<IUpdateService>();
        // тихая проверка обновлений и скачивание bat файлов при старте
        _ = updateService.EnsureLatestBatFilesAsync();

        var mainWindow = _host.Services.GetRequiredService<MainWindow>();
        mainWindow.Show();
    }

    private static void ConfigureServices(IServiceCollection services)
    {
        services.AddSingleton<AppPaths>();
        services.AddSingleton<IGitHubService, GitHubService>();
        services.AddSingleton<IUpdateService, UpdateService>();
        services.AddSingleton<IBatService, BatService>();
        services.AddSingleton<ILogService, LogService>();

        services.AddSingleton<MainViewModel>();

        services.AddSingleton<MainWindow>(sp =>
        {
            var vm = sp.GetRequiredService<MainViewModel>();
            var window = new MainWindow
            {
                DataContext = vm
            };
            return window;
        });
    }

    protected override void OnExit(ExitEventArgs e)
    {
        _host?.Dispose();
        Log.CloseAndFlush();
        base.OnExit(e);
    }
}