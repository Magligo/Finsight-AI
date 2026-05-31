function InsightCard({ insights }) {
  return (
    <section className="panel list-panel">
      <div className="section-heading">
        <div>
          <h2>Financial Insights</h2>
          <p>Insights calculated from your latest spending data.</p>
        </div>
      </div>

      {insights.length === 0 ? (
        <p className="empty-state">Add more transactions to generate meaningful insights.</p>
      ) : (
        <ul className="stack-list">
          {insights.map((insight) => (
            <li className="insight-item" key={insight}>
              <p>{insight}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


export default InsightCard;
