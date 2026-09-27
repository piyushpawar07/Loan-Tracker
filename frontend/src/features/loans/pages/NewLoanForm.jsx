import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../../shared/components/AppLayout'
import FormField from '../../../shared/components/FormField'
import Icon from '../../../shared/components/Icon'
import { useNewLoan } from '../hooks/useNewLoan'
import { MAX_LOAN_AMOUNT, MAX_PURPOSE_LENGTH, MIN_LOAN_AMOUNT } from '../validation'
import { formatINR } from '../../../shared/utils/format'

const nextSteps = [
  'Upload identity, income and address proof on the application page.',
  'A verifier reviews each document.',
  'An approver makes the final decision and confirms disbursement.',
]

function NewLoanForm() {
  const navigate = useNavigate()
  const { form, updateField, submit, loading, error, fieldErrors } = useNewLoan()
  const amount = Number(form.amount)
  const hasAmount = form.amount !== '' && Number.isFinite(amount) && amount > 0

  async function handleSubmit(event) {
    event.preventDefault()
    const loan = await submit()
    if (loan) navigate(`/loans/${loan.id}`)
  }

  return (
    <AppLayout
      title="New loan application"
      subtitle="Tell us how much you need and what it’s for."
      actions={<Link className="button button-ghost" to="/dashboard"><Icon name="arrowLeft" size={16} />All applications</Link>}
    >
      <div className="form-layout">
        <section className="card">
          <form onSubmit={handleSubmit} noValidate>
            <FormField
              id="amount"
              label="Loan amount (₹)"
              error={fieldErrors.amount}
              hint={`Enter amount in ₹, e.g. 500000 for ₹5,00,000. Allowed: ${formatINR(MIN_LOAN_AMOUNT)} to ${formatINR(MAX_LOAN_AMOUNT)}.`}
            >
              <div className="input-prefix">
                <span>₹</span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  inputMode="numeric"
                  min={MIN_LOAN_AMOUNT}
                  max={MAX_LOAN_AMOUNT}
                  step="1"
                  value={form.amount}
                  onChange={updateField}
                  aria-invalid={Boolean(fieldErrors.amount)}
                />
              </div>
            </FormField>
            <FormField id="purpose" label="Purpose" error={fieldErrors.purpose} hint={`${form.purpose.length}/${MAX_PURPOSE_LENGTH} characters`}>
              <textarea
                id="purpose"
                name="purpose"
                rows="4"
                maxLength={MAX_PURPOSE_LENGTH}
                value={form.purpose}
                onChange={updateField}
                placeholder="e.g. Home renovation, higher education, business equipment"
                aria-invalid={Boolean(fieldErrors.purpose)}
              />
            </FormField>
            {error && <p className="alert alert-error" role="alert">{error}</p>}
            <button className="button button-primary button-block" type="submit" disabled={loading}>
              {loading ? 'Submitting…' : 'Submit application'}
            </button>
          </form>
        </section>

        <aside className="card preview-card">
          <p className="preview-label">You’re requesting</p>
          <p className="preview-amount">{hasAmount ? formatINR(amount) : '₹ —'}</p>
          <p className="preview-purpose">{form.purpose.trim() || 'Add a purpose to describe the loan.'}</p>
          <h3 className="section-title">What happens next</h3>
          <ol className="next-steps">
            {nextSteps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </aside>
      </div>
    </AppLayout>
  )
}

export default NewLoanForm
