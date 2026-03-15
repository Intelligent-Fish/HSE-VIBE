import { useState, useEffect, useRef } from "react";
import { Dashboard } from "./components/Dashboard";
import { Modes } from "./components/Modes";
import { Results } from "./components/Results";
import { Settings } from "./components/Settings";
import { Logs } from "./components/Logs";
import "./style/style.css";

type Mode = "deep" | "fast";
type Tab = "dashboard" | "modes" | "results" | "settings" | "logs";
type Status = "idle" | "checking" | "running" | "error";

interface LogEntry {
  timestamp: string;
  level: "info" | "success" | "warning" | "error";
  message: string;
}

interface ResultItem {
  id: number;
  name: string;
  status: "success" | "error";
  responseTime: number;
  action: string;
}

const API_URL = "http://localhost:5000/api";
const APP_VERSION = "1.0.0";

function App() {
  // === Глобальные состояния ===
  const [isOn, setIsOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("fast");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // === Dashboard ===
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [lastRun, setLastRun] = useState<{ time: string; result: string } | null>(null);
  
  // === Modes ===
  const [healthUrl, setHealthUrl] = useState("https://example.com/health");
  const [timeout, setTimeout] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  
  // === Результаты ===
  const [results] = useState<ResultItem[]>([
    { id: 1, name: "update_core.bat", status: "success", responseTime: 124, action: "Запущен" },
    { id: 2, name: "clean_cache.bat", status: "error", responseTime: 0, action: "Ошибка" },
    { id: 3, name: "sync_data.bat", status: "success", responseTime: 89, action: "Запущен" },
  ]);
  
  // === Settings ===
  const [runOnStartup, setRunOnStartup] = useState(false);
  const [silentMode, setSilentMode] = useState(false);
  const [requireConfirm, setRequireConfirm] = useState(true);
  
  // === Logs ===
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: "12:34:56", level: "info", message: "Приложение запущено" },
    { timestamp: "12:35:01", level: "success", message: "Проверка соединения: ОК" },
    { timestamp: "12:35:15", level: "warning", message: "Файл config.bat не найден, создан новый" },
  ]);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Автоскролл логов
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  // === Связанные состояния (deep/fast ↔ Режим 1/2) ===
  const checkMode = mode === "deep" ? "all" : "first";

  // === Helpers ===
  const addLog = (level: LogEntry["level"], message: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
  };

  const getStatusColor = (s: Status) => {
    switch (s) {
      case "idle": return "#6b7280";
      case "checking": return "#3b82f6";
      case "running": return "#22c55e";
      case "error": return "#ef4444";
      default: return "#6b7280";
    }
  };

  const getStatusText = (s: Status) => {
    switch (s) {
      case "idle": return "Ожидание";
      case "checking": return "Проверка";
      case "running": return "Выполняется";
      case "error": return "Ошибка";
      default: return "Неизвестно";
    }
  };

  // === Обработчик переключения режима (связывает deep/fast с Режим 1/2) ===
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    // Автоматически переключаем Режим 1/2 в зависимости от deep/fast
    // deep = Режим 1 (all), fast = Режим 2 (first)
  };

  // === Обработчик переключения режима из вкладки "Режимы" ===
  const handleCheckModeChange = (newCheckMode: "all" | "first") => {
    // При смене Режима 1/2 меняем и deep/fast
    setMode(newCheckMode === "all" ? "deep" : "fast");
  };

  // === Handlers ===
  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setStatus("checking");
    try {
      const response = await fetch(`${API_URL}/accelerator/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !isOn, mode }),
      });
      if (!response.ok) throw new Error("Ошибка сервера");
      const data = await response.json();
      setIsOn(data.isOn);
      setStatus(data.isOn ? "running" : "idle");
      setLastRun({ time: new Date().toLocaleTimeString(), result: data.isOn ? "Успех" : "Выключено" });
      addLog(data.isOn ? "success" : "info", `Ускоритель ${data.isOn ? "включен" : "выключен"}`);
    } catch (error) {
      console.error(error);
      setStatus("error");
      addLog("error", "Ошибка подключения к бэкенду");
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  };

  const handleCheckUpdates = async () => {
    setStatus("checking");
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus("idle");
          addLog("success", "Обновлений не найдено");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRunCheck = async () => {
    setIsChecking(true);
    setStatus("running");
    addLog("info", `Запуск проверки: ${healthUrl}`);
    try {
      await fetch(`${API_URL}/accelerator/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: healthUrl, timeout, mode: checkMode }),
      });
      addLog("success", "Проверка завершена");
      setLastRun({ time: new Date().toLocaleTimeString(), result: "Проверка завершена" });
    } catch (error) {
      addLog("error", "Ошибка при проверке");
      setStatus("error");
    } finally {
      setIsChecking(false);
      setProgress(100);
    }
  };

  const handleStopCheck = () => {
    setIsChecking(false);
    setStatus("idle");
    addLog("warning", "Проверка остановлена пользователем");
  };

  const handleSaveSettings = async () => {
    try {
      await fetch(`${API_URL}/settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runOnStartup, silentMode, requireConfirm }),
      });
      addLog("success", "Настройки сохранены");
    } catch (error) {
      addLog("error", "Ошибка сохранения настроек");
    }
  };

  const clearLogs = () => setLogs([]);
  
  const saveLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level.toUpperCase()}] ${l.message}`).join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logs-${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // === Рендер вкладок ===
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            appVersion={APP_VERSION}
            status={status}
            progress={progress}
            lastRun={lastRun}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            onCheckUpdates={handleCheckUpdates}
          />
        );
      case "modes":
        return (
          <Modes
            healthUrl={healthUrl}
            timeout={timeout}
            checkMode={checkMode}
            isChecking={isChecking}
            onHealthUrlChange={setHealthUrl}
            onTimeoutChange={setTimeout}
            onCheckModeChange={handleCheckModeChange}
            onRunCheck={handleRunCheck}
            onStopCheck={handleStopCheck}
          />
        );
      case "results":
        return (
          <Results
            results={results}
            onAddLog={addLog}
          />
        );
      case "settings":
        return (
          <Settings
            runOnStartup={runOnStartup}
            silentMode={silentMode}
            requireConfirm={requireConfirm}
            onRunOnStartupChange={setRunOnStartup}
            onSilentModeChange={setSilentMode}
            onRequireConfirmChange={setRequireConfirm}
            onSaveSettings={handleSaveSettings}
          />
        );
      case "logs":
        return (
          <Logs
            logs={logs}
            logsEndRef={logsEndRef}
            onClearLogs={clearLogs}
            onSaveLogs={saveLogs}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      {/* Заголовок */}
      <div className="header">
        <h1 className="title title-fire">добрый запрет</h1>
        <div className="orange-sticker">🍊</div>
      </div>

      {/* Основная кнопка */}
      <div className="main-button-container">
        <div className={`circle-wrapper ${isLoading ? 'loading' : ''}`}>
          <div className={`progress-ring ${isOn ? 'active' : ''}`}>
            <svg width="300" height="300" viewBox="0 0 300 300">
              <circle className="progress-ring-fill" cx="150" cy="150" r="146" />
            </svg>
          </div>
          <button
            className={`main-button ${isOn ? 'on' : 'off'}`}
            onClick={handleToggle}
            disabled={isLoading}
          >
            <div className="power-icon">
              {isLoading ? (
                <div className="loading-spinner"></div>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round"/>
                  <line x1="12" y1="2" x2="12" y2="12" strokeLinecap="round"/>
                </svg>
              )}
            </div>
          </button>
        </div>
        <p className="status-text">{isOn ? "Ускоритель активен" : "Ускоритель выключен"}</p>
      </div>

      {/* Переключатель режимов — СВЯЗАН С ВКЛАДКОЙ "РЕЖИМЫ" */}
      <div className="mode-switcher">
        <button
          className={`mode-button ${mode === "deep" ? "active" : ""}`}
          onClick={() => handleModeChange("deep")}
        >
          deep
        </button>
        <button
          className={`mode-button ${mode === "fast" ? "active" : ""}`}
          onClick={() => handleModeChange("fast")}
        >
          fast
        </button>
      </div>

      {/* Вкладки */}
      <div className="tabs-container">
        <div className="tabs-nav">
          {(["dashboard", "modes", "results", "settings", "logs"] as Tab[]).map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "dashboard" && "📊 "}
              {tab === "modes" && "⚙️ "}
              {tab === "results" && "📋 "}
              {tab === "settings" && "🔧 "}
              {tab === "logs" && "📝 "}
              {tab === "dashboard" && "Дашборд"}
              {tab === "modes" && "Режимы"}
              {tab === "results" && "Результаты"}
              {tab === "settings" && "Настройки"}
              {tab === "logs" && "Логи"}
            </button>
          ))}
        </div>
        <div className="tabs-panel">
          {renderTabContent()}
        </div>
      </div>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-bar-left">
          <span className="connection-status">
            <span className="connection-dot"></span>
            Интернет: <span className="connection-text">Подключено</span>
          </span>
        </div>
        <div className="status-bar-right">
          <span>Версия: {APP_VERSION}</span>
        </div>
      </div>
    </div>
  );
}

export default App;