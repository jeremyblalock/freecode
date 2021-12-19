import * as Three from 'three'
import './styles.css'

const scene = new Three.Scene()

const camera = new Three.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)

const renderer = new Three.WebGLRenderer()

const setSize = () => {
  const width = window.innerWidth
  const height = window.innerHeight

  renderer.setSize(width, height)

  // camera.left = width / 2
  // camera.right = width / 2
  // camera.top = height / 2
  // camera.bottom = -height / 2
}

window.addEventListener('resize', setSize)

setSize()

const el = document.getElementById('root')
el.appendChild(renderer.domElement)

// Setup Geometry
const geometry = new Three.BoxGeometry(1, 1, 1)

const material = new Three.MeshLambertMaterial({
  color: '#fff',
  side: Three.DoubleSide,
})

const cube = new Three.Mesh(geometry, material)
scene.add(cube)

// Add light
const light = new Three.PointLight(0xffffff, 1, 100000)
light.position.set(50, 50, 50)
scene.add(light)

const ambientLight = new Three.AmbientLight(0x404040)
scene.add(ambientLight)

// Set camera position
camera.position.z = 5

let rotation = 0

const loop = () => {
  // Animate
  rotation += 1
  //cube.rotation.x = 0.01 * rotation
  cube.rotation.y = 0.01 * rotation

  // Ren-render
  renderer.render(scene, camera)
  requestAnimationFrame(loop)
}

loop()
