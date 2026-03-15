import React from "react";

interface SettingsProps {
  runOnStartup: boolean;
  silentMode: boolean;
  requireConfirm: boolean;
  onRunOnStartupChange: (value: boolean) => void;
  onSilentModeChange: (value: boolean) => void;
  onRequireConfirmChange: (value: boolean) => void;
  onSaveSettings: () => void;
}

export function Settings({ 
  runOnStartup, silentMode, requireConfirm,
  onRunOnStartupChange, onSilentModeChange, onRequireConfirmChange,
  onSaveSettings 
}: SettingsProps) {
  return (
    <div className="tab-content">
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={runOnStartup}
            onChange={(e) => onRunOnStartupChange(e.target.checked)}
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
            onChange={(e) => onSilentModeChange(e.target.checked)}
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
            onChange={(e) => onRequireConfirmChange(e.target.checked)}
          />
          <span>Требовать подтверждение перед запуском .bat</span>
        </label>
        <p className="hint">Дополнительная безопасность</p>
      </div>
      <button className="btn btn-primary" onClick={onSaveSettings}>
        💾 Сохранить настройки
      </button>
    </div>
  );
}