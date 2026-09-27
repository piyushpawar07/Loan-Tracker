import Icon from './Icon'

function StatCard({ label, value, hint, icon, tone = 'indigo' }) {
  return (
    <article className={`stat stat-${tone}`}>
      <span className="stat-icon"><Icon name={icon} size={20} /></span>
      <div>
        <p className="stat-label">{label}</p>
        <p className="stat-value">{value}</p>
        {hint && <p className="stat-hint">{hint}</p>}
      </div>
    </article>
  )
}

export default StatCard
