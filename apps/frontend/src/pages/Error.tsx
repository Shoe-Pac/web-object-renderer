import { Link, useRouteError } from 'react-router-dom'

import Button from '../components/ui/Button'
import ErrorContainer from '../components/ui/ErrorContainer'
import { RouteError } from '../types/errors'

const Error = () => {
  const error = useRouteError() as RouteError
  console.error(error)

  return (
    <ErrorContainer>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || error.message || 'Unknown error'}</p>
      <div className="links">
        <Link to="/">
          <Button>Go to Login</Button>
        </Link>
        <Link to="/register">
          <Button primary>Register</Button>
        </Link>
      </div>
    </ErrorContainer>
  )
}

export default Error
