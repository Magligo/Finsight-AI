import { AlertTriangle } from "lucide-react";


function ResetDataModal({ isOpen, isResetting, onCancel, onConfirm }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <section
        className="reset-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-data-title"
      >
        <div className="modal-icon">
          <AlertTriangle size={24} aria-hidden="true" />
        </div>
        <h2 id="reset-data-title">Reset all FinSight data?</h2>
        <p>
          This deletes all transactions, analytics history, risk alerts, chart data,
          dashboard statistics, and AI insights. The app will stay functional with a
          clean dashboard after reset.
        </p>
        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onCancel} disabled={isResetting}>
            Cancel
          </button>
          <button type="button" className="danger-button" onClick={onConfirm} disabled={isResetting}>
            {isResetting ? "Resetting..." : "Reset Data"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default ResetDataModal;
