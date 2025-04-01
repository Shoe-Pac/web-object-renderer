import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import UploadFileTwoToneIcon from '@mui/icons-material/UploadFileTwoTone'
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  css,
  IconButton,
  Modal,
  Paper,
  TextField,
  Tooltip,
  Typography
} from '@mui/material'
import React, { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import useAuth from '../../hooks/useAuth'
import useSnackBar from '../../hooks/useSnackBar'
import useUpdateUser from '../../hooks/useUpdateUser'
import { editModelsForm } from '../../types/form'
import { EditModelsProps, FileMetadata, ModelData } from '../../types/objModels'
import { uploadObjFileToAws } from '../../utils/api-services/upload-file'

const EditModels: React.FC<EditModelsProps> = ({ refreshScene, availableModels }) => {
  const [open, setOpen] = useState(false)
  const [loadingUpload, setLoadingUpload] = useState(false)
  const [loadingRemove, setLoadingRemove] = useState(false)
  const { userId } = useAuth()
  const [updateUser] = useUpdateUser()
  const { setSnackBarContent } = useSnackBar()

  const { control, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      modelName: '',
      category: '',
      file: null as File | null,
      selectedModels: [] as ModelData[]
    }
  })

  //Dynamic categories extraction from availableModels
  const availableCategories = useMemo(() => {
    return [...new Set(availableModels.map((m) => m.category))]
  }, [availableModels])

  const selectedCategory = watch('category')

  const addFileMetadataToUser = useCallback(
    async (fileMetadata: FileMetadata) => {
      try {
        await updateUser({
          variables: {
            userId: userId,
            fileMetadata
          }
        })

        setOpen(false)
        reset()
      } catch (err) {
        console.error('Error adding fileMetadata to user in MongoDB:', err)
        setSnackBarContent((prev) => ({
          ...prev,
          message: `Error adding fileMetadata to user in MongoDB!`,
          severity: 'error'
        }))
      }
    },
    [updateUser, userId, reset, setSnackBarContent]
  )

  const handleUpload = useCallback(
    async (data: editModelsForm) => {
      if (!data.file || !data.modelName || !userId) return

      setLoadingUpload(true)

      const formData = new FormData()

      formData.append('file', data.file)
      formData.append('modelName', data.modelName)
      formData.append('category', data.category || '')
      formData.append('userId', userId)

      try {
        const response = await uploadObjFileToAws(formData)
        const uploadedFileData = await response.json()
        const fileUrl = uploadedFileData.fileUrl

        if (!fileUrl) {
          setSnackBarContent((prev) => ({
            ...prev,
            message: `Error uploading file to AWS!`,
            severity: 'error'
          }))
          throw new Error('Error uploading file to AWS!')
        }

        const fileMetadata: FileMetadata = {
          filename: data.file.name,
          name: data.modelName,
          category: data.category,
          fileUrl
        }

        await addFileMetadataToUser(fileMetadata)

        setSnackBarContent((prev) => ({
          ...prev,
          message: `New model file successfully uploaded and added to the list!`,
          severity: 'success',
          position: { vertical: 'top', horizontal: 'left' },
          duration: 6000
        }))
      } catch (error) {
        console.error('Error uploading file:', error)
        setSnackBarContent((prev) => ({
          ...prev,
          message: `Error uploading file!`,
          severity: 'error'
        }))
      }

      setLoadingUpload(false)
    },
    [addFileMetadataToUser, userId, setSnackBarContent]
  )

  const removeModelsFromUser = useCallback(
    async (modelNames: string[]) => {
      try {
        //Here updateUser removes models both from AWS cloud and MongoDB within grapql mutation
        await updateUser({
          variables: {
            userId: userId,
            modelsToRemove: modelNames
          }
        })

        setLoadingRemove(false)
        setOpen(false)
        refreshScene(modelNames)
        reset()
        setSnackBarContent((prev) => ({
          ...prev,
          message: `Model files removed from the list!`,
          severity: 'info',
          position: { vertical: 'top', horizontal: 'left' }
        }))
      } catch (error) {
        console.error('Error removing models from user:', error)
        setSnackBarContent((prev) => ({
          ...prev,
          message: `Error removing models from user!`,
          severity: 'error'
        }))
      }
    },
    [updateUser, userId, reset, refreshScene, setSnackBarContent]
  )

  const handleRemove = useCallback(
    async (data: editModelsForm) => {
      if (!data.selectedModels.length || !userId) return
      setLoadingRemove(true)

      const modelNames: string[] = data.selectedModels.map((m: ModelData) => m.name)

      await removeModelsFromUser(modelNames)
    },
    [removeModelsFromUser, userId]
  )

  return (
    <>
      <Tooltip title="Upload or remove models" placement="right" css={tooltipStyle}>
        <IconButton size="large" onClick={() => setOpen(true)}>
          <UploadFileTwoToneIcon css={iconStyle} />
        </IconButton>
      </Tooltip>

      <Modal open={open} onClose={() => setOpen(false)} disableScrollLock>
        <Box css={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Edit Models
          </Typography>

          {/* Upload New Model Section */}
          <Paper elevation={3} sx={{ mb: 2, p: 2, marginTop: 2 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Upload New 3D Model
            </Typography>
            <form onSubmit={handleSubmit(handleUpload)}>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <>
                    <input
                      type="file"
                      accept=".obj"
                      hidden
                      id="file-upload"
                      onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                    />
                    <label htmlFor="file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        fullWidth
                        sx={{ mt: 2, marginTop: 3 }}
                      >
                        Choose File
                      </Button>
                    </label>
                    {field.value && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          color: 'text.secondary'
                        }}
                      >
                        {field.value.name}
                      </Typography>
                    )}
                  </>
                )}
              />

              <Controller
                name="modelName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Give it a name"
                    fullWidth
                    variant="outlined"
                    css={textFieldStyle}
                  />
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    freeSolo
                    options={availableCategories}
                    value={selectedCategory || ''}
                    onChange={(_, newValue) => setValue('category', newValue || '')}
                    onInputChange={(_, newInputValue) => setValue('category', newInputValue || '')}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Choose or give it a category"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                css={uploadButtonStyle}
                fullWidth
                disabled={!watch('file') || !watch('modelName') || !watch('category')}
                endIcon={<CloudUploadIcon />}
              >
                {loadingUpload ? <CircularProgress size={24} /> : 'Upload'}
              </Button>
            </form>
          </Paper>

          {/* Remove Models Section */}
          <Paper elevation={3} sx={{ p: 2, marginTop: 5 }}>
            <Typography variant="subtitle2" color="textSecondary">
              Remove Models
            </Typography>
            <form onSubmit={handleSubmit(handleRemove)}>
              <Controller
                name="selectedModels"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    multiple
                    options={availableModels}
                    getOptionLabel={(option) => option.name}
                    sx={{ marginTop: 1 }}
                    onChange={(_, newValue) => setValue('selectedModels', newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select models to remove"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 2 }}
                      />
                    )}
                  />
                )}
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                css={removeButtonStyle}
                fullWidth
                disabled={watch('selectedModels').length === 0}
                endIcon={<DeleteForeverIcon />}
              >
                {loadingRemove ? <CircularProgress size={24} /> : 'Remove'}
              </Button>
            </form>
          </Paper>
        </Box>
      </Modal>
    </>
  )
}

const iconStyle = css`
  font-size: 40px;
  position: fixed;
  top: 120px;
  left: 300px;
  color: grey;

  &:hover {
    filter: drop-shadow(0px 0px 15px rgba(0, 150, 255, 0.7));
    color: #00ff99;
  }
`

const tooltipStyle = css`
  position: fixed;
  top: 120px;
  left: 300px;
  z-index: 100;
`

const uploadButtonStyle = css`
  background: linear-gradient(90deg, #3399ff, #00ff99);
  color: #1e1e1e;
  border-radius: 8px;
  &:hover {
    box-shadow: 0px 0px 10px #00ff99;
  }
  margin-top: 28px;

  &:disabled {
    background: rgb(33 33 33);
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const removeButtonStyle = css`
  background: linear-gradient(90deg, #ff4d4d, #aa00ff);
  color: #1e1e1e;
  border-radius: 8px;
  margin-top: 24px;

  &:hover {
    box-shadow: 0px 0px 12px rgba(255, 77, 77, 0.8);
  }

  &:disabled {
    background: rgb(33 33 33);
    color: rgba(0, 0, 0, 0.26);
    box-shadow: none;
    cursor: not-allowed;
  }
`

const modalStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 350px;
  background: #2c2c2c;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  color: white;
  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.2);
`

const textFieldStyle = css`
  margin-top: 16px;
  background-color: #262626;

  & .MuiInputBase-input {
    background-color: #262626;
    color: white;
    font-size: 1rem;
    font-family: inherit;

    &:-webkit-autofill {
      background-color: #262626 !important;
      -webkit-box-shadow: 0 0 0px 1000px #262626 inset !important;
      color: white !important;
      -webkit-text-fill-color: white !important;
      font-size: 1rem !important;
      font-family: inherit !important;
    }
  }

  & .MuiOutlinedInput-root {
    & fieldset {
      border-color: #1d1d1d; /* Defaultna MUI boja */
    }
  }
`

export default EditModels
