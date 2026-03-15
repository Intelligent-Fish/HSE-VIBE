using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using BatManagerSuite.Models;

namespace BatManagerSuite.Services;

public interface IBatService
{
    Task<IReadOnlyList<BatResult>> CheckAllAsync(IProgress<int> progress, IProgress<string> status, CancellationToken cancellationToken = default);
    Task<BatResult?> FindFirstWorkingAsync(IProgress<int> progress, IProgress<string> status, CancellationToken cancellationToken = default);
}

