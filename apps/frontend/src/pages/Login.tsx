import { css } from '@emotion/react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import AnimatedLogo from '../components/AnimatedLogo'
import Button from '../components/ui/Button'
import Form from '../components/ui/Form'
import Input from '../components/ui/Input'
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
    <div css={loginContainerStyle}>
      <AnimatedLogo />

      <div css={formContainerStyle}>
        <Form onSubmit={handleLogin}>
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

          <Button primary fullWidth type="submit">
            Login
          </Button>

          <p style={{ color: 'white', textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#3b82f6' }}>
              Register
            </Link>
          </p>
        </Form>
      </div>
    </div>
  )
}

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

export default Login
