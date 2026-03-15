import React from "react";

interface ModesProps {
  healthUrl: string;
  timeout: number;
  checkMode: "all" | "first";
  isChecking: boolean;
  onHealthUrlChange: (url: string) => void;
  onTimeoutChange: (timeout: number) => void;
  onCheckModeChange: (mode: "all" | "first") => void;
  onRunCheck: () => void;
  onStopCheck: () => void;
}

export function Modes({ 
  healthUrl, 
  timeout, 
  checkMode, 
  isChecking, 
  onHealthUrlChange, 
  onTimeoutChange, 
  onCheckModeChange, 
  onRunCheck, 
  onStopCheck 
}: ModesProps) {
  return (
    <div className="tab-content">
      <div className="form-group">
        <label>Health Check URL</label>
        <input
          type="url"
          value={healthUrl}
          onChange={(e) => onHealthUrlChange(e.target.value)}
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
          onChange={(e) => onTimeoutChange(Number(e.target.value))}
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
              onChange={() => onCheckModeChange("all")}
            />
            <span>Режим 1: Проверить все, запустить самый быстрый</span>
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="checkMode"
              checked={checkMode === "first"}
              onChange={() => onCheckModeChange("first")}
            />
            <span>Режим 2: Найти первый рабочий, запустить сразу</span>
          </label>
        </div>
      </div>
      <div className="button-row">
        <button
          className="btn btn-success"
          onClick={onRunCheck}
          disabled={isChecking}
        >
          {isChecking ? "Проверка..." : "Запустить проверку"}
        </button>
        <button
          className="btn btn-danger"
          onClick={onStopCheck}
          disabled={!isChecking}
        >
          Стоп
        </button>
      </div>
    </div>
  );
}