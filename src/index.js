import * as Three from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { PhysicsLoader } from 'enable3d'
import { AmmoPhysics } from '@enable3d/ammo-physics'
import './styles.css'

const setup = () => {
  const scene = new Three.Scene()

  const camera = new Three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  const orthoCamera = new Three.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    -10000,
    10000
  )

  // orthoCamera.matrixAutoUpdate = false

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

    // Update orthographic camera
    orthoCamera.left = -window.innerWidth
    orthoCamera.right = window.innerWidth
    orthoCamera.top = window.innerHeight
    orthoCamera.bottom = -window.innerHeight
    orthoCamera.updateProjectionMatrix()
  }

  window.addEventListener('resize', setSize)

  setSize()

  const el = document.getElementById('root')
  el.appendChild(renderer.domElement)

  // Setup Geometry
  const geometry = new Three.BoxGeometry(100, 100, 100)

  const material = new Three.MeshLambertMaterial({
    color: '#fff',
    side: Three.DoubleSide,
  })

  const cube = new Three.Mesh(geometry, material)
  cube.castShadow = true
  cube.rotation.y = Math.PI / 4
  cube.position.y = 150

  scene.add(cube)

  // Add Line
  const lineMaterial = new Three.LineBasicMaterial({ color: '#fff' })

  const points = [
    new Three.Vector3(-200, 0, 0),
    new Three.Vector3(0, 200, 0),
    new Three.Vector3(200, 0, 0),
  ]

  const lineGeo = new Three.BufferGeometry().setFromPoints(points)

  const line = new Three.Line(lineGeo, lineMaterial)
  line.position.y = 150
  scene.add(line)

  // Add plane
  const planeGeo = new Three.PlaneGeometry(10000, 10000)

  const planeMaterial = new Three.MeshLambertMaterial({
    color: '#ccc',
    side: Three.DoubleSide,
  })

  const plane = new Three.Mesh(planeGeo, planeMaterial)
  plane.rotation.x = Math.PI / 2
  plane.receiveShadow = true

  scene.add(plane)

  // Add light
  const light = new Three.PointLight('#7df', 1, 100000)
  scene.add(light)

  light.position.set(200, 500, 600)
  light.castShadow = true

  // Light Shadow
  light.shadow.mapSize.width = 512
  light.shadow.mapSize.height = 512

  const ambientLight = new Three.AmbientLight('#865')
  scene.add(ambientLight)

  // Set camera position
  camera.position.z = 500
  orthoCamera.position.z = 500
  orthoCamera.position.y = window.innerHeight / 2
  orthoCamera.rotation.x = -Math.PI / 6

  // const baseRotation = new Three.Matrix4().makeRotationX(-Math.PI / 6)

  // const baseMatrix = baseRotation.multiply(
  //   new Three.Matrix4().makeTranslation(0, 50, 300)
  // )

  const physics = new AmmoPhysics(scene)
  physics.debug.enable(true)
  physics.add.ground({ width: 1000, height: 1000 })

  physics.add.existing(cube)
  cube.body.setCollisionFlags(0)
  cube.body.bounciness = 0.7

  const controls = new OrbitControls(orthoCamera, renderer.domElement)
  controls.update()

  let rotation = 0
  const clock = new Three.Clock()

  const loop = () => {
    // Animate
    rotation += 0.01
    cube.rotation.y = rotation
    cube.body.needUpdate = true

    // const rotationMatrix = new Three.Matrix4().makeRotationY(rotation)
    // const matrix = rotationMatrix.multiply(baseMatrix)

    // orthoCamera.matrixWorld = matrix
    // camera.updateMatrixWorld(true)

    // Update physics
    physics.update(clock.getDelta() * 1000)
    physics.updateDebugger()

    // Re-render
    renderer.render(scene, orthoCamera)
    requestAnimationFrame(loop)
  }

  loop()
}

PhysicsLoader('/static/js', (...args) => {
  console.log('GOT ARGS:', args)
  setup()
})
