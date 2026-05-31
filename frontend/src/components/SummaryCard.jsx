function SummaryCard({ title, value, detail, valueClassName = "" }) {
  return (
    <section className="panel summary-card">
      <span>{title}</span>
      <strong className={valueClassName}>{value}</strong>
      {detail && <p>{detail}</p>}
    </section>
  );
}


export default SummaryCard;
