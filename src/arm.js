import * as Three from 'three'

export default class Arm {
  constructor(size) {
    this._size = size

    this.setupShapes()
  }

  setupShapes = () => {
    const size = this._size

    const geometry = new Three.BoxGeometry(size, size, size)

    const material = new Three.MeshLambertMaterial({
      color: '#aaa',
      side: Three.DoubleSide,
    })

    const cube = new Three.Mesh(geometry, material)
    cube.castShadow = true
    cube.rotation.y = Math.PI / 4
    cube.position.y = 2 * size

    this._shape = cube
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
