import * as Three from 'three'

// Collision flags
const KINEMATIC = 2

export default class Arm {
  constructor(size) {
    this._size = size
    this.setupShapes()
  }

  setupShapes = () => {
    const size = this._size

    const material = new Three.MeshLambertMaterial({
      color: '#aaa',
      side: Three.DoubleSide,
    })

    const geom = new Three.BoxGeometry(size * 0.25, size, size * 0.25)
    const geom2 = new Three.BoxGeometry(size * 0.25, size, size * 0.25)

    const cube = new Three.Mesh(geom, material)
    cube.castShadow = true

    const cube2 = new Three.Mesh(geom2, material)
    cube2.position.y = 1.1 * size
    cube2.castShadow = true

    const group = new Three.Group()
    group.add(cube)
    group.add(cube2)

    group.position.y = (0.5 + 0.05) * size

    this._shapes = {
      cube,
      cube2,
      group,
    }

    this._shape = group

    window.shapes = this._shapes
  }

  addToScene(scene, physics) {
    scene.add(this._shape)
    physics.add.existing(this._shape)
    this._shape.body.setCollisionFlags(KINEMATIC)
    this._shape.body.bounciness = 0

    this._scene = scene
    this._physics = physics
  }

  setPosition(position) {
    this._position = position
    const { cube2 } = this._shapes
    const { elbowRotation } = position
    const normalizedElbow = Math.min(130, Math.max(0, elbowRotation))

    cube2.rotation.set(0, 0, normalizedElbow * (Math.PI / 180))
  }

  loop(delta) {
    this._shape.body.needUpdate = true
  }
}
