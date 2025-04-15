import { css } from '@emotion/react'
import { memo, useEffect, useState } from 'react'

import profile from '../assets/profile.jpg'
import Header from '../components/Header'
import Button from '../components/ui/Button'
import Form from '../components/ui/Form'
import Input from '../components/ui/Input'
import useAuth from '../hooks/useAuth'
import useGetUser from '../hooks/useGetUser'
import useSnackBar from '../hooks/useSnackBar'
import useUpdateUser from '../hooks/useUpdateUser'
import { validatePassword } from '../utils/api-services/auth'
import { uploadImageToAws } from '../utils/api-services/upload-file'
import {
  validateEmailField,
  validateNameField,
  validatePasswordField,
  validateProfileImageField
} from '../utils/field-validation'

const Profile = memo(() => {
  const { userId } = useAuth()
  const { setSnackBarContent } = useSnackBar()
  const { data } = useGetUser(userId, !userId)
  const [updateUser] = useUpdateUser()

  const defaultUserData = {
    id: '',
    name: '',
    email: '',
    password: '',
    profileImage: '',
    currentPassword: '',
    newPassword: ''
  }

  const [userData, setUserData] = useState(defaultUserData)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [error, setError] = useState('')

  const [fieldErrors, setFieldErrors] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    profileImage: ''
  })

  useEffect(() => {
    if (data?.getUser) {
      setUserData({
        ...data.getUser,
        currentPassword: '',
        newPassword: ''
      })
    }
  }, [data])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData({ ...userData, [name]: value })

    if (name === 'email') {
      setFieldErrors({ ...fieldErrors, email: validateEmailField(value) })
    } else if (name === 'currentPassword') {
      setFieldErrors({
        ...fieldErrors,
        currentPassword: validatePasswordField(value)
      })
    } else if (name === 'newPassword') {
      setFieldErrors({
        ...fieldErrors,
        newPassword: validatePasswordField(value)
      })
    } else if (name === 'name') {
      setFieldErrors({ ...fieldErrors, name: validateNameField(value) })
    }
  }

  const handleEditClick = () => {
    if (isEditing) {
      handleSave()
    } else {
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    setError('')
    // setFieldErrors({ name: validateNameField(userData.name), email: validateEmailField(userData.email), currentPassword: validatePasswordField(userData.currentPassword), newPassword: validatePasswordField(userData.currentPassword), profileImage: validateProfileImageField(selectedFile) });
    if (
      fieldErrors.name ||
      fieldErrors.email ||
      (userData.currentPassword && fieldErrors.currentPassword) ||
      (userData.newPassword && fieldErrors.newPassword) ||
      fieldErrors.profileImage
    ) {
      return
    }

    if (userData.newPassword && !userData.currentPassword) {
      setFieldErrors({
        ...fieldErrors,
        currentPassword: 'Enter current password in order to be able to set a new password'
      })

      return
    }

    if (userData.newPassword && userData.currentPassword) {
      const response = await validatePassword(userData.email, userData.currentPassword)
      const isPasswordValid = await response.json()

      console.log('isPasswordValid', isPasswordValid)

      if (!isPasswordValid.valid) {
        setFieldErrors({
          ...fieldErrors,
          currentPassword: 'Incorrect current password entered'
        })

        return
      }
    }

    let profileImage = userData.profileImage

    if (selectedFile) {
      const imageUrl = await handleImageUploadToAws()

      if (!imageUrl) {
        profileImage = data.getUser.profileImage
        setSnackBarContent((prev) => ({
          ...prev,
          message: 'Uploading image to AWS failed!',
          severity: 'error'
        }))
        throw new Error('Profile image AWS upload failed!')
      }

      profileImage = imageUrl
    }

    await updateUserDataInMongoDB(profileImage)
    setSnackBarContent((prev) => ({
      ...prev,
      message: 'User successfully updated!',
      severity: 'success',
      position: { vertical: 'top', horizontal: 'center' }
    }))
    setFieldErrors({
      name: '',
      email: '',
      currentPassword: '',
      newPassword: '',
      profileImage: ''
    })
    setSelectedFile(null)
    setUserData({ ...userData, currentPassword: '', newPassword: '' })
    setShowPassword(false)
  }

  const handleImageUploadToAws = async () => {
    if (!selectedFile) return

    const formData = new FormData()

    formData.append('file', selectedFile)
    formData.append('userId', userData.id)

    const response = await uploadImageToAws(formData)
    const uploadImageData = await response.json()

    if (uploadImageData.profileImage) {
      setUserData((prev) => ({
        ...prev,
        profileImage: uploadImageData.profileImage
      }))

      return uploadImageData.profileImage
    } else {
      console.error('Error uploading image to AWS!')
      setSnackBarContent((prev) => ({
        ...prev,
        message: 'Error uploading image to AWS!',
        severity: 'error'
      }))
    }
  }

  const updateUserDataInMongoDB = async (profileImage: string) => {
    try {
      await updateUser({
        variables: {
          userId: userData.id,
          name: userData.name,
          email: userData.email,
          password: userData.newPassword,
          profileImage
        }
      })

      setIsEditing(false)
      window.history.replaceState({}, '', `/profile/${userData.name}`)
    } catch (err) {
      console.error('Error updating user in MongoDB:', err)
      setError('Error updating user in MongoDB.')
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFieldErrors({
        ...fieldErrors,
        profileImage: validateProfileImageField(file)
      })

      setSelectedFile(file)
      //Show temporary new image
      const reader = new FileReader()

      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          profileImage: reader.result as string
        }))
      }

      reader.readAsDataURL(file)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'start',
        gap: '40px',
        background: '#171717',
        minHeight: '100vh',
        width: '100%',
        paddingBottom: '60px',
        overscrollBehavior: 'none'
      }}
    >
      <Header />
      <div css={formStyle}>
        <Form>
          <h2
            style={{
              color: 'white',
              textAlign: 'center',
              marginBottom: '35px'
            }}
          >
            Profile
          </h2>
          <img css={imgStyle} src={userData?.profileImage || profile} alt="profile" />{' '}
          <div
            css={{
              color: 'white',
              textAlign: 'center',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            {userData?.name}
          </div>
          {isEditing && (
            <div css={fileInputWrapper}>
              <label htmlFor="file-input" css={customFileInputStyle}>
                Change Photo
              </label>
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              {fieldErrors.profileImage && (
                <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.profileImage}</p>
              )}
            </div>
          )}
          <div css={nameStyle}>Name</div>
          <Input
            name="name"
            placeholder="Name"
            value={userData?.name}
            onChange={handleChange}
            disabled={!isEditing}
            css={!isEditing ? disabledInputStyle : undefined}
            autoComplete="name"
          />
          {fieldErrors.name && <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.name}</p>}
          <div css={labelStyle}>E-mail</div>
          <Input
            name="email"
            type="email"
            placeholder="Email"
            value={userData?.email}
            onChange={handleChange}
            disabled={!isEditing}
            css={!isEditing ? disabledInputStyle : undefined}
            autoComplete="email"
          />
          {fieldErrors.email && (
            <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.email}</p>
          )}
          {!isEditing && (
            <>
              <div css={labelStyle}>Password</div>
              <Input
                name="password"
                type="password"
                placeholder="Password"
                value="example"
                disabled={!isEditing}
                css={disabledInputStyle}
                autoComplete="password"
              />
            </>
          )}
          {isEditing && (
            <>
              <div css={labelStyle}>Current Password</div>
              <Input
                name="currentPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={userData?.currentPassword}
                onChange={handleChange}
                disabled={!isEditing}
                css={!isEditing ? disabledInputStyle : undefined}
                autoComplete="current-password"
              />
              {fieldErrors.currentPassword && (
                <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.currentPassword}</p>
              )}

              <div css={labelStyle}>New Password</div>
              <Input
                name="newPassword"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                value={userData?.newPassword}
                onChange={handleChange}
                disabled={!isEditing}
                css={!isEditing ? disabledInputStyle : undefined}
                autoComplete="new-password"
              />
              {fieldErrors.newPassword && (
                <p style={{ color: 'red', fontSize: '12px' }}>{fieldErrors.newPassword}</p>
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
            </>
          )}
          {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
          <Button primary css={buttonStyle} type="button" fullWidth onClick={handleEditClick}>
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </Form>
      </div>
    </div>
  )
})

const imgStyle = css`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  margin: 0 auto;
`

const nameStyle = css`
  color: white;
  margin-top: 50px;
  text-align: left;
  font-size: 14px;
`

const labelStyle = css`
  color: white;
  margin-top: 10px;
  text-align: left;
  font-size: 14px;
`

const formStyle = css`
  margin-top: 100px;
`

const buttonStyle = css`
  margin-top: 35px;
`

const disabledInputStyle = css`
  color: #9e9e9e; /* Siva boja teksta */
  font-style: italic; /* Kurziv */
  background-color: #222222; /* Malo svjetlija pozadina */
  border: 1px solid #525252; /* Sivi border */
  cursor: not-allowed;
`

const customFileInputStyle = css`
  background-color: #333;
  color: white;
  font-size: 16px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 50%;
  text-align: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #444;
  }

  &:focus {
    outline: none;
  }
`

const fileInputWrapper = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`

export default Profile
