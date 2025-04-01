import { createContext, useState } from 'react'

export interface SnackBarContent {
  message: string
  severity: 'success' | 'info' | 'warning' | 'error'
  position: {
    vertical: 'top' | 'bottom' | undefined
    horizontal: 'left' | 'center' | 'right' | undefined
  }
  duration: number
}

interface SnackBarContextType {
  snackBarContent: SnackBarContent | undefined
  setSnackBarContent: React.Dispatch<React.SetStateAction<SnackBarContent>>
}

export const SnackBarContext = createContext<SnackBarContextType | undefined>(undefined)

const SnackBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [snackBarContent, setSnackBarContent] = useState<SnackBarContent>({
    message: '',
    severity: 'info',
    position: {
      vertical: 'top',
      horizontal: 'center'
    },
    duration: 3000
  })

  return (
    <SnackBarContext.Provider value={{ snackBarContent, setSnackBarContent }}>
      {children}
    </SnackBarContext.Provider>
  )
}

export default SnackBarProvider
