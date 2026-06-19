import { BadgeCheck, PiggyBank } from "lucide-react";

import { formatCurrency } from "../utils/finance";


function SavingsRecommendations({ recommendations }) {
  return (
    <section className="panel savings-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Savings</span>
          <h2>Action Plan</h2>
        </div>
        <div className="panel-icon success">
          <PiggyBank size={22} aria-hidden="true" />
        </div>
      </div>

      {recommendations.length === 0 ? (
        <p className="empty-state">Your recommendations will appear after spending patterns are available.</p>
      ) : (
        <div className="recommendation-list">
          {recommendations.map((recommendation) => (
            <article className="recommendation-row" key={recommendation.title}>
              <BadgeCheck size={20} aria-hidden="true" />
              <div>
                <strong>{recommendation.title}</strong>
                <span>{formatCurrency(recommendation.savings)}/month</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavingsRecommendations;
