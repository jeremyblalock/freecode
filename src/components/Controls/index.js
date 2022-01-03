import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { DEFAULT_POSITION } from '../../utils/kinematics'
import { CONTROLS_FORM } from '../../utils/redux'
import Slider from '../Forms/Slider'
import styles from './Controls.module.css'

const ControlsForm = function ControlsForm() {
  return (
    <div>
      <Field
        name="controls.baseRotation"
        component={Slider}
        min={0}
        max={360}
      />
      <Field
        name="controls.shoulderRotation"
        component={Slider}
        min={0}
        max={130}
      />
      <Field
        name="controls.elbowRotation"
        component={Slider}
        min={0}
        max={130}
      />
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
