export const MONTHLY_BUDGET = 20000;

export const CATEGORIES = [
  "Food",
  "Travel",
  "Entertainment",
  "Shopping",
  "Bills",
  "Others",
];

export const CATEGORY_COLORS = {
  Food: "#10b981",
  Travel: "#3b82f6",
  Entertainment: "#f59e0b",
  Shopping: "#ec4899",
  Bills: "#8b5cf6",
  Others: "#64748b",
};

export function normalizeCategory(category) {
  const normalized = String(category || "Others").trim().toLowerCase();
  const match = CATEGORIES.find((item) => item.toLowerCase() === normalized);
  return match || "Others";
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

export function formatCompactCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value) || 0);
}

export function formatPercent(value) {
  return `${Math.round(Number(value) || 0)}%`;
}

export function getHealthStatus(score) {
  const safeScore = Math.min(Math.max(Number(score) || 0, 0), 100);

  if (safeScore <= 40) {
    return {
      label: "Poor",
      tone: "danger",
      description: "High spend concentration and risk need attention.",
    };
  }

  if (safeScore <= 70) {
    return {
      label: "Average",
      tone: "warning",
      description: "Your finances are stable, with room to optimize.",
    };
  }

  return {
    label: "Excellent",
    tone: "success",
    description: "Healthy balance across spending, savings, and risk.",
  };
}

export function getLatestMonthTotal(monthlySpending) {
  const sortedMonths = Object.entries(monthlySpending || {}).sort(([first], [second]) => (
    first.localeCompare(second)
  ));

  if (sortedMonths.length === 0) {
    return 0;
  }

  return Number(sortedMonths[sortedMonths.length - 1][1]?.total_spending) || 0;
}
