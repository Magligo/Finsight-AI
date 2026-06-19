function KpiCard({ icon: Icon, title, value, trend, description, tone = "blue" }) {
  return (
    <section className={`kpi-card kpi-card-${tone}`}>
      <div className="kpi-icon-wrap">
        <Icon size={22} aria-hidden="true" />
      </div>
      <div className="kpi-content">
        <span>{title}</span>
        <strong>{value}</strong>
        <div className="kpi-footer">
          <small>{trend}</small>
          <p>{description}</p>
        </div>
      </div>
    </section>
  );
}

export default KpiCard;
