const API_BASE_URL = "http://127.0.0.1:8000";


async function request(endpoint) {
  // API requests: fetch data from FastAPI and convert the response to JSON.
  const response = await fetch(`${API_BASE_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${endpoint}`);
  }

  return response.json();
}


async function sendRequest(endpoint, options) {
  // API requests: send data to FastAPI and parse the JSON response.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${endpoint}`);
  }

  return response.json();
}


export function createTransaction(transaction) {
  // API request: submit a new transaction to POST /transactions.
  return sendRequest("/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(transaction),
  });
}


export function fetchTransactions() {
  // API request: load all transactions for the dashboard transaction list.
  return request("/transactions");
}


export function fetchHealthScore() {
  // API request: load the financial health score card data.
  return request("/health-score");
}


export function fetchInsights() {
  // API request: load rule-based financial insights.
  return request("/insights");
}


export function fetchSpendingAnalysis() {
  // API request: load category and monthly spending data for charts.
  return request("/spending-analysis");
}


export function fetchRiskAlerts() {
  // API request: load high-risk transaction alerts.
  return request("/risk-alerts");
}


export function fetchRiskAnalysis() {
  // API request: load ML-based risk status for every transaction.
  return request("/risk-analysis");
}


export { API_BASE_URL };
