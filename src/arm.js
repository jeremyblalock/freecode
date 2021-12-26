import * as Three from 'three'

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
    cube2.position.x = (-0.5 * size) / Math.sqrt(2)
    cube2.rotation.z = Math.PI * 0.25
    cube2.castShadow = true

    const group = new Three.Group()
    group.add(cube)
    group.add(cube2)

    group.position.y = 2 * size

    this._shape = group
  }

  addToScene(scene, physics) {
    scene.add(this._shape)
    physics.add.existing(this._shape)
    this._shape.body.setCollisionFlags(0)
    this._shape.body.bounciness = 0

    this._scene = scene
    this._physics = physics
  }

  loop(delta) {
    this._shape.body.needUpdate = true
  }
}
