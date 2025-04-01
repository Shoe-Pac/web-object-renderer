import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export const setupRenderer = (renderer: THREE.WebGLRenderer, clippingPlanes: THREE.Plane[]) => {
  renderer.setClearColor(0x171717)
  renderer.localClippingEnabled = true
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.clippingPlanes = clippingPlanes
}

export const setupLights = (
  scene: THREE.Scene,
  lights: { directional: THREE.DirectionalLight[] }
) => {
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
  scene.add(ambientLight)

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight1.position.set(5, 5, 5)
  lights.directional.push(directionalLight1)
  scene.add(directionalLight1)

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight2.position.set(-5, -5, -5)
  lights.directional.push(directionalLight2)
  scene.add(directionalLight2)
}

export const animate = (
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
) => {
  const animateLoop = () => {
    requestAnimationFrame(animateLoop)
    controls.update()
    renderer.render(scene, camera)
  }
  animateLoop()
}

export const setupControls = (camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => {
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.enablePan = false
  controls.minDistance = 2
  controls.maxDistance = 8
  controls.update()

  return controls
}

export const moveCameraAndUpdateControls = (
  position: string,
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls | null
) => {
  setCamera(position, camera)
  camera.lookAt(0, 0, 0)

  controls?.target.set(0, 0, 0)
  controls?.update()
}

const setCamera = (position: string, camera: THREE.PerspectiveCamera) => {
  switch (position) {
    case 'top':
      camera.position.set(0, 5, 0)
      break
    case 'front':
      camera.position.set(0, 0, 5)
      break
    case 'right':
      camera.position.set(5, 0, 0)
      break
    case 'iso':
      camera.position.set(3, 3, 3)
      break
  }
}
