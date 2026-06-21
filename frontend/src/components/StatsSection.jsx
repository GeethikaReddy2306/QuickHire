import "../style/StatsSection.css";

export default function StatsSection() {
  return (
    <section id="stats">
      <div className="stats-card">
        <h2>10,000+</h2>
        <p>Jobs Posted</p>
      </div>

      <div className="stats-card">
        <h2>500+</h2>
        <p>Companies Hiring</p>
      </div>

      <div className="stats-card">
        <h2>8,000+</h2>
        <p>Successful Hires</p>
      </div>

      <div className="stats-card">
        <h2>2,000+</h2>
        <p>Active Students</p>
      </div>
    </section>
  );
}