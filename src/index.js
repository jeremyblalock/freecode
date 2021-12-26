import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsLoader } from 'enable3d'
import { AmmoPhysics } from '@enable3d/ammo-physics'
import Arm from './arm'
import './styles.css'

const BOX_SIZE = 1

const getCameraFactor = () => (5 * BOX_SIZE) / window.innerHeight

const setup = () => {
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
  const arm = new Arm(BOX_SIZE)
  arm.addToScene(scene, physics)

  const ground = physics.add.ground({
    width: 10 * BOX_SIZE,
    height: 10 * BOX_SIZE,
    depth: 0.1 * BOX_SIZE,
  })

  ground.body.setCollisionFlags(1)
  ground.visible = false

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

  // Orbit controls
  const controls = new OrbitControls(orthoCamera, renderer.domElement)
  controls.minZoom = 0.5
  controls.maxZoom = 2
  controls.minPolarAngle = Math.PI / 16
  controls.maxPolarAngle = Math.PI * (7 / 16)
  controls.update()

  const clock = new Three.Clock()

  const loop = () => {
    const delta = clock.getDelta()

    // Animate
    arm.loop(delta)

    // Update physics
    physics.update(delta * 1000)
    physics.updateDebugger()

    // Re-render
    renderer.render(scene, orthoCamera)
    requestAnimationFrame(loop)
  }

  loop()
}

PhysicsLoader('/static/js', () => setup())
