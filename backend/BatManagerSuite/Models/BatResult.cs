using System;

namespace BatManagerSuite.Models;

public enum BatStatus
{
    Success,
    Error,
    Timeout
}

public class BatResult
{
    public string FileName { get; set; } = string.Empty;
    public string FullPath { get; set; } = string.Empty;
    public BatStatus Status { get; set; }
    public TimeSpan Elapsed { get; set; }

    public double ElapsedMilliseconds => Elapsed.TotalMilliseconds;
}

