import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthContext } from '../../features/auth/state/useAuthContext'
import { ROLE_HOME_PATHS } from '../constants/roles'

function ProtectedRoute({ allowedRoles }) {
  const { user } = useAuthContext()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROLE_HOME_PATHS[user.role] || '/login'} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
