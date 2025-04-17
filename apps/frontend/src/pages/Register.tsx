import { css } from '@emotion/react'
import { FormEvent, useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'

import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import Form from '../components/ui/Form'
import Input from '../components/ui/Input'
import WireframeBackground from '../components/ui/WireFrameBackground'
import useCreateUser from '../hooks/useCreateUser'
import useSnackBar from '../hooks/useSnackBar'
import {
  validateEmailField,
  validateNameField,
  validatePasswordField
} from '../utils/field-validation'

const Register = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: '',
    name: ''
  })

  const [createUser] = useCreateUser()
  const { setSnackBarContent } = useSnackBar()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (name === 'email') {
      setFieldErrors({ ...fieldErrors, email: validateEmailField(value) })
    } else if (name === 'password') {
      setFieldErrors({
        ...fieldErrors,
        password: validatePasswordField(value)
      })
    } else if (name === 'name') {
      setFieldErrors({ ...fieldErrors, name: validateNameField(value) })
    }
  }

  async function registerUser(event: FormEvent) {
    event.preventDefault()
    setError('')
    setFieldErrors({
      email: validateEmailField(formData.email),
      password: validatePasswordField(formData.password),
      name: validateNameField(formData.name)
    })

    if (fieldErrors.email || fieldErrors.password || fieldErrors.name) {
      return
    }

    try {
      const res = await createUser({ variables: { ...formData } })

      if (res.data?.createUser.status === 200) {
        setSnackBarContent((prev) => ({
          ...prev,
          message: res.data?.createUser.message || 'User successfully created!',
          severity: 'success'
        }))
        navigate('/')
      } else {
        setError(res.data?.createUser.message || 'User creation failed!')
      }
    } catch (err) {
      console.error('Error trying to create user:', err)
      setSnackBarContent((prev) => ({
        ...prev,
        message: 'User creation failed!',
        severity: 'error'
      }))
    }
  }

  return (
    <div css={mainContainerStyle}>
      <WireframeBackground />
      <Helmet>
        <title>Register | WOR</title>
        <meta
          name="description"
          content="Create your account on Web Object Renderer – a secure platform for interacting with 3D .obj models in real-time."
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div css={registerContainerStyle}>
        <Form
          onSubmit={registerUser}
          style={{ zIndex: 2, boxShadow: '0px 0px 10px rgb(0, 255, 153)' }}
        >
          <h1
            style={{
              color: 'white',
              textAlign: 'center',
              marginBottom: '10px'
            }}
          >
            Register
          </h1>

          <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          {fieldErrors.name && <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.name}</p>}

          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.email}</p>
          )}

          <Input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            autoComplete="password"
          />
          {fieldErrors.password && (
            <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.password}</p>
          )}

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
              marginTop: '4px'
            }}
          >
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label
              style={{
                color: 'white',
                marginLeft: '5px',
                fontSize: '14px'
              }}
            >
              {' '}
              Show Password
            </label>
          </div>

          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

          <Button primary fullWidth type="submit" css={buttonStyle}>
            Register
          </Button>

          <p style={{ color: 'white', textAlign: 'center' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#3b82f6' }}>
              Login
            </Link>
          </p>
          <p css={disclaimerStyle}>
            This platform is intended for secure and safe use by developers and 3D artists. No
            harmful content is distributed or collected. For more information, visit our{' '}
            <Link to="/privacy-policy" style={{ color: '#3b82f6' }}>
              Privacy Policy
            </Link>
            .
          </p>
        </Form>
      </div>
      <Footer />
    </div>
  )
}

const mainContainerStyle = css`
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
`
const buttonStyle = css`
  background: rgba(0, 255, 153, 0.86);
  color: white;
  border-radius: 8px;
  margin-top: 8px;
`

const registerContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #171717;
  // z-index: 2;
`
const disclaimerStyle = css`
  font-size: 0.75rem;
  color: #888;
  text-align: center;
  margin-top: 16px;
  max-width: 400px;
  line-height: 1.4;
`

export default Register
