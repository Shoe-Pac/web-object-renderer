import '@emotion/react'

const theme = {
  colors: {
    primary: '#4CAF50',
    secondary: '#FF9800',
    danger: '#F44336',
    background: '#171717',
    card: '#262626',
    border: '#404040',
    text: '#ffffff',
    mutedText: '#aaaaaa'
  },
  fontSizes: {
    small: '14px',
    medium: '16px',
    large: '20px',
    heading: '32px'
  },
  spacing: {
    mini: '4px',
    small: '8px',
    medium: '16px',
    large: '24px',
    xlarge: '40px'
  },
  borderRadius: '8px'
}

export default theme

export type ThemeType = typeof theme
