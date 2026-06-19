import { Sparkles } from "lucide-react";


function AIInsightsPanel({ insights }) {
  return (
    <section className="panel ai-insights-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">AI Insights</span>
          <h2>Recommendations</h2>
        </div>
        <div className="panel-icon">
          <Sparkles size={22} aria-hidden="true" />
        </div>
      </div>

      {insights.length === 0 ? (
        <p className="empty-state">Add a few transactions to generate personalized recommendations.</p>
      ) : (
        <div className="insight-stack">
          {insights.map((insight) => (
            <article className="ai-recommendation" key={insight.title}>
              <span>{insight.title}</span>
              <p>{insight.message}</p>
              <small>{insight.impact}</small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default AIInsightsPanel;
