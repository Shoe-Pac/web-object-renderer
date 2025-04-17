import { css } from '@emotion/react'
import { useState } from 'react'
import { Helmet } from 'react-helmet'
import { Link, useNavigate } from 'react-router-dom'

import Footer from '../components/Footer'
import Button from '../components/ui/Button'
import Form from '../components/ui/Form'
import Input from '../components/ui/Input'
import WireframeBackground from '../components/ui/WireFrameBackground'
import { login } from '../utils/api-services/auth'
import { validateEmailField, validatePasswordField } from '../utils/field-validation'

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' })

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
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({
      email: validateEmailField(formData.email),
      password: validatePasswordField(formData.password)
    })

    if (fieldErrors.email || fieldErrors.password) return

    try {
      const loginResponse = await login(formData.email, formData.password)

      if (loginResponse.ok) {
        navigate('/home', { replace: true, state: { from: '/login' } })
      } else {
        const response = await loginResponse.json()
        setError(response.error || 'Login failed!')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Error occured, please try again.')
    }
  }

  return (
    <div css={mainContainerStyle}>
      <WireframeBackground />

      <Helmet>
        <title>Login | WOR</title>
        <meta
          name="description"
          content="Login to your account on Web Object Renderer – a secure platform for interacting with 3D .obj models in real-time."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>
      <div css={loginContainerStyle}>
        <div css={formContainerStyle}>
          <Form
            onSubmit={handleLogin}
            style={{ zIndex: 2, boxShadow: '0px 0px 10px rgb(51, 153, 255)' }}
          >
            <h1
              style={{
                color: 'white',
                textAlign: 'center',
                marginBottom: '10px'
              }}
            >
              Login
            </h1>

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
              autoComplete="current-password"
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
                Show Password
              </label>
            </div>

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

            <Button primary fullWidth type="submit" css={buttonStyle}>
              Login
            </Button>

            <p style={{ color: 'white', textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color: '#00ff99' }}>
                Register
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
      </div>
      <Footer />
    </div>
  )
}

const mainContainerStyle = css`
  display: flex;
  flex-direction: column;
  height: 100%;
`
const buttonStyle = css`
  background: rgba(51, 153, 255, 0.89);
  color: white;
  border-radius: 8px;
  margin-top: 8px;

  &:hover {
    // box-shadow: 0px 0px 10px #00ff99;
  }
`
const loginContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background: #171717;
`

const formContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
`
const disclaimerStyle = css`
  font-size: 0.75rem;
  color: #888;
  text-align: center;
  margin-top: 16px;
  max-width: 400px;
  line-height: 1.4;
`

export default Login
