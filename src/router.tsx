import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { StartPage } from './pages/StartPage/StartPage'
import { SignInPage } from './pages/SignInPage/SignInPage'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { ProtectedRoute } from './pages/ProtectedRoute/ProtectedRoute'
import { MainPage } from './pages/MainPage/MainPage'
import { FavoritePage } from './pages/FavoritePage/FavoritePage'
import { PublicPage } from './pages/PublicPage/PublicPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StartPage />,
  },
  {
    path: '/sign-in',
    element: <SignInPage />,
  },
  {
    path: '/sign-up',
    element: <SignUpPage />,
  },
  {
    path: '/main',
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/favorites',
    element: (
      <ProtectedRoute>
        <FavoritePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/public',
    element: (
      <ProtectedRoute>
        <PublicPage />
      </ProtectedRoute>
    ),
  },
])

// children: [
//   {PublicPage
//     path: 'main/favorites/',
//     element: (
//       <ProtectedRoute>
//         <FavoritePage />
//       </ProtectedRoute>
//     ),
//   },
// ],
