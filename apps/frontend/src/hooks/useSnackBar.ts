import { useContext } from 'react'

import { SnackBarContext } from '../contexts/SnackBar'

const useSnackBar = () => {
  const context = useContext(SnackBarContext)

  if (!context) {
    throw new Error('useSnackBar must be used within an SnackBarProvider')
  }

  return context
}

export default useSnackBar
