import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles'
import { RouterProvider } from 'react-router-dom'

import './App.scss'
import { router } from './router'

const App = () => {
  return (
    <React.StrictMode>
      <StyledEngineProvider injectFirst>
        <RouterProvider router={router} />
      </StyledEngineProvider>
    </React.StrictMode>
  )
}

export default App
