import { RotateCcw, Settings } from "lucide-react";


function SettingsPanel({ onResetClick }) {
  return (
    <section className="panel settings-panel" id="settings">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Settings</span>
          <h2>Workspace Controls</h2>
        </div>
        <div className="panel-icon">
          <Settings size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="settings-reset-box">
        <div>
          <strong>Reset dashboard data</strong>
          <p>
            Remove every transaction and clear all derived analytics, risk alerts,
            financial scores, predictions, and AI insights.
          </p>
        </div>
        <button type="button" className="danger-button" onClick={onResetClick}>
          <RotateCcw size={18} aria-hidden="true" />
          Reset Data
        </button>
      </div>
    </section>
  );
}

export default SettingsPanel;
