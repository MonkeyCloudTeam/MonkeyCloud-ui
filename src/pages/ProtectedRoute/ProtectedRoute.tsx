import type React from 'react'
import { Navigate } from 'react-router-dom'

const ProtectedRoute: React.FC<any> = ({ children }) => {
  const userToken = localStorage.getItem('token')
  if (!userToken) {
    return <Navigate to='/sign-in' />
  }

  return children
}

export {
  ProtectedRoute
}
