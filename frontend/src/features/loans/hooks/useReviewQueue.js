import { useCallback, useEffect, useRef, useState } from 'react'
import { fetchLoanById, fetchLoanHistory, fetchLoans } from '../api/loan.api'
import { getErrorMessage } from '../../../shared/utils/apiError'

export function useReviewQueue() {
  const [loans, setLoans] = useState([])
  const [listLoading, setListLoading] = useState(true)
  const [listError, setListError] = useState('')
  const [selectedId, setSelectedId] = useState(null)
  const [loan, setLoan] = useState(null)
  const [history, setHistory] = useState([])
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState('')
  const [pendingAction, setPendingAction] = useState('')
  const [actionError, setActionError] = useState('')
  const latestDetailRequest = useRef(null)

  const loadList = useCallback(() => {
    return fetchLoans()
      .then((result) => {
        setLoans(result.data?.loans || [])
        setListError('')
      })
      .catch((requestError) => {
        setListError(getErrorMessage(requestError, 'Unable to load the queue.'))
      })
      .finally(() => setListLoading(false))
  }, [])

  const loadDetail = useCallback((loanId) => {
    latestDetailRequest.current = loanId
    return Promise.all([fetchLoanById(loanId), fetchLoanHistory(loanId)])
      .then(([loanResult, historyResult]) => {
        if (latestDetailRequest.current !== loanId) return
        setLoan(loanResult.data?.loan || null)
        setHistory(historyResult.data?.history || [])
        setDetailError('')
      })
      .catch((requestError) => {
        if (latestDetailRequest.current !== loanId) return
        setDetailError(getErrorMessage(requestError, 'Unable to load this application.'))
      })
      .finally(() => {
        if (latestDetailRequest.current === loanId) setDetailLoading(false)
      })
  }, [])

  useEffect(() => {
    loadList()
  }, [loadList])

  function selectLoan(loanId) {
    setSelectedId(loanId)
    setLoan(null)
    setHistory([])
    setActionError('')
    setDetailLoading(true)
    loadDetail(loanId)
  }

  async function runAction(actionKey, request) {
    if (!selectedId) return
    setPendingAction(actionKey)
    setActionError('')
    try {
      await request()
    } catch (requestError) {
      setActionError(getErrorMessage(requestError, 'The action could not be completed.'))
    }
    await Promise.all([loadList(), loadDetail(selectedId)])
    setPendingAction('')
  }

  return {
    loans,
    listLoading,
    listError,
    selectedId,
    loan,
    history,
    detailLoading,
    detailError,
    pendingAction,
    actionError,
    selectLoan,
    runAction,
  }
}
