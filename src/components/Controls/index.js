import React from 'react'
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

const Cartesian = function Cartesian() {
  const dispatch = useDispatch()
  const selector = formValueSelector(CONTROLS_FORM)
  const angular = useSelector(state => selector(state, 'controls'))
  const cartesian = getPosition(angular)

  const handleChange = key => value => {
    const newCoords = { ...cartesian, [key]: value }
    const controls = getRotations(newCoords)

    console.log('CONTROLS:', controls)

    dispatch(change(CONTROLS_FORM, 'controls', controls))
  }

  return (
    <div>
      <h2>Cartesian</h2>
      <Slider
        label="X"
        input={{ onChange: handleChange('x'), value: cartesian.x }}
        min={-4}
        max={4}
        step={0.01}
      />
      <Slider
        label="Y"
        input={{ onChange: handleChange('y'), value: cartesian.y }}
        min={0}
        max={3.5}
        step={0.01}
      />
      <Slider
        label="Z"
        input={{ onChange: handleChange('z'), value: cartesian.z }}
        min={-4}
        max={4}
        step={0.01}
      />
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
        min={0}
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
