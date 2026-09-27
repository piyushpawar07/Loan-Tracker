import { useEffect, useState } from 'react'
import { fetchLoans } from '../api/loan.api'
import { getErrorMessage } from '../../../shared/utils/apiError'

export function useLoans() {
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    fetchLoans()
      .then((result) => {
        if (!active) return
        setLoans(result.data?.loans || [])
        setError('')
      })
      .catch((requestError) => {
        if (active) setError(getErrorMessage(requestError, 'Unable to load loans.'))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { loans, loading, error }
}
