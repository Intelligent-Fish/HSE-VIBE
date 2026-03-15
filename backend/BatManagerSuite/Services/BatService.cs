using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using BatManagerSuite.Models;
using Serilog;

namespace BatManagerSuite.Services;

public class BatService : IBatService
{
    private readonly AppPaths _paths;
    private readonly ILogService _logService;
    private static readonly HttpClient HttpClient = new()
    {
        Timeout = TimeSpan.FromSeconds(4)
    };

    public BatService(AppPaths paths, ILogService logService)
    {
        _paths = paths;
        _logService = logService;
    }

    public async Task<IReadOnlyList<BatResult>> CheckAllAsync(IProgress<int> progress, IProgress<string> status, CancellationToken cancellationToken = default)
    {
        var batFiles = GetBatFiles().ToArray();
        var total = batFiles.Length;
        var results = new List<BatResult>(total);

        if (total == 0)
        {
            _logService.Info("В кэше не найдено .bat файлов.");
            return results;
        }

        for (var index = 0; index < total; index++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var file = batFiles[index];
            var fileName = Path.GetFileName(file);
            status.Report($"Проверка: {fileName} ({index + 1}/{total})");

            var result = await RunOnceAsync(file, cancellationToken);
            results.Add(result);

            LogResult(result, isFirstWorkingMode: false);

            var percent = (int)Math.Round(((index + 1) / (double)total) * 100);
            progress.Report(percent);
        }

        var best = results
            .Where(r => r.Status == BatStatus.Success)
            .OrderBy(r => r.Elapsed)
            .FirstOrDefault();

        if (best != null)
        {
            StartPersistent(best.FullPath);
            var message = $"Запущен самый быстрый файл: {best.FileName} ({best.Elapsed.TotalMilliseconds:F0} мс).";
            _logService.Info(message);
            Application.Current.Dispatcher.Invoke(() =>
            {
                MessageBox.Show(message, "BatManager", MessageBoxButton.OK, MessageBoxImage.Information);
            });
        }

        return results;
    }

    public async Task<BatResult?> FindFirstWorkingAsync(IProgress<int> progress, IProgress<string> status, CancellationToken cancellationToken = default)
    {
        var batFiles = GetBatFiles().ToArray();
        var total = batFiles.Length;

        if (total == 0)
        {
            _logService.Info("В кэше не найдено .bat файлов.");
            return null;
        }

        for (var index = 0; index < total; index++)
        {
            cancellationToken.ThrowIfCancellationRequested();

            var file = batFiles[index];
            var fileName = Path.GetFileName(file);
            status.Report($"Проверка: {fileName} ({index + 1}/{total})");

            var result = await RunOnceAsync(file, cancellationToken);
            LogResult(result, isFirstWorkingMode: true);

            var percent = (int)Math.Round(((index + 1) / (double)total) * 100);
            progress.Report(percent);

            if (result.Status == BatStatus.Success)
            {
                StartPersistent(result.FullPath);
                var message = $"Найден рабочий файл: {result.FileName}. Поиск остановлен.";
                _logService.Info(message);
                Application.Current.Dispatcher.Invoke(() =>
                {
                    MessageBox.Show(message, "BatManager", MessageBoxButton.OK, MessageBoxImage.Information);
                });

                return result;
            }
        }

        _logService.Info("Рабочие .bat файлы не найдены.");
        return null;
    }

    private IEnumerable<string> GetBatFiles()
    {
        if (!Directory.Exists(_paths.CacheDirectory))
        {
            return Array.Empty<string>();
        }

        return Directory.EnumerateFiles(_paths.CacheDirectory, "*.bat", SearchOption.AllDirectories);
    }

    private static async Task<BatResult> RunOnceAsync(string path, CancellationToken cancellationToken)
    {
        var fileName = Path.GetFileName(path);
        var result = new BatResult
        {
            FileName = fileName,
            FullPath = path
        };

        var psi = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = $"/c \"\"{path}\"\"",
            UseShellExecute = false,
            CreateNoWindow = true,
            WindowStyle = ProcessWindowStyle.Hidden
        };

        using var process = new Process { StartInfo = psi };
        try
        {
            process.Start();
        }
        catch (Exception ex)
        {
            var swFail = Stopwatch.StartNew();
            swFail.Stop();
            Log.Warning(ex, "Не удалось запустить .bat файл {File}", path);
            result.Status = BatStatus.Error;
            result.Elapsed = swFail.Elapsed;
            return result;
        }

        var timeout = TimeSpan.FromSeconds(4);

        try
        {
            var exited = await Task.Run(() => process.WaitForExit((int)timeout.TotalMilliseconds), cancellationToken);

            if (!exited)
            {
                try
                {
                    process.Kill();
                }
                catch
                {
                    // ignored
                }

                result.Status = BatStatus.Timeout;
                result.Elapsed = timeout;
            }
            else
            {
                if (process.ExitCode != 0)
                {
                    result.Status = BatStatus.Error;
                    result.Elapsed = timeout;
                }
                else
                {
                    // батник отработал, теперь меряем доступность YouTube
                    var swHttp = Stopwatch.StartNew();
                    try
                    {
                        using var response = await HttpClient.GetAsync("https://www.youtube.com/", cancellationToken);
                        swHttp.Stop();

                        if (response.IsSuccessStatusCode && swHttp.Elapsed <= timeout)
                        {
                            result.Status = BatStatus.Success;
                            result.Elapsed = swHttp.Elapsed;
                        }
                        else
                        {
                            result.Status = BatStatus.Timeout;
                            result.Elapsed = swHttp.Elapsed > timeout ? timeout : swHttp.Elapsed;
                        }
                    }
                    catch (Exception)
                    {
                        swHttp.Stop();
                        result.Status = BatStatus.Error;
                        result.Elapsed = swHttp.Elapsed;
                    }
                }
            }
        }
        catch (OperationCanceledException)
        {
            try
            {
                if (!process.HasExited)
                {
                    process.Kill();
                }
            }
            catch
            {
                // ignored
            }

            result.Status = BatStatus.Error;
            result.Elapsed = timeout;
        }

        return result;
    }

    private void LogResult(BatResult result, bool isFirstWorkingMode)
    {
        var statusText = result.Status == BatStatus.Success ? "Успех" :
            result.Status == BatStatus.Timeout ? "Таймаут" : "Ошибка";

        var message =
            $"Проверка файла: {result.FileName} | Время: {result.Elapsed.TotalMilliseconds:F0} мс | Статус: {statusText}";

        if (result.Status == BatStatus.Success)
        {
            if (isFirstWorkingMode)
            {
                _logService.Info($"{message} (режим: Первый рабочий)");
            }
            else
            {
                _logService.Info(message);
            }
        }
        else
        {
            _logService.Error(message);
        }
    }

    private static void StartPersistent(string path)
    {
        var psi = new ProcessStartInfo
        {
            FileName = path,
            UseShellExecute = true,
            CreateNoWindow = false
        };

        Process.Start(psi);
    }
}

