import { useCallback, useEffect, useState } from 'react'
import { fetchLoanById, fetchLoanHistory } from '../api/loan.api'
import { getErrorMessage } from '../../../shared/utils/apiError'

export function useLoanDetail(loanId) {
  const [loan, setLoan] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let active = true
    Promise.all([fetchLoanById(loanId), fetchLoanHistory(loanId)])
      .then(([loanResult, historyResult]) => {
        if (!active) return
        setLoan(loanResult.data?.loan || null)
        setHistory(historyResult.data?.history || [])
        setError('')
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Unable to load this loan.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [loanId, version])

  const reload = useCallback(() => setVersion((current) => current + 1), [])

  return { loan, history, loading, error, reload }
}
