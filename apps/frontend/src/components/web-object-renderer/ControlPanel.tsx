import { css } from '@emotion/react'
import React, { memo, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import * as TWEAKPANE from 'tweakpane'

import { ControlPanelProps } from '../../types/web-object-renderer'
import { moveCameraAndUpdateControls } from '../../utils/three-utils'

const ControlPanel: React.FC<ControlPanelProps> = ({
  params,
  scene,
  camera,
  controls,
  clippingPlanes,
  lights,
  currentObjectRef,
  rendererRef,
  selectedObjectRef,
  tweakpaneRef,
  resetView
}) => {
  const setupTweakPane = () => {
    const pane = tweakpaneRef.current

    if (!pane) return

    pane
      .addBinding(params, 'wireframe', {
        label: 'Wireframe Mode'
      })
      .on('change', (ev: TWEAKPANE.TpChangeEvent<number>) => {
        toggleWireframe(ev.value)
      })

    pane
      .addBinding(params, 'lightIntensity', {
        min: 0,
        max: 2,
        label: 'Light Intensity'
      })
      .on('change', (ev: TWEAKPANE.TpChangeEvent<number>) => {
        changeLightIntensity(ev.value)
      })

    createCameraControls(pane)
    createSliceControls(pane)
    createDownloadControls(pane)

    pane.addButton({ title: 'Reset all' }).on('click', resetView)
  }

  const createCameraControls = (pane: TWEAKPANE.Pane) => {
    const cameraFolder = pane.addFolder({
      title: 'Camera View',
      expanded: false
    })
    ;['top', 'front', 'right', 'iso'].forEach((view) => {
      cameraFolder
        .addButton({
          title: view.charAt(0).toUpperCase() + view.slice(1)
        })
        .on('click', () => {
          moveCameraAndUpdateControls(view, camera, controls)
        })
    })
  }

  const createSliceControls = (pane: TWEAKPANE.Pane) => {
    const slicesFolder = pane.addFolder({
      title: 'Slices',
      expanded: false
    })
    const sliceAxes = ['XLeft', 'XRight', 'YTop', 'YBottom', 'ZFront', 'ZBack']
    const clippingIndices = [0, 3, 4, 1, 5, 2]

    sliceAxes.forEach((axis, index) => {
      slicesFolder
        .addBinding(params, `slicePosition${axis}`, {
          min: -3,
          max: 3,
          label: axis.replace(/([A-Z])/g, ' $1')
        })
        .on('change', (ev: TWEAKPANE.TpChangeEvent<number>) => {
          clippingPlanes[clippingIndices[index]].constant = -ev.value
        })
    })
  }

  const createDownloadControls = (pane: TWEAKPANE.Pane) => {
    const downloadFolder = pane.addFolder({
      title: 'Download',
      expanded: false
    })
    downloadFolder.addButton({ title: '2D - Screenshot image' }).on('click', handleTakeScreenshot)
    downloadFolder.addButton({ title: '3D - Model .obj' }).on('click', handleDownloadObj)
  }

  const toggleWireframe = useCallback(
    (enabled: boolean) => {
      currentObjectRef.current?.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material.wireframe = enabled
        }
      })
    },
    [currentObjectRef]
  )

  const changeLightIntensity = useCallback(
    (intensity: number) => {
      lights.directional.forEach((light) => (light.intensity = intensity))
    },
    [lights]
  )

  const handleTakeScreenshot = useCallback(() => {
    if (!rendererRef.current) return

    rendererRef.current.render(scene, camera)

    const screenshot = rendererRef.current.domElement.toDataURL('image/png')
    const link = document.createElement('a')

    link.href = screenshot
    link.download = 'screenshot.png'
    link.click()
  }, [rendererRef, scene, camera])

  const handleDownloadObj = useCallback(() => {
    if (selectedObjectRef.current) {
      const link = document.createElement('a')

      link.href = selectedObjectRef.current
      link.download = 'model.obj'
      link.click()
    }
  }, [selectedObjectRef])

  useEffect(() => {
    if (!tweakpaneRef.current) {
      tweakpaneRef.current = new TWEAKPANE.Pane({
        container: document.getElementById('tweakpane') || undefined
      })

      setupTweakPane()
    }

    return () => {
      tweakpaneRef.current?.dispose() //Cleanup koji se izvršava kada se komponenta unmounta
      tweakpaneRef.current = null
    }
  }, [])

  return <div id="tweakpane" css={tweakPaneStyle}></div>
}

const tweakPaneStyle = css`
  position: fixed;
  top: 100px;
  right: 70px;
  background: #1e1e1e !important;
  padding: 12px;
  border-radius: 12px;
  z-index: 100;
  max-width: 400px;
  border: 2px solid rgba(51, 153, 255, 0.8); /* Plavi border */
  font-family: 'Courier New', monospace !important;
  box-shadow: 0px 0px 10px rgba(51, 153, 255, 0.5);
`

export default memo(ControlPanel)
