import React, { useCallback, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { reduxForm, Field, formValueSelector, change } from 'redux-form'

import {
  DEFAULT_POSITION,
  getPosition,
  getRotations,
} from '../../utils/kinematics'

import { CONTROLS_FORM } from '../../utils/redux'
import Slider from '../Forms/Slider'
import styles from './Controls.module.css'

const normalize = (value, prevValue, allValues) => {
  const { y } = getPosition(allValues.controls)

  if (y < 0) {
    return prevValue
  }

  return value
}

const CartItem = function CartItem({ coord, value, onChange }) {
  const handleChange = value => {
    onChange(coord, value)
  }

  return (
    <Slider
      label={coord.toUpperCase()}
      input={{ value, onChange: handleChange }}
      min={coord === 'y' ? 0 : -3.45}
      max={3.45}
      step={0.01}
    />
  )
}

const Cartesian = function Cartesian() {
  const dispatch = useDispatch()
  const selector = formValueSelector(CONTROLS_FORM)
  const angular = useSelector(state => selector(state, 'controls'))
  const cartesian = getPosition(angular)

  const handleChange = (key, value) => {
    const newCoords = { ...cartesian, [key]: value }
    const controls = getRotations(newCoords)

    for (const value of Object.values(controls)) {
      if (Number.isNaN(value)) {
        console.log('>>>>>', controls, cartesian)

        return
      }
    }

    dispatch(change(CONTROLS_FORM, 'controls', controls))
  }

  return (
    <div>
      <h2>Cartesian</h2>
      <CartItem coord="x" onChange={handleChange} value={cartesian.x} />
      <CartItem coord="y" onChange={handleChange} value={cartesian.y} />
      <CartItem coord="z" onChange={handleChange} value={cartesian.z} />
    </div>
  )
}

const ControlsForm = function ControlsForm() {
  return (
    <div>
      <h2>Direct</h2>
      <Field
        name="controls.baseRotation"
        component={Slider}
        min={0}
        max={360}
        label="A"
        normalize={normalize}
      />
      <Field
        name="controls.shoulderRotation"
        component={Slider}
        min={-50}
        max={95}
        label="B"
        normalize={normalize}
      />
      <Field
        name="controls.elbowRotation"
        component={Slider}
        min={0}
        max={120}
        label="C"
        normalize={normalize}
      />
      <hr />
      <Cartesian />
    </div>
  )
}

const Form = reduxForm({
  form: CONTROLS_FORM,
})(ControlsForm)

export default function Controls() {
  const initialValues = {
    controls: DEFAULT_POSITION,
  }

  return (
    <div className={styles.controls}>
      <Form initialValues={initialValues} />
    </div>
  )
}
