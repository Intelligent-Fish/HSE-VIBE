using System;
using Serilog;

namespace BatManagerSuite.Services;

public class LogService : ILogService
{
    public event Action<string>? LogMessage;

    public void Info(string message)
    {
        Log.Information("{Message}", message);
        LogMessage?.Invoke(message);
    }

    public void Error(string message, Exception? exception = null)
    {
        if (exception is null)
        {
            Log.Error("{Message}", message);
        }
        else
        {
            Log.Error(exception, "{Message}", message);
        }

        LogMessage?.Invoke(message);
    }
}

