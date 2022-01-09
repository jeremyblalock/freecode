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

describe('lawOfCosines', () => {
  test('equilateral', () => {
    expect(lawOfCosines(1, 1, 1).toFixed(2)).toEqual('60.00')
  })

  test('straight', () => {
    expect(lawOfCosines(2, 1, 1).toFixed(2)).toEqual('0.00')
  })
})

describe('getRotations', () => {
  test('vertical', () => {
    const position = getPosition(DEFAULT_POSITION)
    const rotations = getRotations(position)
    expect(rotations).toEqual(DEFAULT_POSITION)
  })

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
