import styled from '@emotion/styled'

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #171717;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 10px;
  }

  p {
    color: #ff4d4d;
    font-size: 1.2rem;
  }

  .links {
    margin-top: 20px;
    display: flex;
    gap: 15px;
  }
`

export default ErrorContainer
