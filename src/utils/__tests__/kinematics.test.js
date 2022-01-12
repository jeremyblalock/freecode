import {
  getPosition,
  getRotations,
  lawOfCosines,
  SHOULDER_HEIGHT,
  BALL_RADIUS,
  DEFAULT_POSITION,
  FIRST_SEGMENT_LENGTH,
  SECOND_SEGMENT_LENGTH,
} from '../kinematics'

const OFFSET = SHOULDER_HEIGHT - BALL_RADIUS
const ARM_LENGTH = FIRST_SEGMENT_LENGTH + SECOND_SEGMENT_LENGTH

describe('lawOfCosines', () => {
  test('equilateral', () => {
    expect(lawOfCosines(1, 1, 1).toFixed(2)).toEqual('60.00')
  })

  test('straight', () => {
    expect(lawOfCosines(2, 1, 1).toFixed(2)).toEqual('0.00')
  })
})

describe('getPosition', () => {
  test('horizontal in -x direction', () => {
    const rotations = {
      ...DEFAULT_POSITION,
      shoulderRotation: 90,
      baseRotation: 180,
    }

    const { x, y, z } = getPosition(rotations)

    expect(x.toFixed(2)).toEqual((-ARM_LENGTH).toFixed(2))
    expect(y.toFixed(2)).toEqual(OFFSET.toFixed(2))
    expect(z.toFixed(2)).toEqual('0.00')
  })
})

describe('getRotations', () => {
  test('vertical', () => {
    const position = getPosition(DEFAULT_POSITION)
    const rotations = getRotations(position)
    expect(rotations).toEqual(DEFAULT_POSITION)
  })

  describe('horizontal', () => {
    test('horizontal', () => {
      const position = {
        x: FIRST_SEGMENT_LENGTH + SECOND_SEGMENT_LENGTH,
        y: OFFSET,
        z: 0,
      }

      expect(getRotations(position)).toEqual({
        shoulderRotation: 90,
        elbowRotation: 0,
        baseRotation: 0,
      })
    })

    test('horizontal z-direction', () => {
      const position = {
        x: 0,
        y: OFFSET,
        z: FIRST_SEGMENT_LENGTH + SECOND_SEGMENT_LENGTH,
      }

      expect(getRotations(position)).toEqual({
        shoulderRotation: 90,
        elbowRotation: 0,
        baseRotation: 90,
      })
    })

    test('horizontal negative', () => {
      const position = {
        x: -FIRST_SEGMENT_LENGTH - SECOND_SEGMENT_LENGTH,
        y: OFFSET,
        z: 0,
      }

      expect(getRotations(position)).toEqual({
        shoulderRotation: 90,
        elbowRotation: 0,
        baseRotation: 180,
      })
    })

    test('horizontal z-direction negative', () => {
      const position = {
        x: 0,
        y: OFFSET,
        z: -FIRST_SEGMENT_LENGTH - SECOND_SEGMENT_LENGTH,
      }

      expect(getRotations(position)).toEqual({
        shoulderRotation: 90,
        elbowRotation: 0,
        baseRotation: 270,
      })
    })
  })

  describe('elbow', () => {
    test('bending elbow in +z', () => {
      const position = {
        x: 0,
        y: OFFSET + FIRST_SEGMENT_LENGTH,
        z: SECOND_SEGMENT_LENGTH,
      }

      const result = getRotations(position)

      expect(+result.baseRotation.toFixed(2)).toEqual(90)
      expect(+result.elbowRotation.toFixed(2)).toEqual(90)
      expect(Math.abs(+result.shoulderRotation.toFixed(2))).toEqual(0)
    })
  })

  describe('touching ground', () => {
    test('x-direction', () => {
      const position = {
        x: FIRST_SEGMENT_LENGTH * 1.2,
        y: 0,
        z: 0,
      }

      const result = getRotations(position)

      expect(result.baseRotation).toBe(0)
      expect(result.elbowRotation > 20).toBe(true)
      expect(result.shoulderRotation > 20).toBe(true)
    })
  })
})
