import { Alert, Snackbar } from '@mui/material'

import { SnackBarContent } from '../contexts/SnackBar'
import useSnackBar from '../hooks/useSnackBar'

const CustomSnackbar = () => {
  const { snackBarContent, setSnackBarContent } = useSnackBar()

  return (
    <Snackbar
      open={snackBarContent?.message !== ''}
      autoHideDuration={snackBarContent?.duration || 3000}
      onClose={() =>
        setSnackBarContent((prev: SnackBarContent) => ({
          ...prev,
          message: ''
        }))
      }
      anchorOrigin={{
        vertical: snackBarContent?.position.vertical || 'top',
        horizontal: snackBarContent?.position.horizontal || 'center'
      }}
    >
      <Alert
        onClose={() =>
          setSnackBarContent((prev: SnackBarContent) => ({
            ...prev,
            message: ''
          }))
        }
        severity={snackBarContent?.severity}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {snackBarContent?.message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
