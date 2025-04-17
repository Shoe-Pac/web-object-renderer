import { css } from '@emotion/react'
import { Button } from '@mui/material'
import { Helmet } from 'react-helmet'
import { useNavigate } from 'react-router-dom'

import AnimatedLogo from '../components/AnimatedLogo'
import Footer from '../components/Footer'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div css={mainContainerStyle}>
      <Helmet>
        <title>Web Object Renderer</title>
        <meta
          name="description"
          content="Web Object Renderer is a secure, full-stack platform for uploading, rendering, and manipulating 3D .obj models directly in the browser. Built with modern technologies like React, Three.js, and Fastify, it supports real-time interactions, cloud storage (AWS S3), and user authentication. Try it online or host it locally."
        />
        <meta
          name="keywords"
          content="3D model viewer, .obj renderer, WebGL, Three.js, React, Fastify, fullstack app, 3D object manipulation, cloud rendering, secure file upload"
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://web-object-renderer.online" />
      </Helmet>
      <div css={loginContainerStyle}>
        <AnimatedLogo />

        <div css={featureListStyle}>
          <div css={featureItemStyle}>
            <span css={dotsStyle}>
              <span css={dotSmallB} />
              <span css={dotMediumB} />
              <span css={dotLargeB} />
            </span>
            <span>
              Secure platform for interactive viewing and manipulation of <code>3D models</code> in{' '}
              <i>.obj</i> format
            </span>
            <span css={dotsStyle}>
              <span css={dotLarge} />
              <span css={dotMedium} />
              <span css={dotSmall} />
            </span>
          </div>
          <div css={featureItemStyle}>
            <span css={dotsStyle}>
              <span css={dotSmallB} />
              <span css={dotMediumB} />
              <span css={dotLargeB} />
            </span>
            <span>Support for cloud-based model storage, capturing and downloading</span>
            <span css={dotsStyle}>
              <span css={dotLarge} />
              <span css={dotMedium} />
              <span css={dotSmall} />
            </span>
          </div>
        </div>

        <div css={formContainerStyle}>
          <Button
            variant="contained"
            css={uploadButtonStyle}
            fullWidth
            onClick={() => navigate('/login')}
          >
            Login
          </Button>

          <div css={separatorStyle}>or</div>

          <Button
            variant="contained"
            css={uploadButtonStyle}
            fullWidth
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </div>

        <p css={descriptionStyle}>
          <br />
          User account enables asset management, access to visualizations, and a streamlined
          experience for working with 3D content online
        </p>
      </div>
      <Footer />
    </div>
  )
}
const featureListStyle = css`
  color: #ccc;
  font-size: 1rem;
  max-width: 80%;
  align-items: center;
  text-align: center;
  line-height: 1.8;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  code {
    color: rgba(0, 255, 208, 0.91);
    font-weight: bold;
  }

  //Mobile responsive
  @media (max-width: 768px) {
    max-width: 85%;
  }
`

const featureItemStyle = css`
  display: flex;
  align-items: center;
  gap: 12px;
`

const dotsStyle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  min-width: 32px; // Adjusted to ensure dots are centered
`

const dotSmall = css`
  width: 4px;
  height: 4px;
  background-color: #00ff99;
  border-radius: 50%;
`
const dotSmallB = css`
  width: 4px;
  height: 4px;
  background-color: #3399ff;
  border-radius: 50%;
`
const dotMedium = css`
  width: 6px;
  height: 6px;
  background-color: #00ff99;
  border-radius: 50%;
`
const dotMediumB = css`
  width: 6px;
  height: 6px;
  background-color: #3399ff;
  border-radius: 50%;
`

const dotLarge = css`
  width: 8px;
  height: 8px;
  background-color: #00ff99;
  border-radius: 50%;
`
const dotLargeB = css`
  width: 8px;
  height: 8px;
  background-color: #3399ff;
  border-radius: 50%;
`

const mainContainerStyle = css`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  overscroll-behavior: contain;
`
const loginContainerStyle = css`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #171717;
  overflow-y: auto;
  overscroll-behavior-y: contain;
`

const descriptionStyle = css`
  color: #ccc;
  text-align: center;
  max-width: 50%;
  line-height: 1.5;
  margin-bottom: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  code {
    color: #00ff99;
    font-weight: bold;
  }

  strong {
    color: #3399ff;
  }

  //Mobile responsive
  @media (max-width: 768px) {
    max-width: 85%;
  }
`
const formContainerStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
  margin-bottom: 20px;

  //Mobile responsive
  @media (max-width: 768px) {
    width: 85%;
  }
`

const uploadButtonStyle = css`
  background: linear-gradient(90deg, #3399ff, #00ff99);
  color: #1e1e1e;
  border-radius: 8px;
  margin-top: 8px;

  &:hover {
    box-shadow: 0px 0px 10px #00ff99;
  }

  &:disabled {
    background: rgb(33 33 33);
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const separatorStyle = css`
  margin: 20px 0;
  color: #888;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 2px;
  position: relative;
  text-align: center;
  width: 100%;

  &::before,
  &::after {
    content: '';
    height: 1px;
    width: 40%;
    background: #333;
    position: absolute;
    top: 50%;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }
`

export default Landing
