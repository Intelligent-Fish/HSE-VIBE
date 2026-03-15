import React from "react";
import { LogEntry } from "../types";

interface LogsProps {
  logs: LogEntry[];
  logsEndRef: React.RefObject<HTMLDivElement>;
  onClearLogs: () => void;
  onSaveLogs: () => void;
}

export function Logs({ logs, logsEndRef, onClearLogs, onSaveLogs }: LogsProps) {
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
        <button className="btn btn-secondary" onClick={onClearLogs}>
          🗑️ Очистить
        </button>
        <button className="btn btn-secondary" onClick={onSaveLogs}>
          💾 Сохранить в файл
        </button>
      </div>
    </div>
  );
}