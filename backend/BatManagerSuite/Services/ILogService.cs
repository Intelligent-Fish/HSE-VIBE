using System;

namespace BatManagerSuite.Services;

public interface ILogService
{
    event Action<string>? LogMessage;

    void Info(string message);
    void Error(string message, Exception? exception = null);
}

