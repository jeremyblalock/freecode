export const DEGREES = Math.PI / 180

export const toCart = (angle, offset) => {
  return [Math.cos(angle) * offset, Math.sin(angle) * offset]
}

export const toRad = (x, y) => {
  const angle = Math.atan(y / x) + (x < 0 ? Math.PI : 0)
  const offset = Math.sqrt(x ** 2, y ** 2)

  return [angle, offset]
}
