using System.Threading;
using System.Threading.Tasks;

namespace BatManagerSuite.Services;

public interface IGitHubService
{
    Task<(string tagName, string assetDownloadUrl)> GetLatestReleaseAsync(CancellationToken cancellationToken = default);
    Task<string> DownloadAssetAsync(string downloadUrl, CancellationToken cancellationToken = default);
}

