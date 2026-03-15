import React from "react";
import { ResultItem } from "../types";

interface ResultsProps {
  results: ResultItem[];
  onAddLog: (level: "info" | "success" | "warning" | "error", message: string) => void;
}

export function Results({ results, onAddLog }: ResultsProps) {
  return (
    <div className="tab-content">
      <div className="results-header">
        <h3>Обработанные файлы</h3>
        <button className="btn btn-secondary" onClick={() => onAddLog("info", "Открытие папки...")}>
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
}