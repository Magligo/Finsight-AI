import { useEffect, useMemo, useState } from "react";

import MonthlyTrendChart from "../charts/MonthlyTrendChart";
import SpendingChart from "../charts/SpendingChart";
import HealthScoreCard from "../components/HealthScoreCard";
import InsightCard from "../components/InsightCard";
import Navbar from "../components/Navbar";
import RiskAlertCard from "../components/RiskAlertCard";
import SummaryCard from "../components/SummaryCard";
import TransactionForm from "../components/TransactionForm";
import TransactionTable from "../components/TransactionTable";
import {
  fetchHealthScore,
  fetchRiskAnalysis,
  fetchSpendingAnalysis,
  fetchTransactions,
} from "../services/api";


function Dashboard() {
  const [healthScore, setHealthScore] = useState({ health_score: 0, grade: "Loading" });
  const [categorySpending, setCategorySpending] = useState({});
  const [monthlySpending, setMonthlySpending] = useState({});
  const [riskAnalysis, setRiskAnalysis] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

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
      setCategorySpending(spendingAnalysisData.category_spending);
      setMonthlySpending(spendingAnalysisData.monthly_spending);
      setRiskAnalysis(riskAnalysisData.risk_analysis);
      setError("");
    } catch (apiError) {
      setError("Unable to load dashboard data from the backend.");
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  const totalSpending = transactions.reduce(
    (total, transaction) => total + Number(transaction.amount),
    0
  );
  const totalTransactions = transactions.length;
  const topCategory = Object.keys(categorySpending).length
    ? Object.keys(categorySpending).reduce((highestCategory, category) => (
        categorySpending[category] > categorySpending[highestCategory]
          ? category
          : highestCategory
      ))
    : "No data";

  const dashboardRiskAlerts = useMemo(() => {
    return riskAnalysis
      .filter((transaction) => transaction.risk_status === "High Risk")
      .map((transaction) => ({
        id: `${transaction.merchant}-${transaction.amount}`,
        message: `${transaction.merchant} ₹${Number(transaction.amount).toLocaleString()} detected as unusual spending.`,
      }));
  }, [riskAnalysis]);

  const financialInsights = useMemo(() => {
    const insights = [];

    if (topCategory !== "No data") {
      insights.push(`${topCategory} is your highest spending category.`);
    }

    const monthlyData = Object.values(monthlySpending)
      .filter((monthData) => monthData?.month)
      .sort((firstMonth, secondMonth) => firstMonth.month.localeCompare(secondMonth.month));

    if (monthlyData.length >= 2) {
      const previousMonth = monthlyData[monthlyData.length - 2];
      const latestMonth = monthlyData[monthlyData.length - 1];
      const previousTotal = Number(previousMonth.total_spending) || 0;
      const latestTotal = Number(latestMonth.total_spending) || 0;
      const difference = latestTotal - previousTotal;

      if (difference < 0) {
        insights.push(`You saved ₹${Math.abs(difference).toLocaleString()} compared to last month.`);
      } else if (difference > 0 && previousTotal > 0) {
        insights.push(`Monthly spending increased by ${Math.round((difference / previousTotal) * 100)}% compared to last month.`);
      }
    }

    const categoryMonthlyTotals = transactions.reduce((totals, transaction) => {
      const month = transaction.transaction_date?.slice(0, 7);
      const category = transaction.category || "Uncategorized";

      if (!month) {
        return totals;
      }

      return {
        ...totals,
        [category]: {
          ...(totals[category] || {}),
          [month]: (totals[category]?.[month] || 0) + Number(transaction.amount),
        },
      };
    }, {});

    Object.entries(categoryMonthlyTotals).forEach(([category, monthlyTotals]) => {
      const months = Object.keys(monthlyTotals).sort();

      if (months.length < 2) {
        return;
      }

      const previousAmount = monthlyTotals[months[months.length - 2]];
      const latestAmount = monthlyTotals[months[months.length - 1]];

      if (previousAmount <= 0 || latestAmount === previousAmount) {
        return;
      }

      const changePercent = Math.round(((latestAmount - previousAmount) / previousAmount) * 100);
      const direction = changePercent > 0 ? "increased" : "decreased";
      insights.push(`${category} spending ${direction} by ${Math.abs(changePercent)}%.`);
    });

    return insights.slice(0, 5);
  }, [monthlySpending, topCategory, transactions]);

  return (
    <main className="dashboard">
      <Navbar />

      {error && <p className="error-message">{error}</p>}

      <TransactionForm onTransactionAdded={loadDashboardData} />

      <div className="summary-grid">
        <SummaryCard
          title="Total Spending"
          value={`₹${totalSpending.toLocaleString()}`}
          detail="Across all transactions"
        />
        <SummaryCard
          title="Total Transactions"
          value={totalTransactions}
          detail="Saved in the database"
        />
        <SummaryCard
          title="Top Category"
          value={topCategory}
          detail="Largest spending bucket"
          valueClassName="no-wrap"
        />
        <HealthScoreCard
          score={healthScore.health_score}
          grade={healthScore.grade}
        />
      </div>

      <div className="dashboard-grid two-column chart-grid">
        <SpendingChart categorySpending={categorySpending} />
        <MonthlyTrendChart monthlySpending={monthlySpending} />
      </div>

      <div className="dashboard-grid two-column">
        <RiskAlertCard alerts={dashboardRiskAlerts} />
        <InsightCard insights={financialInsights} />
      </div>

      <TransactionTable transactions={transactions} />
    </main>
  );
}


export default Dashboard;
