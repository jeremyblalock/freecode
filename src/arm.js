import * as Three from 'three'

// Collision flags
const KINEMATIC = 2

const DEGREES = Math.PI / 180

const BASE_RADIUS = 0.7
const BASE_HEIGHT = 0.3

const FIRST_SEGMENT_LENGTH = 1.5
const SECOND_SEGMENT_LENGTH = 1.5

const JOINT_SIZE = 0.5

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

    const baseJoint = this.createJoint(size, material)
    baseJoint.position.y = (BASE_HEIGHT * 1.5 + JOINT_SIZE / 2) * size

    const cylinderGeom = new Three.CylinderGeometry(
      BASE_RADIUS * size,
      BASE_RADIUS * size,
      BASE_HEIGHT * size,
      16
    )

    const cylinder = new Three.Mesh(cylinderGeom, material)
    cylinder.castShadow = true

    const supportGeom = new Three.BoxGeometry(
      size * 0.25,
      (BASE_HEIGHT + JOINT_SIZE / 2) * size,
      size * 0.25
    )

    const support = new Three.Mesh(supportGeom, material)
    support.position.y = BASE_HEIGHT * size

    const base = new Three.Group()
    base.add(cylinder)
    base.add(baseJoint)
    base.add(support)
    base.position.y = (0.05 + BASE_HEIGHT / 2) * size

    const geom = new Three.BoxGeometry(
      size * 0.25,
      FIRST_SEGMENT_LENGTH,
      size * 0.25
    )

    const geom2 = new Three.BoxGeometry(
      size * 0.25,
      SECOND_SEGMENT_LENGTH,
      size * 0.25
    )

    const cube = new Three.Mesh(geom, material)
    cube.position.y = 0.5 * FIRST_SEGMENT_LENGTH * size
    cube.castShadow = true

    const cube2 = new Three.Mesh(geom2, material)
    cube2.position.y = (0.05 + 0.5 * SECOND_SEGMENT_LENGTH) * size
    cube2.castShadow = true

    const ballGeom = new Three.SphereGeometry(0.4 * size, 16, 8)
    const ball = new Three.Mesh(ballGeom, material)
    ball.position.y = (0.05 + SECOND_SEGMENT_LENGTH) * size
    ball.castShadow = true

    const elbow = this.createJoint(size, material)

    const cube2Wrapper = new Three.Group()
    cube2Wrapper.add(cube2)
    cube2Wrapper.add(elbow)
    cube2Wrapper.add(ball)
    cube2Wrapper.position.y = (0.05 + FIRST_SEGMENT_LENGTH) * size

    const group = new Three.Group()
    group.add(cube)
    group.add(cube2Wrapper)

    group.position.y = (0.05 + BASE_HEIGHT * 2 + JOINT_SIZE / 2) * size

    const wrapper = new Three.Group()
    wrapper.add(base)
    wrapper.add(group)

    this._physicsShapes = {
      base,
      cube,
      cube2: cube2Wrapper,
    }

    this._hierarchicalShapes = {
      base,
      group,
      wrapper,
      cube2: cube2Wrapper,
    }

    this._wrapper = wrapper
  }

  createJoint = (size, material) => {
    const geom = new Three.CylinderGeometry(
      (JOINT_SIZE / 2) * size,
      (JOINT_SIZE / 2) * size,
      0.7 * JOINT_SIZE * size,
      16
    )

    const mesh = new Three.Mesh(geom, material)
    mesh.rotation.x = 90 * DEGREES
    mesh.castShadow = true

    return mesh
  }

  addToScene(scene, physics) {
    scene.add(this._wrapper)
    this._scene = scene
    this._physics = physics

    for (const item of Object.values(this._physicsShapes)) {
      physics.add.existing(item)
      item.body.setCollisionFlags(KINEMATIC)
    }
  }

  setPosition(position) {
    this._position = position
    const { cube2, group, wrapper } = this._hierarchicalShapes
    const { elbowRotation, shoulderRotation, baseRotation } = position
    const normalizedElbow = Math.min(130, Math.max(0, elbowRotation))
    const normalizedShoulder = Math.min(95, Math.max(0, shoulderRotation))

    cube2.rotation.set(0, 0, normalizedElbow * DEGREES)
    wrapper.rotation.set(0, baseRotation * DEGREES, 0)
    group.rotation.set(0, 0, normalizedShoulder * DEGREES)

    this._physicsShapes.cube2.body.needUpdate = true
    this._physicsShapes.cube.body.needUpdate = true
    this._physicsShapes.base.body.needUpdate = true
  }

  loop(delta) {
    // Do nothing
  }
}
