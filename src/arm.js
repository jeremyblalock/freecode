import * as Three from 'three'

// Collision flags
const KINEMATIC = 2

const DEGREES = Math.PI / 180

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
    cube.position.y = 0.5 * size
    cube.castShadow = true

    const cube2 = new Three.Mesh(geom2, material)
    cube2.position.y = 0.55 * size
    cube2.castShadow = true

    const cube2Wrapper = new Three.Group()
    cube2Wrapper.add(cube2)
    cube2Wrapper.position.y = 1.05 * size

    const group = new Three.Group()
    group.add(cube)
    group.add(cube2Wrapper)

    group.position.y = 0.05 * size

    this._physicsShapes = {
      cube,
      cube2,
    }

    this._hierarchicalShapes = {
      group,
      cube2: cube2Wrapper,
    }

    this._group = group
  }

  addToScene(scene, physics) {
    scene.add(this._group)
    this._scene = scene
    this._physics = physics

    for (const item of Object.values(this._physicsShapes)) {
      physics.add.existing(item)
      item.body.setCollisionFlags(KINEMATIC)
    }
  }

  setPosition(position) {
    this._position = position
    const { cube2, group } = this._hierarchicalShapes
    const { elbowRotation, shoulderRotation, baseRotation } = position
    const normalizedElbow = Math.min(130, Math.max(0, elbowRotation))
    const normalizedShoulder = Math.min(80, Math.max(0, shoulderRotation))

    cube2.rotation.set(0, 0, normalizedElbow * DEGREES)
    group.rotation.set(0, baseRotation * DEGREES, normalizedShoulder * DEGREES)

    this._physicsShapes.cube2.body.needUpdate = true
    this._physicsShapes.cube.body.needUpdate = true
  }

  loop(delta) {
    // Do nothing
  }
}
