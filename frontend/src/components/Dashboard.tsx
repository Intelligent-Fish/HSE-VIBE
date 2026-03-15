import React from "react";
import { Status } from "../types";

interface DashboardProps {
  appVersion: string;
  status: Status;
  progress: number;
  lastRun: { time: string; result: string } | null;
  getStatusColor: (s: Status) => string;
  getStatusText: (s: Status) => string;
  onCheckUpdates: () => void;
}

export function Dashboard({ 
  appVersion, status, progress, lastRun, 
  getStatusColor, getStatusText, onCheckUpdates 
}: DashboardProps) {
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
          <button className="btn btn-primary" onClick={onCheckUpdates}>
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
}