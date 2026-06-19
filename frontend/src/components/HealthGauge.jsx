import { getHealthStatus } from "../utils/finance";


function HealthGauge({ score, grade }) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);
  const status = getHealthStatus(safeScore);

  return (
    <section className={`panel health-gauge-panel health-gauge-${status.tone}`}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Financial Health</span>
          <h2>Score Overview</h2>
        </div>
        <span className="status-pill">{status.label}</span>
      </div>

      <div
        className="health-gauge"
        style={{ "--score-progress": `${safeScore * 3.6}deg` }}
        aria-label={`Financial health score ${safeScore} out of 100`}
      >
        <div className="health-gauge-inner">
          <strong>{safeScore}</strong>
          <span>/100</span>
        </div>
      </div>

      <p className="muted-text">{grade || status.description}</p>
      <div className="score-scale" aria-hidden="true">
        <span>Poor</span>
        <span>Average</span>
        <span>Excellent</span>
      </div>
    </section>
  );
}

export default HealthGauge;
