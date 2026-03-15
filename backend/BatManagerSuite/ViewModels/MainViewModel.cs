using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using BatManagerSuite.Models;
using BatManagerSuite.Services;

namespace BatManagerSuite.ViewModels;

public class MainViewModel : INotifyPropertyChanged
{
    private readonly IBatService _batService;
    private readonly ILogService _logService;

    private int _progress;
    private string _statusText = "Ожидание";
    private string _currentMode = "Ожидание";
    private bool _isBusy;
    private bool _isOn;
    private CancellationTokenSource? _cts;

    public ObservableCollection<BatResult> Results { get; } = new();
    public ObservableCollection<string> Logs { get; } = new();

    public int Progress
    {
        get => _progress;
        set
        {
            if (value == _progress) return;
            _progress = value;
            OnPropertyChanged();
        }
    }

    public string StatusText
    {
        get => _statusText;
        set
        {
            if (value == _statusText) return;
            _statusText = value;
            OnPropertyChanged();
        }
    }

    public string CurrentMode
    {
        get => _currentMode;
        set
        {
            if (value == _currentMode) return;
            _currentMode = value;
            OnPropertyChanged();
        }
    }

    public bool IsBusy
    {
        get => _isBusy;
        set
        {
            if (value == _isBusy) return;
            _isBusy = value;
            OnPropertyChanged();
        }
    }

    public bool IsOn
    {
        get => _isOn;
        set
        {
            if (value == _isOn) return;
            _isOn = value;
            OnPropertyChanged();
            OnPropertyChanged(nameof(AcceleratorStatusText));
        }
    }

    public string AcceleratorStatusText => IsOn ? "Ускоритель включен" : "Ускоритель выключен";

    public ICommand CheckAllCommand { get; }
    public ICommand FindFirstWorkingCommand { get; }

    public MainViewModel(IBatService batService, ILogService logService)
    {
        _batService = batService;
        _logService = logService;

        _logService.LogMessage += s =>
        {
            App.Current.Dispatcher.Invoke(() => Logs.Add(s));
        };

        CheckAllCommand = new AsyncRelayCommand(ExecuteCheckAllAsync, () => !IsBusy);
        FindFirstWorkingCommand = new AsyncRelayCommand(ExecuteFindFirstWorkingAsync, () => !IsBusy);
    }

    private async Task ExecuteCheckAllAsync()
    {
        if (IsBusy)
            return;

        IsBusy = true;
        CurrentMode = "Проверка всех файлов";
        Progress = 0;
        Results.Clear();

        _cts = new CancellationTokenSource();

        var progress = new Progress<int>(value => Progress = value);
        var status = new Progress<string>(value => StatusText = value);

        try
        {
            var results = await _batService.CheckAllAsync(progress, status, _cts.Token);
            App.Current.Dispatcher.Invoke(() =>
            {
                foreach (var r in results)
                {
                    Results.Add(r);
                }
            });

            // включаем индикатор, если есть хотя бы один успешный файл
            IsOn = results.Any(r => r.Status == BatStatus.Success);
        }
        finally
        {
            IsBusy = false;
            CurrentMode = "Ожидание";
        }
    }

    private async Task ExecuteFindFirstWorkingAsync()
    {
        if (IsBusy)
            return;

        IsBusy = true;
        CurrentMode = "Поиск первого рабочего";
        Progress = 0;
        Results.Clear();

        _cts = new CancellationTokenSource();

        var progress = new Progress<int>(value => Progress = value);
        var status = new Progress<string>(value => StatusText = value);

        try
        {
            var result = await _batService.FindFirstWorkingAsync(progress, status, _cts.Token);
            if (result != null)
            {
                App.Current.Dispatcher.Invoke(() => Results.Add(result));
            }
            IsOn = result is { Status: BatStatus.Success };
        }
        finally
        {
            IsBusy = false;
            CurrentMode = "Ожидание";
        }
    }

    public event PropertyChangedEventHandler? PropertyChanged;

    protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));

        (CheckAllCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
        (FindFirstWorkingCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
    }
}

