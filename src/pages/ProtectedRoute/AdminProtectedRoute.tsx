import type React from 'react'
import { Navigate } from 'react-router-dom'

const AdminProtectedRoute: React.FC<any> = ({ children }) => {
  const role = localStorage.getItem('role')
  if (role != 'admin') {
    return <Navigate to='/main' />
  }

  return children
}

export { AdminProtectedRoute }
