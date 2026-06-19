import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  CATEGORY_COLORS,
  formatCompactCurrency,
  formatCurrency,
  normalizeCategory,
} from "../utils/finance";


function CurrencyTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="chart-tooltip">
      <strong>{label || payload[0].name}</strong>
      <span>{formatCurrency(payload[0].value)}</span>
    </div>
  );
}

function EmptyChart({ title }) {
  return (
    <div className="empty-chart">
      <span>{title}</span>
      <p>Add transactions to populate this chart.</p>
    </div>
  );
}

function AnalyticsCharts({ monthlyData, categoryData }) {
  const sortedCategories = [...categoryData].sort((first, second) => second.value - first.value);
  const topCategories = sortedCategories.slice(0, 5);
  const hasMonthlyData = monthlyData.length > 0;
  const hasCategoryData = categoryData.length > 0;

  return (
    <section className="analytics-section" id="analytics">
      <div className="section-title">
        <span className="eyebrow">Advanced Analytics</span>
        <h2>Spending Intelligence</h2>
      </div>

      <div className="analytics-grid">
        <article className="panel chart-card wide-chart">
          <div className="panel-heading">
            <div>
              <h3>Monthly Spending Trend</h3>
              <p>Historical transaction totals by month.</p>
            </div>
          </div>
          {hasMonthlyData ? (
            <ResponsiveContainer width="100%" height={310}>
              <AreaChart data={monthlyData} margin={{ top: 14, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.38} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} />
                <Tooltip content={<CurrencyTooltip />} />
                <Area
                  type="monotone"
                  dataKey="spending"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#spendGradient)"
                  animationDuration={900}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No trend data" />
          )}
        </article>

        <article className="panel chart-card">
          <div className="panel-heading">
            <div>
              <h3>Category Breakdown</h3>
              <p>Share of total expenses.</p>
            </div>
          </div>
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={104}
                  paddingAngle={4}
                  animationDuration={900}
                >
                  {categoryData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[normalizeCategory(entry.name)]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CurrencyTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No category data" />
          )}
        </article>

        <article className="panel chart-card">
          <div className="panel-heading">
            <div>
              <h3>Spending Distribution</h3>
              <p>Category-level allocation.</p>
            </div>
          </div>
          {hasCategoryData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedCategories} margin={{ top: 14, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} />
                <Tooltip content={<CurrencyTooltip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={900}>
                  {sortedCategories.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[normalizeCategory(entry.name)]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart title="No distribution data" />
          )}
        </article>

        <article className="panel top-categories-card">
          <div className="panel-heading">
            <div>
              <h3>Top Categories</h3>
              <p>Highest spending buckets.</p>
            </div>
          </div>
          {topCategories.length === 0 ? (
            <p className="empty-state">No categories to rank yet.</p>
          ) : (
            <div className="top-category-list">
              {topCategories.map((category) => {
                const maxValue = topCategories[0]?.value || 1;
                const width = Math.round((category.value / maxValue) * 100);

                return (
                  <div className="top-category-row" key={category.name}>
                    <div>
                      <span>{category.name}</span>
                      <strong>{formatCurrency(category.value)}</strong>
                    </div>
                    <div className="mini-progress">
                      <span
                        style={{
                          width: `${width}%`,
                          background: CATEGORY_COLORS[normalizeCategory(category.name)],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default AnalyticsCharts;
