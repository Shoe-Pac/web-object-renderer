import { css } from '@emotion/react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import useAuth from '../hooks/useAuth'
import useGetUser from '../hooks/useGetUser'
import { logout } from '../utils/api-services/auth'
import HeaderWrapper from './ui/HeaderWrapper'
import Nav from './ui/Nav'

const Header = () => {
  const { userId } = useAuth()
  const { data } = useGetUser(userId, !userId)
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <HeaderWrapper>
      <Nav>
        <Link to={`/home`}>
          <div>
            <img src="/favicon.svg" alt="WOR" css={logoStyle} />
          </div>
        </Link>
      </Nav>

      <Nav>
        <Link to={`/profile/${data?.getUser.name}`}>Profile</Link>
        <Link to="#" onClick={() => setOpen(true)}>
          Logout
        </Link>
      </Nav>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', width: '100%' }}>Logout Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', width: '100%' }}>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={() => setOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </HeaderWrapper>
  )
}

const logoStyle = css`
  width: 15%;
  height: 15%;
`

export default Header
