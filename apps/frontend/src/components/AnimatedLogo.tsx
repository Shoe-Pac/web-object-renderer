import { css } from '@emotion/react'
import React from 'react'

const AnimatedLogo: React.FC = () => {
  return (
    <div css={containerStyle}>
      <img src="/logo.svg" alt="WOR Logo" css={logoStyle} />
    </div>
  )
}

const containerStyle = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50%;
  margin-bottom: 20%;

  //Mobile responsive
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    margin-bottom: 5%;
  }
`

const logoStyle = css`
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
  width: 50%;
  height: 50%;

  //Mobile responsive
  @media (max-width: 768px) {
    position: relative;
    margin-top: 14%;
    width: 85%;
    height: 100%;
    left: 43%;
  }
`

export default AnimatedLogo
