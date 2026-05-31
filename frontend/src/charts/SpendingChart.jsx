import Plot from "react-plotly.js";


function SpendingChart({ categorySpending }) {
  // Component responsibility: display category spending as a modern donut chart.
  // Props usage: categorySpending is API data passed from Dashboard.
  const categories = Object.keys(categorySpending);
  const amounts = Object.values(categorySpending);
  const categoryColors = [
    "#2563EB",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#64748B",
    "#0EA5E9",
    "#14B8A6",
    "#8B5CF6",
  ];

  return (
    <section className="panel chart-panel">
      <h2>Spending by Category</h2>
      {categories.length === 0 ? (
        <p>No category spending data available yet.</p>
      ) : (
        <Plot
          // Plotly chart configuration: data controls chart type, labels, and values.
          data={[
            {
              type: "pie",
              labels: categories,
              values: amounts,
              hole: 0.62,
              textinfo: "percent",
              textposition: "inside",
              automargin: true,
              marker: {
                colors: categoryColors,
                line: { color: "#ffffff", width: 2 },
              },
              hovertemplate: "%{label}<br>₹%{value}<br>%{percent}<extra></extra>",
            },
          ]}
          // Plotly chart configuration: layout controls title, size, and legend.
          layout={{
            autosize: true,
            height: 400,
            margin: { t: 8, r: 24, b: 20, l: 24 },
            paper_bgcolor: "transparent",
            plot_bgcolor: "transparent",
            showlegend: true,
            legend: {
              orientation: "h",
              y: -0.08,
              x: 0.5,
              xanchor: "center",
              font: { size: 13 },
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


export default SpendingChart;
