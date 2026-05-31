function HealthScoreCard({ score, grade }) {
  // Component responsibility: show the user's financial health score summary.
  // Props usage: score and grade are passed from Dashboard after API loading.
  const numericScore = Number(score) || 0;
  const safeScore = Math.min(Math.max(numericScore, 0), 100);

  // Score status: use simple score ranges so the label is readable at a glance.
  const scoreStatus = safeScore >= 80
    ? "Excellent"
    : safeScore >= 60
      ? "Good"
      : safeScore >= 40
        ? "Fair"
        : "Poor";

  // Color coding: green for strong scores, yellow for medium scores, red for low scores.
  const scoreTone = safeScore >= 80 ? "green" : safeScore >= 60 ? "yellow" : "red";

  return (
    <section className={`panel summary-card health-score-card health-score-card-${scoreTone}`}>
      <div className="summary-card-topline">
        <h2>Financial Health Score</h2>
        <span className="health-score-status">{scoreStatus}</span>
      </div>
      <div
        className="health-score-ring"
        style={{ "--score-progress": `${safeScore * 3.6}deg` }}
        aria-label={`Financial health score ${safeScore} out of 100`}
      >
        <div className="health-score-ring-inner">
          <strong>{safeScore}</strong>
          <span>/100</span>
        </div>
      </div>
      <p>{grade}</p>
    </section>
  );
}


export default HealthScoreCard;
