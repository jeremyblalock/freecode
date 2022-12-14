import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsLoader } from 'enable3d'
import { CSG } from 'three-csg-ts'
//import { initializeReact } from './react'
//import { DEGREES } from './utils/geometry'

import './styles.css'

const BOX_SIZE = 1

const getCameraFactor = () => (5 * BOX_SIZE) / window.innerHeight

const setup = async () => {
  const scene = new Three.Scene()
  scene.background = new Three.Color('#aaa5a1')

  const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const cameraFactor = getCameraFactor()

  const orthoCamera = new Three.OrthographicCamera(
    -window.innerWidth * cameraFactor,
    window.innerWidth * cameraFactor,
    window.innerHeight * cameraFactor,
    -window.innerHeight * cameraFactor,
    -10000,
    10000
  )

  const renderer = new Three.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  const setSize = () => {
    const width = window.innerWidth
    const height = window.innerHeight

    renderer.setSize(width, height)

    // Update camera
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    const cameraFactor = getCameraFactor()

    // Update orthographic camera
    orthoCamera.left = -window.innerWidth * cameraFactor
    orthoCamera.right = window.innerWidth * cameraFactor
    orthoCamera.top = window.innerHeight * cameraFactor
    orthoCamera.bottom = -window.innerHeight * cameraFactor
    orthoCamera.updateProjectionMatrix()
  }

  window.addEventListener('resize', setSize)

  setSize()

  const el = document.getElementById('root')
  el.appendChild(renderer.domElement)

  // Add light
  const light = new Three.DirectionalLight('#fff', 1)
  scene.add(light)

  light.position.set(10 * BOX_SIZE, 20 * BOX_SIZE, 30 * BOX_SIZE)
  light.castShadow = true

  // Light Shadow
  light.shadow.mapSize.width = 10000
  light.shadow.mapSize.height = 10000

  const ambientLight = new Three.AmbientLight('#fff', 0.2)
  scene.add(ambientLight)

  // Set camera position
  orthoCamera.position.z = 2 * BOX_SIZE
  orthoCamera.position.x = 2 * BOX_SIZE

  orthoCamera.position.y = 2 * BOX_SIZE

  // Add plane (for shadows)
  const planeGeo = new Three.PlaneGeometry(100 * BOX_SIZE, 100 * BOX_SIZE)

  const planeMaterial = new Three.ShadowMaterial({
    side: Three.DoubleSide,
    opacity: 0.1,
  })

  const plane = new Three.Mesh(planeGeo, planeMaterial)
  plane.rotation.x = Math.PI / 2
  plane.receiveShadow = true

  scene.add(plane)

  // Orbit controls
  const controls = new OrbitControls(orthoCamera, renderer.domElement)
  controls.minZoom = 0.5
  controls.maxZoom = 2
  controls.minPolarAngle = Math.PI / 16
  controls.maxPolarAngle = Math.PI * (7 / 16)
  controls.update()

  // Add cube
  const cubeMaterial = new Three.MeshLambertMaterial({
    color: '#5ac',
  })

  const cubeGeo = new Three.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)
  const cube = new Three.Mesh(cubeGeo, cubeMaterial)

  const smCubeGeo = new Three.BoxGeometry(
    BOX_SIZE * 0.8,
    BOX_SIZE * 0.9,
    BOX_SIZE * 0.8
  )

  const smCube = new Three.Mesh(smCubeGeo, cubeMaterial)

  smCube.position.y = BOX_SIZE * 0.1

  cube.updateMatrix()
  smCube.updateMatrix()

  const subtracted = CSG.subtract(cube, smCube)
  subtracted.position.y = 0.5 * BOX_SIZE

  scene.add(subtracted)
  //scene.add(cube)
  //scene.add(smCube)

  let active = true

  const loop = () => {
    // Re-render
    renderer.render(scene, orthoCamera)

    if (active) {
      requestAnimationFrame(loop)
    }
  }

  window.addEventListener('blur', () => {
    active = false
  })

  window.addEventListener('focus', () => {
    active = true
    loop()
  })

  loop()
}

PhysicsLoader('/static/js', () => setup())
