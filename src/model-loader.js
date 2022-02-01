import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export const loadModels = async () => {
  const loader = new GLTFLoader()

  const promises = [
    loader.loadAsync('/static/models/hand.glb'),
    loader.loadAsync('/static/models/claw.glb'),
  ]

  const [hand, claw] = await Promise.all(promises)

  return {
    hand,
    claw,
  }
}
