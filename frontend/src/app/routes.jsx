import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import ProtectedRoute from '../shared/components/ProtectedRoute'
import Dashboard from '../features/loans/pages/Dashboard'
import NewLoanForm from '../features/loans/pages/NewLoanForm'
import LoanDetail from '../features/loans/pages/LoanDetail'
import VerifierDashboard from '../features/verifier/pages/VerifierDashboard'
import ApproverDashboard from '../features/approver/pages/ApproverDashboard'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute allowedRoles={['applicant']} />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/loans/new" element={<NewLoanForm />} />
        <Route path="/loans/:loanId" element={<LoanDetail />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['verifier']} />}>
        <Route path="/verifier" element={<VerifierDashboard />} />
      </Route>
      <Route element={<ProtectedRoute allowedRoles={['approver']} />}>
        <Route path="/approver" element={<ApproverDashboard />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
