import { WalletCards } from "lucide-react";

import { formatCurrency } from "../utils/finance";


function BudgetWidget({ budget, spent }) {
  const safeBudget = Number(budget) || 0;
  const safeSpent = Number(spent) || 0;
  const remaining = Math.max(safeBudget - safeSpent, 0);
  const progress = safeBudget > 0 ? Math.min((safeSpent / safeBudget) * 100, 100) : 0;

  return (
    <section className="panel budget-widget">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Budget Tracking</span>
          <h2>Monthly Budget</h2>
        </div>
        <div className="panel-icon">
          <WalletCards size={22} aria-hidden="true" />
        </div>
      </div>

      <div className="budget-metrics">
        <div>
          <span>Budget</span>
          <strong>{formatCurrency(safeBudget)}</strong>
        </div>
        <div>
          <span>Spent</span>
          <strong>{formatCurrency(safeSpent)}</strong>
        </div>
        <div>
          <span>Remaining</span>
          <strong>{formatCurrency(remaining)}</strong>
        </div>
      </div>

      <div className="budget-progress-track" aria-label={`Budget used ${Math.round(progress)} percent`}>
        <div className="budget-progress-bar" style={{ width: `${progress}%` }} />
      </div>
      <p className="muted-text">
        {progress >= 100
          ? "Budget exceeded. Review high-impact categories before the next billing cycle."
          : `${Math.round(progress)}% of your monthly budget is used.`}
      </p>
    </section>
  );
}

export default BudgetWidget;
