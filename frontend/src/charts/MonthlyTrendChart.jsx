import Plot from "react-plotly.js";


function MonthlyTrendChart({ monthlySpending }) {
  // Component responsibility: display monthly spending totals as a smooth line chart.
  // Props usage: monthlySpending is API data passed from Dashboard.
  const monthlyData = Object.values(monthlySpending);
  const months = monthlyData.map((monthData) => monthData.month);
  const amounts = monthlyData.map((monthData) => monthData.total_spending);

  return (
    <section className="panel chart-panel">
      <h2>Monthly Spending Trend</h2>
      {months.length === 0 ? (
        <p>No monthly spending data available yet.</p>
      ) : (
        <Plot
          // Plotly chart configuration: spline line shows the month-to-month trend.
          data={[
            {
              type: "scatter",
              mode: "lines+markers",
              x: months,
              y: amounts,
              line: { color: "#2563EB", width: 3, shape: "spline" },
              marker: {
                color: "#ffffff",
                line: { color: "#2563EB", width: 3 },
                size: 10,
              },
              fill: "tozeroy",
              fillcolor: "rgba(37, 99, 235, 0.08)",
              hovertemplate: "%{x}<br>Total spending: ₹%{y}<extra></extra>",
            },
          ]}
          // Plotly chart configuration: axis titles match the grouped monthly totals.
          layout={{
            autosize: true,
            height: 400,
            margin: { t: 8, r: 24, b: 52, l: 72 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            xaxis: {
              type: "category",
              showgrid: false,
              tickfont: { size: 13 },
            },
            yaxis: {
              gridcolor: "#E5E7EB",
              zeroline: false,
              tickprefix: "₹",
              tickfont: { size: 13 },
            },
            font: { family: "Inter, Segoe UI, Arial, sans-serif", color: "#334155" },
          }}
          config={{ responsive: true, displayModeBar: false }}
          style={{ width: "100%", height: "400px" }}
          useResizeHandler
        />
      )}
    </section>
  );
}


export default MonthlyTrendChart;
