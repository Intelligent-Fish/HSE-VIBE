using System.Threading;
using System.Threading.Tasks;

namespace BatManagerSuite.Services;

public interface IUpdateService
{
    Task EnsureLatestBatFilesAsync(CancellationToken cancellationToken = default);
}

