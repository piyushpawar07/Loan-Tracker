import Icon from '../../../shared/components/Icon'
import { formatStatus } from '../status'
import { formatDate } from '../../../shared/utils/format'

const HAPPY_PATH = ['submitted', 'under_verification', 'verified', 'approved', 'disbursed']

function buildSteps(status, createdAt, history) {
  const reachedAt = { submitted: createdAt }
  history.forEach((entry) => { reachedAt[entry.new_status] = entry.changed_at })

  if (status === 'rejected') {
    const rejection = history.find((entry) => entry.new_status === 'rejected')
    const stopIndex = HAPPY_PATH.indexOf(rejection?.old_status ?? 'submitted')
    return [
      ...HAPPY_PATH.slice(0, stopIndex + 1).map((key) => ({ key, state: 'done', date: reachedAt[key] })),
      { key: 'rejected', state: 'rejected', date: reachedAt.rejected },
    ]
  }

  const currentIndex = HAPPY_PATH.indexOf(status)
  return HAPPY_PATH.map((key, index) => ({
    key,
    date: reachedAt[key],
    state: index < currentIndex || status === 'disbursed' ? 'done' : index === currentIndex ? 'current' : 'upcoming',
  }))
}

function StatusStepper({ status, createdAt, history }) {
  const steps = buildSteps(status, createdAt, history)

  return (
    <ol className="stepper" aria-label="Application progress">
      {steps.map((step, index) => (
        <li key={step.key} className={`step step-${step.state}`}>
          <span className="step-marker">
            {step.state === 'done' && <Icon name="check" size={14} />}
            {step.state === 'rejected' && <Icon name="x" size={14} />}
            {(step.state === 'current' || step.state === 'upcoming') && index + 1}
          </span>
          <span className="step-text">
            <span className="step-label">{formatStatus(step.key)}</span>
            <span className="step-date">{step.date ? formatDate(step.date) : step.state === 'current' ? 'In progress' : '—'}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

export default StatusStepper
