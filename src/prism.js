import { ExtendedMesh, PhysicsLoader, Project, Scene3D } from 'enable3d'
import * as Three from 'three'
import * as _ from 'lodash'

class MainScene extends Scene3D {
  async create() {
    this.warpSpeed()
    this.physics.debug?.enable()

    const geom = new Three.BufferGeometry()

    const rawVertices = new Float32Array(
      _.flatten([
        [-1.0, 1.0, -1.0],
        [-1.0, -1.0, 1.0],
        [1.0, 1.0, 1.0],
        //
        [1.0, 1.0, 1.0],
        [1.0, -1.0, -1.0],
        [-1.0, 1.0, -1.0],
        //
        [-1.0, -1.0, 1.0],
        [1.0, -1.0, -1.0],
        [1.0, 1.0, 1.0],
        //
        [-1.0, 1.0, -1.0],
        [1.0, -1.0, -1.0],
        [-1.0, -1.0, 1.0],
      ])
    )

    geom.setAttribute('position', new Three.BufferAttribute(rawVertices, 3))
    geom.computeVertexNormals()

    const material = new Three.MeshBasicMaterial({ color: 0x00ff00 })
    const mesh = new ExtendedMesh(geom, material)
    mesh.position.y = 2

    this.add.existing(mesh)
    this.physics.add.existing(mesh, { shape: 'hacd', collisionFlags: 2 })
  }
}

PhysicsLoader('/static/js', () => new Project({ scenes: [MainScene] }))
