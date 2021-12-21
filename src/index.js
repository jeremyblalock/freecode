import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsLoader } from 'enable3d'
import { AmmoPhysics } from '@enable3d/ammo-physics'
import './styles.css'

const BOX_SIZE = 1

const getCameraFactor = () => (5 * BOX_SIZE) / window.innerHeight

const setup = () => {
  const scene = new Three.Scene()

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

  // Setup Geometry
  const geometry = new Three.BoxGeometry(BOX_SIZE, BOX_SIZE, BOX_SIZE)

  const material = new Three.MeshLambertMaterial({
    color: '#fff',
    side: Three.DoubleSide,
  })

  const cube = new Three.Mesh(geometry, material)
  cube.castShadow = true
  cube.rotation.y = Math.PI / 4
  cube.position.y = 2 * BOX_SIZE

  scene.add(cube)

  // Add Line
  const lineMaterial = new Three.LineBasicMaterial({ color: '#fff' })

  const points = [
    new Three.Vector3(-2 * BOX_SIZE, 0, 0),
    new Three.Vector3(0, 2 * BOX_SIZE, 0),
    new Three.Vector3(2 * BOX_SIZE, 0, 0),
  ]

  const lineGeo = new Three.BufferGeometry().setFromPoints(points)

  const line = new Three.Line(lineGeo, lineMaterial)
  line.position.y = 1.5 * BOX_SIZE
  scene.add(line)

  // Add light
  const light = new Three.PointLight('#7df', 1, 100000)
  scene.add(light)

  light.position.set(10 * BOX_SIZE, 20 * BOX_SIZE, 30 * BOX_SIZE)
  light.castShadow = true

  // Light Shadow
  light.shadow.mapSize.width = 10000
  light.shadow.mapSize.height = 10000

  const ambientLight = new Three.AmbientLight('#865')
  scene.add(ambientLight)

  // Set camera position
  camera.position.z = 5 * BOX_SIZE
  orthoCamera.position.z = 10 * BOX_SIZE
  orthoCamera.position.y = (10 * BOX_SIZE) / Math.sqrt(3)

  const physics = new AmmoPhysics(scene)
  physics.debug.enable(true)

  const ground = physics.add.ground({
    width: 10 * BOX_SIZE,
    height: 10 * BOX_SIZE,
    depth: 0.1 * BOX_SIZE,
  })

  ground.body.setCollisionFlags(1)

  //const planeGeo = new Three.PlaneGeometry(100 * BOX_SIZE, 100 * BOX_SIZE)

  //const planeMaterial = new Three.MeshStandardMaterial({
  //  color: '#ccc',
  //  side: Three.DoubleSide,
  //})

  //const plane = new Three.Mesh(planeGeo, planeMaterial)
  //plane.receiveShadow = true
  //plane.rotation.x = Math.PI / 2

  //scene.add(plane)
  //physics.add.existing(plane)
  //plane.body.setCollisionFlags(2)

  physics.add.existing(cube)
  cube.body.setCollisionFlags(0)
  cube.body.bounciness = 0

  const controls = new OrbitControls(orthoCamera, renderer.domElement)
  controls.update()

  let rotation = 0
  const clock = new Three.Clock()

  const loop = () => {
    // Animate
    rotation += 0.01
    cube.rotation.y = rotation
    cube.body.needUpdate = true

    // Update physics
    physics.update(clock.getDelta() * 1000)
    physics.updateDebugger()

    // Re-render
    renderer.render(scene, orthoCamera)
    requestAnimationFrame(loop)
  }

  loop()
}

PhysicsLoader('/static/js', () => setup())
