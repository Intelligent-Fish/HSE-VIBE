import { useState, useEffect, useRef } from "react";
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

function App() {
  // === Глобальные состояния ===
  const [isOn, setIsOn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>("fast");
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  
  // === Dashboard ===
  const appVersion = "1.0.0";
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [lastRun, setLastRun] = useState<{ time: string; result: string } | null>(null);

  // === Modes ===
  const [healthUrl, setHealthUrl] = useState("https://example.com/health");
  const [timeout, setTimeout] = useState(30);
  const [checkMode, setCheckMode] = useState<"all" | "first">("all");
  const [isChecking, setIsChecking] = useState(false);

  // === Results ===
  const [results, setResults] = useState<ResultItem[]>([
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

  const API_URL = "http://localhost:5000/api";

  // Автоскролл логов
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

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
    
    // Имитация прогресса
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

  const addLog = (level: LogEntry["level"], message: string) => {
    setLogs(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    }]);
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

  // === Рендер вкладок ===
  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="tab-content">
            <div className="dashboard-grid">
              <div className="card">
                <h3>Версия приложения</h3>
                <p className="version-text">{appVersion}</p>
              </div>
              
              <div className="card">
                <h3>Статус</h3>
                <div className="status-indicator" style={{ borderColor: getStatusColor(status) }}>
                  <span className="status-dot" style={{ backgroundColor: getStatusColor(status) }}></span>
                  {getStatusText(status)}
                </div>
              </div>
              
              <div className="card">
                <h3>Обновления</h3>
                <button className="btn btn-primary" onClick={handleCheckUpdates}>
                  Проверить обновления
                </button>
                {progress > 0 && progress < 100 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                )}
              </div>
              
              <div className="card">
                <h3>Последний запуск</h3>
                {lastRun ? (
                  <>
                    <p>Время: {lastRun.time}</p>
                    <p className={lastRun.result === "Успех" ? "text-success" : "text-muted"}>
                      Результат: {lastRun.result}
                    </p>
                  </>
                ) : (
                  <p className="text-muted">Нет данных</p>
                )}
              </div>
            </div>
          </div>
        );

      case "modes":
        return (
          <div className="tab-content">
            <div className="form-group">
              <label>Health Check URL</label>
              <input
                type="url"
                value={healthUrl}
                onChange={(e) => setHealthUrl(e.target.value)}
                placeholder="https://example.com/health"
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label>Таймаут ответа (сек)</label>
              <input
                type="number"
                min="1"
                max="300"
                value={timeout}
                onChange={(e) => setTimeout(Number(e.target.value))}
                className="input-field"
              />
            </div>
            
            <div className="form-group">
              <label>Режим проверки</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="checkMode"
                    checked={checkMode === "all"}
                    onChange={() => setCheckMode("all")}
                  />
                  <span>Режим 1: Проверить все, запустить самый быстрый</span>
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="checkMode"
                    checked={checkMode === "first"}
                    onChange={() => setCheckMode("first")}
                  />
                  <span>Режим 2: Найти первый рабочий, запустить сразу</span>
                </label>
              </div>
            </div>
            
            <div className="button-row">
              <button 
                className="btn btn-success" 
                onClick={handleRunCheck}
                disabled={isChecking}
              >
                {isChecking ? "Проверка..." : "Запустить проверку"}
              </button>
              <button 
                className="btn btn-danger" 
                onClick={handleStopCheck}
                disabled={!isChecking}
              >
                Стоп
              </button>
            </div>
          </div>
        );

      case "results":
        return (
          <div className="tab-content">
            <div className="results-header">
              <h3>Обработанные файлы</h3>
              <button className="btn btn-secondary" onClick={() => addLog("info", "Открытие папки...")}>
                📁 Открыть папку с рабочими файлами
              </button>
            </div>
            
            <div className="data-grid">
              <table>
                <thead>
                  <tr>
                    <th>Имя</th>
                    <th>Статус</th>
                    <th>Время ответа</th>
                    <th>Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map(item => (
                    <tr key={item.id} className={`row-${item.status}`}>
                      <td>{item.name}</td>
                      <td>
                        <span className={`badge ${item.status}`}>
                          {item.status === "success" ? "✓ Успех" : "✗ Ошибка"}
                        </span>
                      </td>
                      <td>{item.responseTime > 0 ? `${item.responseTime} мс` : "—"}</td>
                      <td>{item.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="tab-content">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={runOnStartup}
                  onChange={(e) => setRunOnStartup(e.target.checked)}
                />
                <span>Запускать вместе с Windows</span>
              </label>
              <p className="hint">Управление через реестр</p>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={silentMode}
                  onChange={(e) => setSilentMode(e.target.checked)}
                />
                <span>Тихий режим при автозапуске</span>
              </label>
              <p className="hint">Сворачивать приложение в трей</p>
            </div>
            
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={requireConfirm}
                  onChange={(e) => setRequireConfirm(e.target.checked)}
                />
                <span>Требовать подтверждение перед запуском .bat</span>
              </label>
              <p className="hint">Дополнительная безопасность</p>
            </div>
            
            <button className="btn btn-primary" onClick={handleSaveSettings}>
              💾 Сохранить настройки
            </button>
          </div>
        );

      case "logs":
        return (
          <div className="tab-content">
            <div className="logs-container">
              <div className="logs-view">
                {logs.map((log, index) => (
                  <div key={index} className={`log-entry log-${log.level}`}>
                    <span className="log-time">[{log.timestamp}]</span>
                    <span className="log-level">[{log.level.toUpperCase()}]</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>
            
            <div className="button-row">
              <button className="btn btn-secondary" onClick={clearLogs}>
                🗑️ Очистить
              </button>
              <button className="btn btn-secondary" onClick={saveLogs}>
                💾 Сохранить в файл
              </button>
            </div>
          </div>
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

      {/* Переключатель режимов */}
      <div className="mode-switcher">
        <button
          className={`mode-button ${mode === "deep" ? "active" : ""}`}
          onClick={() => setMode("deep")}
        >
          deep
        </button>
        <button
          className={`mode-button ${mode === "fast" ? "active" : ""}`}
          onClick={() => setMode("fast")}
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
          <span>Версия: {appVersion}</span>
        </div>
      </div>
    </div>
  );
}

export default App;