function RiskAlertCard({ alerts }) {
  return (
    <section className="panel list-panel">
      <div className="section-heading">
        <div>
          <h2>Risk Alerts</h2>
          <p>Unusual transactions that may need review.</p>
        </div>
      </div>

      {alerts.length === 0 ? (
        <p className="empty-state">No unusual spending patterns detected.</p>
      ) : (
        <ul className="stack-list">
          {alerts.map((alert) => (
            <li className="risk-alert-item" key={alert.id}>
              <p>{alert.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


export default RiskAlertCard;
