import React from 'react'
import { StyledEngineProvider } from '@mui/material/styles'
import { RouterProvider } from 'react-router-dom'
import { store } from './store/store'
import { Provider } from 'react-redux'

import './App.scss'
import { router } from './router'

const App = () => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <StyledEngineProvider injectFirst>
          <RouterProvider router={router} />
        </StyledEngineProvider>
      </Provider>
    </React.StrictMode>
  )
}

export default App
