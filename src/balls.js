import * as Three from 'three'
import { toCart } from './utils/geometry'

const COLORS = [
  'Aquamarine',
  'BlueViolet',
  'Crimson',
  'Blue',
  'CadetBlue',
  'DarkOrange',
]

export const addBalls = ({
  scene,
  physics,
  count,
  size,
  minRadius,
  maxRadius,
}) => {
  for (let i = 0; i < count; i += 1) {
    const material = new Three.MeshLambertMaterial({
      color: COLORS[i % COLORS.length],
      side: Three.DoubleSide,
    })

    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * (maxRadius - minRadius) + minRadius
    const [x, z] = toCart(angle, distance)

    const geom = new Three.SphereGeometry(size, 16, 8)
    const mesh = new Three.Mesh(geom, material)
    mesh.position.x = x
    mesh.position.z = z
    mesh.position.y = 10
    mesh.castShadow = true

    physics.add.existing(mesh)
    scene.add(mesh)
  }
}
