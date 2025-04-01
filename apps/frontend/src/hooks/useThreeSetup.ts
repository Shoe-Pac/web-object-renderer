import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { debounce } from '../utils/debounce'
import { animate, setupControls, setupLights, setupRenderer } from '../utils/three-utils'

interface UseThreeSetupProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  clippingPlanes: THREE.Plane[]
}

const useThreeSetup = ({ canvasRef, clippingPlanes }: UseThreeSetupProps) => {
  const sceneRef = useRef(new THREE.Scene())

  const cameraRef = useRef(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
  )

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const lights = useMemo(() => ({ directional: [] as THREE.DirectionalLight[] }), [])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current

    const renderer = new THREE.WebGLRenderer({ canvas })
    rendererRef.current = renderer

    setupRenderer(renderer, clippingPlanes)
    cameraRef.current.position.z = 5
    setupLights(sceneRef.current, lights)

    const newControls = setupControls(cameraRef.current, renderer)
    controlsRef.current = newControls

    animate(renderer, sceneRef.current, cameraRef.current, newControls)

    const adjustCanvasSize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      canvas.width = width
      canvas.height = height
      renderer.setSize(width, height)
      cameraRef.current.aspect = width / height
      cameraRef.current.updateProjectionMatrix()
    }

    const debouncedAdjustCanvasSize = debounce(adjustCanvasSize, 100)

    window.addEventListener('resize', debouncedAdjustCanvasSize)

    return () => {
      window.removeEventListener('resize', debouncedAdjustCanvasSize)
    }
  }, [canvasRef, clippingPlanes, lights])

  return { sceneRef, cameraRef, rendererRef, controlsRef, lights }
}

export default useThreeSetup
