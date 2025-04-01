import { ApolloProvider } from '@apollo/client'
import { Global } from '@emotion/react'
import { ThemeProvider } from '@mui/material'
import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import client from '../apollo/apolloClient'
import ProtectedRoute from '../components/ProtectedRoute'
import CustomSnackbar from '../components/SnackBar'
import AuthProvider from '../contexts/Auth'
import SnackBarProvider from '../contexts/SnackBar'
import Error from '../pages/Error'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Profile from '../pages/Profile'
import Register from '../pages/Register'
import globalStyles from '../styles/globalStyles'
import theme from '../styles/theme'
import muiTheme from '../styles/theme-mui'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
    errorElement: <Error />
  },
  {
    path: '/home',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    )
  },
  {
    path: '/profile/:user',
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    )
  },
  {
    path: '/register',
    element: <Register />
  }
])

export const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <SnackBarProvider>
          <ThemeProvider theme={muiTheme}>
            <ThemeProvider theme={theme}>
              <Global styles={globalStyles} />
              <RouterProvider router={router} />
              <CustomSnackbar />
            </ThemeProvider>
          </ThemeProvider>
        </SnackBarProvider>
      </AuthProvider>
    </ApolloProvider>
  )
}

export default App
