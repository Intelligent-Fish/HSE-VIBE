using System;
using System.IO;
using System.IO.Compression;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using BatManagerSuite.Models;
using Serilog;

namespace BatManagerSuite.Services;

public class UpdateService : IUpdateService
{
    private readonly IGitHubService _gitHubService;
    private readonly AppPaths _paths;

    public UpdateService(IGitHubService gitHubService, AppPaths paths)
    {
        _gitHubService = gitHubService;
        _paths = paths;
    }

    public async Task EnsureLatestBatFilesAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            var config = await LoadConfigAsync(cancellationToken);
            var (latestTag, downloadUrl) = await _gitHubService.GetLatestReleaseAsync(cancellationToken);

            if (string.Equals(config.LastReleaseTag, latestTag, StringComparison.OrdinalIgnoreCase))
            {
                Log.Information("Установлена актуальная версия релиза {Tag}, обновление не требуется.", latestTag);
                return;
            }

            var zipPath = await _gitHubService.DownloadAssetAsync(downloadUrl, cancellationToken);

            if (Directory.Exists(_paths.CacheDirectory))
            {
                Directory.Delete(_paths.CacheDirectory, recursive: true);
            }

            Directory.CreateDirectory(_paths.CacheDirectory);
            ZipFile.ExtractToDirectory(zipPath, _paths.CacheDirectory);
            Log.Information("Архив распакован в {Dir}", _paths.CacheDirectory);

            config.LastReleaseTag = latestTag;
            await SaveConfigAsync(config, cancellationToken);
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Ошибка при проверке или обновлении .bat файлов из GitHub.");
        }
    }

    private async Task<AppConfig> LoadConfigAsync(CancellationToken cancellationToken)
    {
        if (!File.Exists(_paths.ConfigFilePath))
        {
            return new AppConfig();
        }

        await using var stream = File.OpenRead(_paths.ConfigFilePath);
        var config = await JsonSerializer.DeserializeAsync<AppConfig>(stream, cancellationToken: cancellationToken);
        return config ?? new AppConfig();
    }

    private async Task SaveConfigAsync(AppConfig config, CancellationToken cancellationToken)
    {
        await using var stream = File.Create(_paths.ConfigFilePath);
        await JsonSerializer.SerializeAsync(stream, config, new JsonSerializerOptions
        {
            WriteIndented = true
        }, cancellationToken);
    }
}

