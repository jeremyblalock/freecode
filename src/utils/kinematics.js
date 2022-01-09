import { DEGREES, toCart } from './geometry'

export const DEFAULT_POSITION = {
  baseRotation: 0,
  shoulderRotation: 0,
  elbowRotation: 0,
}

// Collision flags
export const KINEMATIC = 2

export const BASE_RADIUS = 0.7
export const BASE_HEIGHT = 0.3

export const FIRST_SEGMENT_LENGTH = 1.5
export const SECOND_SEGMENT_LENGTH = 1.5

export const JOINT_SIZE = 0.5

export const SHOULDER_HEIGHT = BASE_HEIGHT * 2 + JOINT_SIZE / 2

export const BALL_RADIUS = 0.4

// Conversions

export const getPosition = rotation => {
  let { baseRotation, shoulderRotation, elbowRotation } = rotation

  baseRotation = +baseRotation
  shoulderRotation = +shoulderRotation
  elbowRotation = +elbowRotation

  const y =
    SHOULDER_HEIGHT -
    BALL_RADIUS +
    Math.cos(shoulderRotation * DEGREES) * FIRST_SEGMENT_LENGTH +
    Math.cos((shoulderRotation + elbowRotation) * DEGREES) *
      SECOND_SEGMENT_LENGTH

  const r =
    Math.sin(shoulderRotation * DEGREES) * FIRST_SEGMENT_LENGTH +
    Math.sin((shoulderRotation + elbowRotation) * DEGREES) *
      SECOND_SEGMENT_LENGTH

  const [x, z] = toCart(baseRotation, r)

  return { x, y, z }
}

// Get angle C opposite side c
export const lawOfCosines = (a, b, c) => {
  return Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b)) / DEGREES
}

export const getRotations = position => {
  let { x, y, z } = position
  x = +x
  y = +y - SHOULDER_HEIGHT + BALL_RADIUS
  z = +z

  const baseRotation = (Math.atan2(z, x) / DEGREES + 360) % 360
  const distance = Math.sqrt(x ** 2 + y ** 2 + z ** 2)

  // Law of cosines
  const elbowRotation =
    180 - lawOfCosines(FIRST_SEGMENT_LENGTH, SECOND_SEGMENT_LENGTH, distance)

  const shoulderPointAngle = lawOfCosines(
    FIRST_SEGMENT_LENGTH,
    distance,
    SECOND_SEGMENT_LENGTH
  )

  const pointAngle = 90 - Math.atan2(y, Math.sqrt(x ** 2, z ** 2)) / DEGREES

  const shoulderRotation = pointAngle - shoulderPointAngle

  return {
    baseRotation,
    elbowRotation,
    shoulderRotation,
  }
}
