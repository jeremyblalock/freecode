import { formValueSelector } from 'redux-form'

export const CONTROLS_FORM = 'controls'

export const getControlValues = state => {
  const selector = formValueSelector(CONTROLS_FORM)
  const result = selector(state, 'controls')

  return result || {}
}
