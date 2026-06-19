import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Brain,
  CreditCard,
  LayoutDashboard,
  Menu,
  Moon,
  PiggyBank,
  ReceiptText,
  Settings,
  ShieldAlert,
  Sun,
  Wallet,
} from "lucide-react";

import AIInsightsPanel from "../components/AIInsightsPanel";
import AnalyticsCharts from "../components/AnalyticsCharts";
import BudgetWidget from "../components/BudgetWidget";
import HealthGauge from "../components/HealthGauge";
import KpiCard from "../components/KpiCard";
import PredictionPanel from "../components/PredictionPanel";
import ResetDataModal from "../components/ResetDataModal";
import RiskDetectionPanel from "../components/RiskDetectionPanel";
import SavingsRecommendations from "../components/SavingsRecommendations";
import SettingsPanel from "../components/SettingsPanel";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import {
  fetchHealthScore,
  fetchRiskAnalysis,
  fetchSpendingAnalysis,
  fetchTransactions,
  resetData,
} from "../services/api";
import {
  CATEGORY_COLORS,
  MONTHLY_BUDGET,
  formatCurrency,
  getLatestMonthTotal,
  normalizeCategory,
} from "../utils/finance";


const SIDEBAR_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#dashboard" },
  { label: "Analytics", icon: BarChart3, href: "#analytics" },
  { label: "AI Insights", icon: Brain, href: "#insights" },
  { label: "Transactions", icon: ReceiptText, href: "#transactions" },
  { label: "Settings", icon: Settings, href: "#settings" },
];


function getTrendLabel(values) {
  if (values.length < 2) {
    return "New dataset";
  }

  const previous = Number(values[values.length - 2]) || 0;
  const latest = Number(values[values.length - 1]) || 0;

  if (previous === 0) {
    return latest > 0 ? "Fresh activity" : "No change";
  }

  const change = Math.round(((latest - previous) / previous) * 100);

  if (change === 0) {
    return "Flat vs last month";
  }

  return `${change > 0 ? "+" : ""}${change}% vs last month`;
}

function buildMonthlyChartData(monthlySpending) {
  return Object.entries(monthlySpending || {})
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => ({
      key,
      month: String(value?.month || key).replace(/^([A-Za-z]{3})[a-z]* /, "$1 "),
      spending: Number(value?.total_spending) || 0,
    }));
}

function buildCategoryChartData(categorySpending) {
  const totals = {};

  Object.entries(categorySpending || {}).forEach(([category, amount]) => {
    const normalizedCategory = normalizeCategory(category);
    totals[normalizedCategory] = (totals[normalizedCategory] || 0) + Number(amount || 0);
  });

  return Object.entries(totals)
    .filter(([, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name],
    }));
}

function buildRiskItems(transactions, riskAnalysis) {
  const transactionLookup = [...transactions];
  const categoryTotals = transactions.reduce((totals, transaction) => {
    const category = normalizeCategory(transaction.category);
    const current = totals[category] || { total: 0, count: 0 };

    return {
      ...totals,
      [category]: {
        total: current.total + Number(transaction.amount || 0),
        count: current.count + 1,
      },
    };
  }, {});

  return riskAnalysis
    .filter((risk) => risk.risk_status === "High Risk")
    .map((risk, index) => {
      const match = transactionLookup.find((transaction) => (
        String(transaction.description).toLowerCase() === String(risk.merchant).toLowerCase()
        && Number(transaction.amount) === Number(risk.amount)
      ));
      const category = normalizeCategory(match?.category);
      const categoryAverage = categoryTotals[category]?.count
        ? categoryTotals[category].total / categoryTotals[category].count
        : 0;
      const multiplier = categoryAverage > 0 ? Number(risk.amount) / categoryAverage : 0;

      return {
        id: `${risk.merchant}-${risk.amount}-${index}`,
        merchant: risk.merchant,
        amount: Number(risk.amount) || 0,
        severity: multiplier >= 4 ? "High" : "Medium",
        reason: multiplier > 1
          ? `This is ${multiplier.toFixed(1)}x higher than your average ${category.toLowerCase()} expense.`
          : "This transaction was flagged as unusual compared with your spending history.",
      };
    })
    .slice(0, 5);
}

function buildInsights({ categoryData, monthlyData, riskItems, currentSpending }) {
  const insights = [];
  const total = categoryData.reduce((sum, item) => sum + item.value, 0);
  const topCategory = [...categoryData].sort((first, second) => second.value - first.value)[0];

  if (topCategory && total > 0) {
    const share = Math.round((topCategory.value / total) * 100);
    const potentialSavings = topCategory.value * 0.2;
    insights.push({
      title: `${topCategory.name} concentration`,
      message: `${topCategory.name} accounts for ${share}% of your spending. Reducing this category by 20% could save approximately ${formatCurrency(potentialSavings)} per month.`,
      impact: "High impact recommendation",
    });
  }

  if (monthlyData.length >= 2) {
    const previous = monthlyData[monthlyData.length - 2].spending;
    const latest = monthlyData[monthlyData.length - 1].spending;
    const difference = latest - previous;

    insights.push({
      title: difference > 0 ? "Spending momentum" : "Savings momentum",
      message: difference > 0
        ? `Your latest monthly spend increased by ${formatCurrency(difference)}. Review discretionary categories before the next cycle closes.`
        : `You spent ${formatCurrency(Math.abs(difference))} less than the prior month. Keep the same allocation pattern to protect savings.`,
      impact: difference > 0 ? "Needs attention" : "Positive trend",
    });
  }

  if (riskItems.length > 0) {
    insights.push({
      title: "Risk watchlist",
      message: `${riskItems.length} transaction${riskItems.length > 1 ? "s" : ""} look unusual against your historical spend. Verify merchant, category, and timing before approving similar payments.`,
      impact: "Risk reduction",
    });
  }

  if (currentSpending > MONTHLY_BUDGET * 0.75) {
    insights.push({
      title: "Budget pressure",
      message: `You have used ${Math.round((currentSpending / MONTHLY_BUDGET) * 100)}% of the monthly budget. Freeze low-priority purchases to stay inside plan.`,
      impact: "Budget control",
    });
  }

  return insights.slice(0, 4);
}

function buildSavingsRecommendations(categoryData) {
  const byCategory = Object.fromEntries(categoryData.map((item) => [item.name, item.value]));
  const topCategory = [...categoryData].sort((first, second) => second.value - first.value)[0];
  const recommendations = [];

  if (byCategory.Food) {
    recommendations.push({
      title: "Reduce food delivery by 15%",
      savings: byCategory.Food * 0.15,
    });
  }

  if (byCategory.Bills) {
    recommendations.push({
      title: "Cancel unused subscriptions",
      savings: Math.min(byCategory.Bills * 0.25, 2000),
    });
  }

  if (topCategory) {
    recommendations.push({
      title: `Cap ${topCategory.name.toLowerCase()} spending by 10%`,
      savings: topCategory.value * 0.1,
    });
  }

  if (byCategory.Entertainment) {
    recommendations.push({
      title: "Move one entertainment expense to savings",
      savings: byCategory.Entertainment * 0.2,
    });
  }

  return recommendations
    .filter((recommendation) => recommendation.savings > 0)
    .slice(0, 4);
}

function buildPrediction(monthlyData, healthScore) {
  if (monthlyData.length === 0) {
    return {
      averageSpending: 0,
      predictedSpending: 0,
      predictedSavings: MONTHLY_BUDGET,
      expectedScore: Math.min(Number(healthScore) || 0, 100),
    };
  }

  const totals = monthlyData.map((item) => item.spending);
  const average = totals.reduce((sum, amount) => sum + amount, 0) / totals.length;
  const latest = totals[totals.length - 1];
  const previous = totals.length >= 2 ? totals[totals.length - 2] : average;
  const trend = latest - previous;
  const predictedSpending = Math.max(0, Math.round((average * 0.45) + ((latest + trend * 0.55) * 0.55)));
  const predictedSavings = Math.max(MONTHLY_BUDGET - predictedSpending, 0);
  const scoreDelta = predictedSpending > latest ? -5 : 4;
  const expectedScore = Math.min(Math.max((Number(healthScore) || 0) + scoreDelta, 0), 100);

  return {
    averageSpending: average,
    predictedSpending,
    predictedSavings,
    expectedScore,
  };
}

function Dashboard() {
  const [healthScore, setHealthScore] = useState({ health_score: 0, grade: "No data yet" });
  const [categorySpending, setCategorySpending] = useState({});
  const [monthlySpending, setMonthlySpending] = useState({});
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem("finsight-theme") || "light");

  async function loadDashboardData() {
    try {
      const [
        transactionsData,
        healthScoreData,
        spendingAnalysisData,
        riskAnalysisData,
      ] = await Promise.all([
        fetchTransactions(),
        fetchHealthScore(),
        fetchSpendingAnalysis(),
        fetchRiskAnalysis(),
      ]);

      setTransactions(transactionsData);
      setHealthScore(healthScoreData);
      setCategorySpending(spendingAnalysisData.category_spending || {});
      setMonthlySpending(spendingAnalysisData.monthly_spending || {});
      setRiskAnalysis(riskAnalysisData.risk_analysis || []);
      setError("");
    } catch (apiError) {
      setError("Unable to load dashboard data from the backend.");
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("finsight-theme", theme);
  }, [theme]);

  const totalSpending = transactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0,
  );
  const totalTransactions = transactions.length;
  const monthlyData = useMemo(() => buildMonthlyChartData(monthlySpending), [monthlySpending]);
  const categoryData = useMemo(() => buildCategoryChartData(categorySpending), [categorySpending]);
  const currentMonthSpending = getLatestMonthTotal(monthlySpending);
  const savingsEstimate = Math.max(MONTHLY_BUDGET - currentMonthSpending, 0);
  const monthlyTotals = monthlyData.map((item) => item.spending);
  const riskItems = useMemo(
    () => buildRiskItems(transactions, riskAnalysis),
    [riskAnalysis, transactions],
  );
  const insights = useMemo(
    () => buildInsights({
      categoryData,
      monthlyData,
      riskItems,
      currentSpending: currentMonthSpending,
    }),
    [categoryData, currentMonthSpending, monthlyData, riskItems],
  );
  const savingsRecommendations = useMemo(
    () => buildSavingsRecommendations(categoryData),
    [categoryData],
  );
  const prediction = useMemo(
    () => buildPrediction(monthlyData, healthScore.health_score),
    [healthScore.health_score, monthlyData],
  );

  async function handleResetData() {
    setIsResetting(true);
    setError("");
    setToast("");

    try {
      await resetData();
      await loadDashboardData();
      setToast("All dashboard data was reset successfully.");
      setIsResetModalOpen(false);
    } catch (apiError) {
      setError("Unable to reset dashboard data. Please try again.");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className={`app-shell ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">F</div>
          <div>
            <strong>FinSight AI</strong>
            <span>Money intelligence</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Primary navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <a href={item.href} key={item.label}>
                <Icon size={20} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="dashboard" id="dashboard">
        <header className="top-navbar">
          <div className="top-nav-left">
            <button
              type="button"
              className="icon-button"
              onClick={() => setIsSidebarCollapsed((collapsed) => !collapsed)}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
            <div className="top-brand-mark" aria-hidden="true">F</div>
            <div>
              <span className="eyebrow">Fintech Dashboard</span>
              <h1>Financial Command Center</h1>
            </div>
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}
            aria-label="Toggle dark mode"
            title="Toggle dark mode"
          >
            {theme === "dark" ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          </button>
        </header>

        {error && <p className="error-message">{error}</p>}
        {toast && <p className="success-message">{toast}</p>}

        <section className="kpi-grid" aria-label="Dashboard KPIs">
          <KpiCard
            icon={Wallet}
            title="Total Spending"
            value={formatCurrency(totalSpending)}
            trend={getTrendLabel(monthlyTotals)}
            description="Across all recorded transactions"
            tone="blue"
          />
          <KpiCard
            icon={CreditCard}
            title="Total Transactions"
            value={totalTransactions}
            trend={totalTransactions > 0 ? "Live ledger" : "No activity"}
            description="Stored in your SQLite ledger"
            tone="violet"
          />
          <KpiCard
            icon={PiggyBank}
            title="Savings Estimate"
            value={formatCurrency(savingsEstimate)}
            trend={`${Math.max(MONTHLY_BUDGET - currentMonthSpending, 0) > 0 ? "Inside" : "Over"} budget`}
            description="Based on this month's budget"
            tone="green"
          />
          <KpiCard
            icon={ShieldAlert}
            title="Financial Health Score"
            value={`${Number(healthScore.health_score) || 0}/100`}
            trend={healthScore.grade}
            description="Blends spending, savings, balance, and risk"
            tone="amber"
          />
        </section>

        <TransactionForm onTransactionAdded={loadDashboardData} />

        <section className="dashboard-grid core-grid">
          <BudgetWidget budget={MONTHLY_BUDGET} spent={currentMonthSpending} />
          <HealthGauge score={healthScore.health_score} grade={healthScore.grade} />
          <PredictionPanel prediction={prediction} />
        </section>

        <section className="dashboard-grid insight-grid" id="insights">
          <AIInsightsPanel insights={insights} />
          <RiskDetectionPanel risks={riskItems} />
          <SavingsRecommendations recommendations={savingsRecommendations} />
        </section>

        <AnalyticsCharts monthlyData={monthlyData} categoryData={categoryData} />
        <TransactionTable transactions={transactions} />
        <SettingsPanel onResetClick={() => setIsResetModalOpen(true)} />
      </main>

      <ResetDataModal
        isOpen={isResetModalOpen}
        isResetting={isResetting}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={handleResetData}
      />
    </div>
  );
}

export default Dashboard;
