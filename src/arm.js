import * as Three from 'three'
import flatten from 'lodash/flatten'

import { DEGREES } from './utils/geometry'

import {
  KINEMATIC,
  BASE_RADIUS,
  BASE_HEIGHT,
  FIRST_SEGMENT_LENGTH,
  SECOND_SEGMENT_LENGTH,
  JOINT_SIZE,
  SHOULDER_HEIGHT,
} from './utils/kinematics'

export default class Arm {
  constructor(size, models) {
    this._size = size
    this._models = models
    this.setupShapes()
  }

  setupHand(material) {
    //const finger1 =
    const size = this._size
    const scale = size * 0.4

    const { hand, claw } = this._models
    const mesh = hand.scene.children[0]
    mesh.material = material
    const innerGroup = new Three.Group()
    innerGroup.add(mesh)
    innerGroup.scale.set(scale, scale, scale)
    innerGroup.position.y = 0.05 * size
    innerGroup.rotation.z = -90 * DEGREES
    mesh.castShadow = true

    // Claw
    const clawMesh = claw.scene.children[0]
    clawMesh.material = material
    clawMesh.castShadow = true
    const clawGroup = new Three.Group()
    clawGroup.add(clawMesh)
    clawGroup.rotation.z = -90 * DEGREES
    clawGroup.scale.set(scale, scale, scale)
    clawGroup.position.y = 0.35 * size

    const secondClaw = clawGroup.clone()
    secondClaw.rotation.y = 180 * DEGREES
    const secondClawGroup = new Three.Group()
    secondClawGroup.add(secondClaw)

    const group = new Three.Group()
    group.add(innerGroup)
    group.add(clawGroup)
    group.add(secondClawGroup)

    return {
      hand: group,
      finger1: clawGroup,
      finger2: secondClawGroup,
      finger1Mesh: clawMesh,
      finger2Mesh: secondClaw,
      handMesh: innerGroup,
    }
  }

  setupShapes = () => {
    const size = this._size

    const material = new Three.MeshLambertMaterial({
      color: '#aaa',
      side: Three.DoubleSide,
    })

    const shoulder = this.createJoint(size, material)
    shoulder.position.y = (SHOULDER_HEIGHT - BASE_HEIGHT / 2) * size

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
    base.add(shoulder)
    base.add(support)
    base.position.y = (BASE_HEIGHT / 2) * size

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
    cube2.position.y = 0.5 * SECOND_SEGMENT_LENGTH * size
    cube2.castShadow = true

    const { hand, finger1Mesh, finger2Mesh, handMesh } =
      this.setupHand(material)

    hand.castShadow = true
    hand.position.y = SECOND_SEGMENT_LENGTH * size

    const elbow = this.createJoint(size, material)

    const cube2Inner = new Three.Group()
    cube2Inner.add(cube2)
    cube2Inner.add(elbow)

    const cube2Wrapper = new Three.Group()
    cube2Wrapper.add(cube2Inner)
    cube2Wrapper.add(hand)
    cube2Wrapper.position.y = FIRST_SEGMENT_LENGTH * size

    const group = new Three.Group()
    group.add(cube)
    group.add(cube2Wrapper)

    group.position.y = SHOULDER_HEIGHT * size

    const wrapper = new Three.Group()
    wrapper.position.y = 0.05 * size
    wrapper.add(base)
    wrapper.add(group)

    this._physicsShapes = {
      base,
      cube,
      cube2: cube2Inner,
      finger1: finger1Mesh,
      finger2: finger2Mesh,
      handMesh,
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

    for (const key of Object.keys(this._physicsShapes)) {
      const item = this._physicsShapes[key]
      const options = { collisionFlags: KINEMATIC }

      if (key.match(/^(finger|hand)/)) {
        options.shape = 'hacd'
      }

      physics.add.existing(item, options)
    }
  }

  setPosition(position) {
    this._position = position
    const { cube2, group, wrapper } = this._hierarchicalShapes
    const { elbowRotation, shoulderRotation, baseRotation } = position
    const normalizedElbow = Math.min(130, Math.max(0, elbowRotation))
    const normalizedShoulder = Math.min(95, Math.max(-50, shoulderRotation))

    cube2.rotation.set(0, 0, normalizedElbow * DEGREES)
    wrapper.rotation.set(0, baseRotation * DEGREES, 0)
    group.rotation.set(0, 0, normalizedShoulder * DEGREES)

    for (const shape of Object.values(this._physicsShapes)) {
      shape.body.needUpdate = true
    }
  }

  loop(delta) {
    // Do nothing
  }
}
