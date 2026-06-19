import { Activity, TrendingDown, TrendingUp } from "lucide-react";

import { formatCurrency, getHealthStatus } from "../utils/finance";


function PredictionPanel({ prediction }) {
  const StatusIcon = prediction.predictedSpending > prediction.averageSpending
    ? TrendingUp
    : TrendingDown;
  const healthStatus = getHealthStatus(prediction.expectedScore);

  return (
    <section className="panel prediction-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Prediction</span>
          <h2>Next Month Forecast</h2>
        </div>
        <div className="panel-icon">
          <Activity size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="prediction-primary">
        <StatusIcon size={24} aria-hidden="true" />
        <div>
          <span>Predicted Next Month Spending</span>
          <strong>{formatCurrency(prediction.predictedSpending)}</strong>
        </div>
      </div>

      <div className="prediction-grid">
        <div>
          <span>Predicted Savings</span>
          <strong>{formatCurrency(prediction.predictedSavings)}</strong>
        </div>
        <div>
          <span>Expected Score</span>
          <strong>{prediction.expectedScore}</strong>
          <small>{healthStatus.label}</small>
        </div>
      </div>
    </section>
  );
}

export default PredictionPanel;
