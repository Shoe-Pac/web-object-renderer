import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as TWEAKPANE from 'tweakpane'

export type ControlPanelProps = {
  params: {
    wireframe: boolean
    lightIntensity: number
    slicePositionXLeft: number
    slicePositionXRight: number
    slicePositionYTop: number
    slicePositionYBottom: number
    slicePositionZFront: number
    slicePositionZBack: number
  }
  scene: THREE.Scene
  controls: OrbitControls | null
  clippingPlanes: THREE.Plane[]
  lights: { directional: THREE.DirectionalLight[] }
  camera: THREE.PerspectiveCamera
  currentObjectRef: React.MutableRefObject<THREE.Object3D | null>
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>
  selectedObjectRef: React.MutableRefObject<string | null>
  tweakpaneRef: React.MutableRefObject<TWEAKPANE.Pane | null>
  currentObject: THREE.Object3D | null
  resetView: () => void
}
