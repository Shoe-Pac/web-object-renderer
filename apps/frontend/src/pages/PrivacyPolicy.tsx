import { css } from '@emotion/react'

import Footer from '../components/Footer'
import WireframeBackground from '../components/ui/WireFrameBackground'

const PrivacyPolicy = () => {
  return (
    <div css={mainContainerStyle}>
      <WireframeBackground />

      <div css={policyStyle}>
        <div css={formStyle}>
          <h1 style={{ marginBottom: '64px', zIndex: 2, textAlign: 'center' }}>Privacy Policy</h1>
          <p style={{ zIndex: 2 }}>
            Your privacy is important to us. This application securely stores user data such as
            email addresses and uploaded 3D model files for the purpose of account management and
            rendering functionalities.
          </p>
          <p style={{ zIndex: 2 }}>
            We do not share or sell your data. All storage is encrypted and access is restricted to
            authenticated sessions only.
          </p>
          <p style={{ zIndex: 2 }}>
            Uploaded 3D models are stored securely on AWS S3 and are only accessible by the
            uploading user. We do not use tracking cookies or third-party analytics tools that
            compromise your privacy.
          </p>
          <p style={{ zIndex: 2 }}>
            If you have questions or wish to delete your account, please contact us at{' '}
            <a href="mailto:mesic.mirza07@gmail.com">mesic.mirza07@gmail.com</a>.
          </p>
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
const formStyle = css`
  z-index: 2;
  background: #171717;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
`
const policyStyle = css`
  padding: 40px 20px;
  margin: 0 auto;
  color: #ccc;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #171717;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  h1 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #3b82f6;
  }

  p {
    line-height: 1.6;
    margin-bottom: 16px;
  }

  a {
    color: #3399ff;
    text-decoration: underline;

    &:hover {
      color: #00ff99;
    }
  }
`

export default PrivacyPolicy
