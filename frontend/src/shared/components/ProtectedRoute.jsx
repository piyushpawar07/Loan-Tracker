import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../features/auth/state/useAuthContext'

function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default ProtectedRoute
