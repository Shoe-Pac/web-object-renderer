import { Autocomplete, css, ListSubheader, TextField, ThemeProvider } from '@mui/material'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

import useAuth from '../../hooks/useAuth'
import useGetUser from '../../hooks/useGetUser'
import muiTheme from '../../styles/theme-mui'
import EditModels from './EditModels'

interface ModelSelectorProps {
  clippingPlanes: THREE.Plane[]
  scene: THREE.Scene
  selectedObjectRef: React.MutableRefObject<string | null>
  currentObjectRef: React.MutableRefObject<THREE.Object3D | null>
  setCurrentObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>
  resetView: () => void
}

interface ModelData {
  name: string
  category: string
  fileUrl: string
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  scene,
  clippingPlanes,
  selectedObjectRef,
  currentObjectRef,
  setCurrentObject,
  resetView
}) => {
  const loader = useRef(new OBJLoader()).current
  const [models, setModels] = useState<ModelData[]>([])
  const [categoryMap, setCategoryMap] = useState<Map<string, string>>(new Map())
  const { userId } = useAuth()
  const { data } = useGetUser(userId, !userId)

  const fetchModels = useCallback(async () => {
    if (!data) return 'No data!'

    try {
      let modelsData: ModelData[] = [...data.getUser.fileMetadata]
      const categoryMapping = new Map<string, string>()

      modelsData.forEach((model) => {
        const cleanedCategory = model.category.trim().toLowerCase()

        if (!categoryMapping.has(cleanedCategory)) {
          categoryMapping.set(cleanedCategory, model.category.trim()) // Čuvamo originalni naziv
        }
      })

      //Models are sorted by original category name
      modelsData = modelsData.sort((a, b) => {
        const categoryA = categoryMapping.get(a.category.trim().toLowerCase()) || ''
        const categoryB = categoryMapping.get(b.category.trim().toLowerCase()) || ''

        return categoryA.localeCompare(categoryB)
      })

      setCategoryMap(categoryMapping)
      setModels(modelsData)
    } catch (error) {
      console.error('Error fetching models:', error)
    }
  }, [data])

  const removeCurrentObject = useCallback(() => {
    if (currentObjectRef.current) {
      scene.remove(currentObjectRef.current)

      currentObjectRef.current.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach((mat) => mat.dispose())
          } else {
            child.material.dispose()
          }
        }
      })

      currentObjectRef.current = null
    }

    setCurrentObject(null)
    selectedObjectRef.current = null
  }, [currentObjectRef, scene, selectedObjectRef, setCurrentObject])

  const loadObject = useCallback(
    (modelPath: string) => {
      removeCurrentObject()

      loader.load(
        modelPath,
        (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.material.clippingPlanes = clippingPlanes
              child.material.side = THREE.DoubleSide
            }
          })

          object.position.set(0, 0, 0)
          let boundingBox = new THREE.Box3().setFromObject(object)
          const size = boundingBox.getSize(new THREE.Vector3())
          const maxDimension = Math.max(size.x, size.y, size.z)
          const scaleFactor = maxDimension > 0 ? 2 / maxDimension : 1
          object.scale.set(scaleFactor, scaleFactor, scaleFactor)

          boundingBox = new THREE.Box3().setFromObject(object)
          const center = boundingBox.getCenter(new THREE.Vector3())
          object.position.set(-center.x, -center.y, -center.z)

          currentObjectRef.current = object
          setCurrentObject(object)

          if (!scene.children.includes(object)) {
            scene.add(object)
          }
        },
        undefined,
        (error) => console.error('Error loading object:', error)
      )
    },
    [clippingPlanes, loader, removeCurrentObject, scene, setCurrentObject, currentObjectRef]
  )

  const refreshScene = useCallback(
    (modelNames: string[]) => {
      const modelUrl = selectedObjectRef.current

      if (modelUrl) {
        const fileName = modelUrl.substring(
          modelUrl.lastIndexOf('/') + 1,
          modelUrl.lastIndexOf('.obj')
        )

        if (modelNames.includes(fileName)) {
          removeCurrentObject()
          resetView()
        }
      }
    },
    [removeCurrentObject, resetView, selectedObjectRef]
  )

  useEffect(() => {
    fetchModels()
  }, [fetchModels])

  return (
    <ThemeProvider theme={muiTheme}>
      <Autocomplete
        key={models.length}
        css={autocompleteStyle}
        size="small"
        options={models}
        getOptionLabel={(option) => option.name}
        groupBy={(option) =>
          categoryMap.get(option.category.trim().toLowerCase()) || option.category
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose model to load"
            variant="outlined"
            css={textFieldStyle}
          />
        )}
        renderGroup={(params) => (
          <div key={params.key}>
            <ListSubheader>{params.group}</ListSubheader>
            {params.children}
          </div>
        )}
        onChange={(_, newValue) => {
          if (newValue) {
            loadObject(newValue.fileUrl)
            selectedObjectRef.current = newValue.fileUrl
            resetView()
          }
        }}
        isOptionEqualToValue={(option, value) => option.fileUrl === value.fileUrl}
        disableClearable
      />

      <EditModels refreshScene={refreshScene} availableModels={models} />
    </ThemeProvider>
  )
}

const textFieldStyle = css`
  background: rgba(50, 50, 50, 0.9);
  border-radius: 5px;
  width: 220px;
`

const autocompleteStyle = css`
  position: fixed;
  top: 100px;
  left: 20px;
  background: #1e1e1e !important;
  padding: 12px;
  border-radius: 12px;
  z-index: 100;
  border: 2px solid rgba(51, 153, 255, 0.8);
  font-family: 'Courier New', monospace !important;
  box-shadow: 0px 0px 10px rgba(51, 153, 255, 0.5);
`

export default memo(ModelSelector)
