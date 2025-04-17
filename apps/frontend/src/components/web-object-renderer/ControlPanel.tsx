import { css } from '@emotion/react'
import React, { memo, useCallback, useEffect } from 'react'
import * as THREE from 'three'
import type { InputBindingApi, TpChangeEvent } from 'tweakpane'
import * as TWEAKPANE from 'tweakpane'

import { ControlPanelProps } from '../../types/web-object-renderer'
import { moveCameraAndUpdateControls } from '../../utils/three-utils'

type SliceKey =
  | 'slicePositionXLeft'
  | 'slicePositionXRight'
  | 'slicePositionYTop'
  | 'slicePositionYBottom'
  | 'slicePositionZFront'
  | 'slicePositionZBack'

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
      lights.directional.forEach((light) => {
        light.intensity = intensity
      })
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

  const createCameraControls = useCallback(
    (pane: TWEAKPANE.Pane) => {
      const cameraFolder = pane.addFolder({
        title: 'Camera View',
        expanded: false
      })

      ;['top', 'front', 'right', 'iso'].forEach((view) => {
        cameraFolder
          .addButton({ title: view.charAt(0).toUpperCase() + view.slice(1) })
          .on('click', () => moveCameraAndUpdateControls(view, camera, controls))
      })
    },
    [camera, controls]
  )

  const createSliceControls = useCallback(
    (pane: TWEAKPANE.Pane) => {
      const slicesFolder = pane.addFolder({
        title: 'Slices',
        expanded: false
      })

      const sliceBindings: { key: SliceKey; label: string; planeIndex: number }[] = [
        { key: 'slicePositionXLeft', label: 'X Left', planeIndex: 0 },
        { key: 'slicePositionXRight', label: 'X Right', planeIndex: 3 },
        { key: 'slicePositionYTop', label: 'Y Top', planeIndex: 4 },
        { key: 'slicePositionYBottom', label: 'Y Bottom', planeIndex: 1 },
        { key: 'slicePositionZFront', label: 'Z Front', planeIndex: 5 },
        { key: 'slicePositionZBack', label: 'Z Back', planeIndex: 2 }
      ]

      sliceBindings.forEach(({ key, label, planeIndex }) => {
        const binding: InputBindingApi<typeof params, typeof key> = slicesFolder.addBinding(
          params,
          key,
          {
            min: -3,
            max: 3,
            label
          }
        )

        binding.on('change', (ev: TpChangeEvent<number>) => {
          clippingPlanes[planeIndex].constant = -ev.value
        })
      })
    },
    [params, clippingPlanes]
  )

  const createDownloadControls = useCallback(
    (pane: TWEAKPANE.Pane) => {
      const downloadFolder = pane.addFolder({
        title: 'Download',
        expanded: false
      })

      downloadFolder.addButton({ title: '2D - Screenshot image' }).on('click', handleTakeScreenshot)
      downloadFolder.addButton({ title: '3D - Model .obj' }).on('click', handleDownloadObj)
    },
    [handleTakeScreenshot, handleDownloadObj]
  )

  const setupTweakPane = useCallback(() => {
    const pane = tweakpaneRef.current
    if (!pane) return

    const wireframeBinding: InputBindingApi<typeof params, 'wireframe'> = pane.addBinding(
      params,
      'wireframe',
      {
        label: 'Wireframe Mode'
      }
    )
    wireframeBinding.on('change', (ev: TpChangeEvent<boolean>) => toggleWireframe(ev.value))

    const intensityBinding: InputBindingApi<typeof params, 'lightIntensity'> = pane.addBinding(
      params,
      'lightIntensity',
      {
        min: 0,
        max: 2,
        label: 'Light Intensity'
      }
    )
    intensityBinding.on('change', (ev: TpChangeEvent<number>) => changeLightIntensity(ev.value))

    createCameraControls(pane)
    createSliceControls(pane)
    createDownloadControls(pane)

    pane.addButton({ title: 'Reset all' }).on('click', resetView)
  }, [
    tweakpaneRef,
    params,
    toggleWireframe,
    changeLightIntensity,
    createCameraControls,
    createSliceControls,
    createDownloadControls,
    resetView
  ])

  useEffect(() => {
    if (!tweakpaneRef.current) {
      tweakpaneRef.current = new TWEAKPANE.Pane({
        container: document.getElementById('tweakpane') || undefined
      })

      setupTweakPane()
    }

    return () => {
      tweakpaneRef.current?.dispose()
      tweakpaneRef.current = null
    }
  }, [setupTweakPane, tweakpaneRef])

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
  border: 2px solid rgba(51, 153, 255, 0.8);
  font-family: 'Courier New', monospace !important;
  box-shadow: 0px 0px 10px rgba(51, 153, 255, 0.5);

  //Mobile responsive
  @media (max-width: 768px) {
    top: auto;
    bottom: 60px;
    right: 20px;
    left: 20px;
    max-width: calc(100% - 40px);
  }
`

export default memo(ControlPanel)
