import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsLoader } from 'enable3d'
import { AmmoPhysics } from '@enable3d/ammo-physics'
import Arm from './arm'
import store from './redux-store'
import { initializeReact } from './react'
import { getControlValues } from './utils/redux'
import { DEGREES } from './utils/geometry'
import { addBalls } from './balls'
import { loadModels } from './model-loader'
//import './prism'

import './styles.css'

const BOX_SIZE = 1

const getCameraFactor = () => (5 * BOX_SIZE) / window.innerHeight

const setup = async () => {
  const models = await loadModels()
  const scene = new Three.Scene()
  scene.background = new Three.Color('#a99')

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

  // Setup react
  const reactRoot = document.createElement('div')
  el.appendChild(reactRoot)
  initializeReact(reactRoot)

  // Add light
  const light = new Three.DirectionalLight('#fff', 0.5)
  scene.add(light)

  light.position.set(10 * BOX_SIZE, 20 * BOX_SIZE, 30 * BOX_SIZE)
  light.castShadow = true

  // Light Shadow
  light.shadow.mapSize.width = 10000
  light.shadow.mapSize.height = 10000

  const ambientLight = new Three.AmbientLight('#fff', 1)
  scene.add(ambientLight)

  // Set camera position
  camera.position.z = 5 * BOX_SIZE
  orthoCamera.position.z = 10 * BOX_SIZE
  orthoCamera.position.y = (10 * BOX_SIZE) / Math.sqrt(3)

  const physics = new AmmoPhysics(scene)
  physics.debug.enable(true)

  // Setup Geometry
  const arm = new Arm(BOX_SIZE, models)
  arm.addToScene(scene, physics)

  const ground = physics.add.ground({
    width: 10 * BOX_SIZE,
    height: 10 * BOX_SIZE,
    depth: 0.1 * BOX_SIZE,
  })

  ground.body.setCollisionFlags(1)
  ground.visible = false

  const edges = new Three.Group()

  const edge = new Three.Mesh(
    new Three.BoxGeometry(10 * BOX_SIZE, 10 * BOX_SIZE, 1 * BOX_SIZE),
    new Three.MeshLambertMaterial({ color: '#aaa', side: Three.DoubleSide })
  )

  edge.rotation.z = 90 * DEGREES
  edge.position.z = -5 * BOX_SIZE

  edge.updateMatrix()

  const backWall = new Three.Group()
  backWall.add(edge)

  const leftWall = backWall.clone()
  leftWall.rotation.y = 90 * DEGREES

  const frontWall = backWall.clone()
  frontWall.rotation.y = 180 * DEGREES

  const rightWall = backWall.clone()
  rightWall.rotation.y = -90 * DEGREES

  edges.add(backWall)
  edges.add(leftWall)
  edges.add(frontWall)
  edges.add(rightWall)

  //scene.add(edges)

  physics.add.existing(leftWall.children[0], { collisionFlags: 1 })
  physics.add.existing(rightWall.children[0], { collisionFlags: 1 })
  physics.add.existing(backWall.children[0], { collisionFlags: 1 })
  physics.add.existing(frontWall.children[0], { collisionFlags: 1 })

  // Add plane (for shadows)
  const planeGeo = new Three.PlaneGeometry(100 * BOX_SIZE, 100 * BOX_SIZE)

  const planeMaterial = new Three.ShadowMaterial({
    side: Three.DoubleSide,
    opacity: 0.1,
  })

  const plane = new Three.Mesh(planeGeo, planeMaterial)
  plane.rotation.x = Math.PI / 2
  plane.receiveShadow = true
  plane.position.y = 0.05 * BOX_SIZE

  scene.add(plane)

  // Add random balls
  addBalls({
    scene,
    physics,
    count: 4,
    size: BOX_SIZE / 4,
    minRadius: BOX_SIZE,
    maxRadius: 3 * BOX_SIZE,
  })

  // Orbit controls
  const controls = new OrbitControls(orthoCamera, renderer.domElement)
  controls.minZoom = 0.5
  controls.maxZoom = 2
  controls.minPolarAngle = Math.PI / 16
  controls.maxPolarAngle = Math.PI * (7 / 16)
  controls.update()

  const clock = new Three.Clock()

  let active = true

  const loop = () => {
    const delta = clock.getDelta()

    // Animate
    arm.setPosition(getControlValues(store.getState()))
    arm.loop(delta)

    // Update physics
    physics.update(delta * 1000)
    physics.updateDebugger()

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
