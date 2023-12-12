import React from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { StartPage } from './pages/StartPage/StartPage'
import { SignInPage } from './pages/SignInPage/SignInPage'
import { SignUpPage } from './pages/SignUpPage/SignUpPage'
import { ProtectedRoute } from './pages/ProtectedRoute/ProtectedRoute'
import { MainPage } from './pages/MainPage/MainPage'
import { FavoritePage } from './pages/FavoritePage/FavoritePage'
import { PublicPage } from './pages/PublicPage/PublicPage'
import { AdminPage } from './pages/AdminPage/AdminPage'
import { AdminProtectedRoute } from './pages/ProtectedRoute/AdminProtectedRoute'
import { PublicFilesPage } from './pages/PublicPage/PublicFilesPage'
import { AdminFilesPage } from './pages/AdminPage/AdminFilesPage'
import { PrivatePage } from './pages/PrivatePage/PrivatePage'
import { TrialPage } from './pages/TrialPage/TrialPage'
import { TrialFilesPage } from './pages/TrialPage/TrialFilesPage'
import { PrivateFilesPage } from './pages/PrivatePage/PrivateFilesPage'
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
  {
    path: '/trial',
    element: <TrialPage />,
  },
  {
    path: '/private/:owner/:folderId',
    element: (
      <ProtectedRoute>
        <PrivatePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/private/:owner/:folderId/*',
    element: (
      <ProtectedRoute>
        <PrivateFilesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/public/:path',
    element: (
      <ProtectedRoute>
        <PublicFilesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/trial/:path',
    element: <TrialFilesPage />,
  },
  {
    path: '/admin',
    element: (
      <AdminProtectedRoute>
        <AdminPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin/:bucket',
    element: (
      <AdminProtectedRoute>
        <AdminFilesPage />
      </AdminProtectedRoute>
    ),
  },
  {
    path: '/admin/:bucket/:filename/*',
    element: (
      <AdminProtectedRoute>
        <AdminFilesPage />
      </AdminProtectedRoute>
    ),
  },
])

// children: [ PrivateFilePage
//   {PublicPage PrivatePage
//     path: 'main/favorites/',
//     element: (AdminPage
//       <ProtectedRoute>
//         <FavoritePage />
//       </ProtectedRoute>
//     ),
//   },
// ],
