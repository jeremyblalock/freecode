import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { reduxForm, Field, formValueSelector, change } from 'redux-form'

import {
  DEFAULT_STATE,
  MIN_SHOULDER_ROTATION,
  MAX_SHOULDER_ROTATION,
  MIN_ELBOW_ROTATION,
  MAX_ELBOW_ROTATION,
  getPosition,
  getRotations,
  getPolar,
  getRotationsFromPolar,
  isValid,
} from '../../utils/kinematics'

import { CONTROLS_FORM } from '../../utils/redux'
import Slider from '../Forms/Slider'
import styles from './Controls.module.css'

const normalize = (value, prevValue, allValues) => {
  const { y } = getPosition(allValues.controls)

  if (y < 0 || !isValid(allValues)) {
    return prevValue
  }

  return value
}

const CartItem = function CartItem({
  coord,
  value,
  onChange,
  label,
  min = null,
  max = null,
  step = 0.01,
}) {
  const handleChange = value => {
    onChange(coord, value)
  }

  return (
    <Slider
      label={label || coord.toUpperCase()}
      input={{ value, onChange: handleChange }}
      min={min === null ? (coord === 'y' ? 0 : -3.45) : min}
      max={max === null ? 3.45 : max}
      step={step}
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

    if (!isValid(controls)) {
      return
    }

    for (const value of Object.values(controls)) {
      if (Number.isNaN(value)) {
        console.log('>>>>>', controls, cartesian)

        return
      }
    }

    dispatch(change(CONTROLS_FORM, 'controls', { ...angular, ...controls }))
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

const Polar = function Polar() {
  const dispatch = useDispatch()
  const selector = formValueSelector(CONTROLS_FORM)
  const angular = useSelector(state => selector(state, 'controls'))
  const polar = getPolar(angular)

  const handleChange = (key, value) => {
    const newPolar = { ...polar, [key]: value }
    const controls = getRotationsFromPolar(newPolar)

    if (!isValid(controls)) {
      return
    }

    for (const value of Object.values(controls)) {
      if (Number.isNaN(value)) {
        console.log('>>>>>', controls, polar)

        return
      }
    }

    dispatch(change(CONTROLS_FORM, 'controls', { ...angular, ...controls }))
  }

  return (
    <div>
      <h2>Polar</h2>
      <CartItem
        coord="theta"
        onChange={handleChange}
        value={polar.theta}
        label="ϴ"
        min={0}
        max={360}
        step={1}
      />
      <CartItem coord="r" onChange={handleChange} value={polar.r} />
      <CartItem coord="y" onChange={handleChange} value={polar.y} />
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
        min={MIN_SHOULDER_ROTATION}
        max={MAX_SHOULDER_ROTATION}
        label="B"
        normalize={normalize}
      />
      <Field
        name="controls.elbowRotation"
        component={Slider}
        min={MIN_ELBOW_ROTATION}
        max={MAX_ELBOW_ROTATION}
        label="C"
        normalize={normalize}
      />
      <Field
        name="controls.wristRotation"
        component={Slider}
        min={-80}
        max={90}
        label="D"
        normalize={normalize}
      />
      <Field
        name="controls.claw"
        component={Slider}
        min={0}
        max={100}
        label="E"
        normalize={normalize}
      />
      <hr />
      <Cartesian />
      <hr />
      <Polar />
    </div>
  )
}

const Form = reduxForm({
  form: CONTROLS_FORM,
})(ControlsForm)

export default function Controls() {
  const initialValues = {
    controls: DEFAULT_STATE,
  }

  return (
    <div className={styles.controls}>
      <Form initialValues={initialValues} />
    </div>
  )
}
