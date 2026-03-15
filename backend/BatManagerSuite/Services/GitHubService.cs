using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Serilog;

namespace BatManagerSuite.Services;

public class GitHubService : IGitHubService
{
    private readonly AppPaths _paths;
    private readonly HttpClient _httpClient;

    public GitHubService(AppPaths paths)
    {
        _paths = paths;
        _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(30)
        };
        _httpClient.DefaultRequestHeaders.UserAgent.Add(
            new ProductInfoHeaderValue("BatManagerSuite", "1.0.0"));
    }

    public async Task<(string tagName, string assetDownloadUrl)> GetLatestReleaseAsync(CancellationToken cancellationToken = default)
    {
        var url = $"https://api.github.com/repos/{AppConstants.GitHubOwner}/{AppConstants.GitHubRepo}/releases/latest";
        Log.Information("Запрос сведений о последнем релизе: {Url}", url);

        using var response = await _httpClient.GetAsync(url, cancellationToken);
        response.EnsureSuccessStatusCode();

        await using var stream = await response.Content.ReadAsStreamAsync(cancellationToken);
        using var document = await JsonDocument.ParseAsync(stream, cancellationToken: cancellationToken);

        var root = document.RootElement;
        var tagName = root.GetProperty("tag_name").GetString() ?? "unknown";

        var assets = root.GetProperty("assets");
        var asset = assets.EnumerateArray()
            .FirstOrDefault(a =>
                a.TryGetProperty("browser_download_url", out var u) &&
                u.GetString() is { } s &&
                s.EndsWith(".zip", StringComparison.OrdinalIgnoreCase));

        if (asset.ValueKind == JsonValueKind.Undefined)
            throw new InvalidOperationException("В последнем релизе не найден zip-архив.");

        var downloadUrl = asset.GetProperty("browser_download_url").GetString()
                         ?? throw new InvalidOperationException("Некорректный URL загрузки архива.");

        return (tagName, downloadUrl);
    }

    public async Task<string> DownloadAssetAsync(string downloadUrl, CancellationToken cancellationToken = default)
    {
        Log.Information("Загрузка архива релиза: {Url}", downloadUrl);

        using var response = await _httpClient.GetAsync(downloadUrl, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        // ВАЖНО: архив храним не в cache, т.к. cache очищается перед распаковкой.
        var fileName = $"release-{DateTime.UtcNow:yyyyMMddHHmmss}.zip";
        var targetPath = Path.Combine(_paths.BaseDirectory, fileName);

        await using var httpStream = await response.Content.ReadAsStreamAsync(cancellationToken);
        await using var fileStream = File.Create(targetPath);
        await httpStream.CopyToAsync(fileStream, cancellationToken);

        Log.Information("Архив сохранён в {Path}", targetPath);
        return targetPath;
    }
}

