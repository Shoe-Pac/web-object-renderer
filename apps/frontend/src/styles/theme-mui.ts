import { createTheme } from '@mui/material/styles'

const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#00FF99'
    },
    secondary: {
      main: '#FF9800'
    },
    error: {
      main: '#F44336'
    },
    background: {
      default: '#171717',
      paper: '#262626'
    },
    text: {
      primary: '#ffffff',
      secondary: '#aaaaaa'
    },
    divider: '#404040'
  },
  typography: {
    fontSize: 16,
    h1: { fontSize: '32px' },
    h2: { fontSize: '24px' },
    h3: { fontSize: '20px' },
    body1: { fontSize: '16px' },
    body2: { fontSize: '14px' }
  },
  spacing: 8,
  shape: {
    borderRadius: 8
  }
})

export default muiTheme
