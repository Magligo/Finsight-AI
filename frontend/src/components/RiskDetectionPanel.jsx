import { ShieldAlert } from "lucide-react";

import { formatCurrency } from "../utils/finance";


function RiskDetectionPanel({ risks }) {
  return (
    <section className="panel risk-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Risk Detection</span>
          <h2>Unusual Activity</h2>
        </div>
        <div className="panel-icon danger">
          <ShieldAlert size={22} aria-hidden="true" />
        </div>
      </div>

      {risks.length === 0 ? (
        <p className="empty-state">No high-risk transactions detected in the current dataset.</p>
      ) : (
        <div className="risk-list">
          {risks.map((risk) => (
            <article className="risk-row" key={risk.id}>
              <div>
                <strong>{formatCurrency(risk.amount)} spent on {risk.merchant}</strong>
                <p>{risk.reason}</p>
              </div>
              <span className={`severity-badge severity-${risk.severity.toLowerCase()}`}>
                {risk.severity}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default RiskDetectionPanel;
