import { css } from '@emotion/react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import * as TWEAKPANE from 'tweakpane'

import useThreeSetup from '../../hooks/useThreeSetup'
import { moveCameraAndUpdateControls } from '../../utils/three-utils'
import ControlPanel from './ControlPanel'
import ModelSelector from './ModelSelector'

declare module 'tweakpane' {
  interface Pane {
    addBinding<T, K extends keyof T>(obj: T, prop: K, options?: object): T[K]

    addFolder(options: { title: string; expanded?: boolean }): Pane

    addButton(options: { title: string }): { on(event: 'click', callback: () => void): void }

    refresh(): void
  }
}

const WebObjectRenderer: React.FC = () => {
  const [currentObject, setCurrentObject] = useState<THREE.Object3D | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const currentObjectRef = useRef<THREE.Object3D | null>(null)
  const selectedObjectRef = useRef<string | null>(null)
  const tweakpaneRef = useRef<TWEAKPANE.Pane | null>(null)

  const paramsRef = useRef({
    wireframe: false,
    lightIntensity: 1,
    slicePositionXLeft: -3,
    slicePositionXRight: -3,
    slicePositionYTop: -3,
    slicePositionYBottom: -3,
    slicePositionZBack: -3,
    slicePositionZFront: -3
  })

  const clippingPlanesRef = useRef<THREE.Plane[]>([
    new THREE.Plane(new THREE.Vector3(1, 0, 0), 3),
    new THREE.Plane(new THREE.Vector3(0, 1, 0), 3),
    new THREE.Plane(new THREE.Vector3(0, 0, 1), 3),
    new THREE.Plane(new THREE.Vector3(-1, 0, 0), 3),
    new THREE.Plane(new THREE.Vector3(0, -1, 0), 3),
    new THREE.Plane(new THREE.Vector3(0, 0, -1), 3)
  ])

  const { sceneRef, cameraRef, rendererRef, controlsRef, lights } = useThreeSetup({
    canvasRef,
    clippingPlanes: clippingPlanesRef.current
  })

  useEffect(() => {
    if (rendererRef.current && currentObject && currentObject.children.length > 0) {
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
  }, [currentObject, cameraRef, sceneRef, rendererRef])

  const resetParams = useCallback(() => {
    Object.assign(paramsRef.current, {
      wireframe: false,
      lightIntensity: 1,
      slicePositionXLeft: -3,
      slicePositionXRight: -3,
      slicePositionYTop: -3,
      slicePositionYBottom: -3,
      slicePositionZBack: -3,
      slicePositionZFront: -3
    })
    tweakpaneRef.current?.refresh()
  }, [tweakpaneRef])

  const resetView = useCallback(() => {
    currentObject?.rotation.set(0, 0, 0)
    controlsRef.current?.reset()
    moveCameraAndUpdateControls('front', cameraRef.current, controlsRef.current)
    resetParams()
  }, [currentObject, controlsRef, cameraRef, resetParams])

  return (
    <div css={containerStyle}>
      <canvas ref={canvasRef}></canvas>
      <ControlPanel
        tweakpaneRef={tweakpaneRef}
        currentObjectRef={currentObjectRef}
        rendererRef={rendererRef}
        selectedObjectRef={selectedObjectRef}
        currentObject={currentObject}
        scene={sceneRef.current}
        camera={cameraRef.current}
        controls={controlsRef.current}
        clippingPlanes={clippingPlanesRef.current}
        lights={lights}
        params={paramsRef.current}
        resetView={resetView}
      />
      <ModelSelector
        selectedObjectRef={selectedObjectRef}
        currentObjectRef={currentObjectRef}
        scene={sceneRef.current}
        resetView={resetView}
        setCurrentObject={setCurrentObject}
        clippingPlanes={clippingPlanesRef.current}
      />
    </div>
  )
}

const containerStyle = css`
  position: relative;
  z-index: 2;
  background: #171717;
`

export default WebObjectRenderer
