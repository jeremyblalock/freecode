import React, { useState } from 'react'
import styles from './Arm.module.css'

const Segment = function Segment({ children, values }) {
  const { x, y, z } = values

  const segmentStyles = {
    transform: `perspective(1000px) rotateX(${x}deg) rotateY(${y}deg) rotateZ(${z}deg)`,
  }

  return (
    <div className={styles.segment} style={segmentStyles}>
      {children}
    </div>
  )
}

const Controls = function Controls({ values, onChange, label }) {
  const { x, y, z } = values

  const handleChange = name => e => {
    onChange({ ...values, [name]: e.currentTarget.value })
  }

  return (
    <div className={styles.controls}>
      <strong>{label} </strong>
      X:
      <input
        type="number"
        placeholder="0"
        value={x}
        onChange={handleChange('x')}
      />
      Y:{' '}
      <input
        type="number"
        placeholder="0"
        value={y}
        onChange={handleChange('y')}
      />
      Z:{' '}
      <input
        type="number"
        placeholder="0"
        value={z}
        onChange={handleChange('z')}
      />
    </div>
  )
}

const Scene = function Scene({ state, setState }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [startingRotation, setStartingRotation] = useState(null)
  const [dragStart, setDragStart] = useState(null)
  const { x, y } = rotation

  const handleStartDrag = e => {
    setStartingRotation(rotation)
    setDragStart({ x: e.clientX, y: e.clientY })
  }

  const handleDrag = e => {
    if (!dragStart || !startingRotation) return

    const { x, y } = startingRotation
    const { x: startX, y: startY } = dragStart
    const endX = e.clientX
    const endY = e.clientY

    const diffX = endX - startX
    const diffY = endY - startY

    setRotation({
      x: x - diffY,
      y: y + diffX,
    })
  }

  const handleDragEnd = e => {
    setStartingRotation(null)
    setDragStart(null)
  }

  const transformStyles = {
    transform: `perspective(1000px) rotateY(${y}deg) rotateX(${x}deg)`,
  }

  return (
    <div
      className={styles.sceneWrapper}
      onMouseDown={handleStartDrag}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
    >
      <div className={styles.scene} style={transformStyles}>
        <Segment values={state[0]}>
          <Segment values={state[1]}>
            <Segment values={state[2]} />
          </Segment>
        </Segment>
      </div>
    </div>
  )
}

export default function Arm() {
  const [state, setState] = useState([
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
    { x: 0, y: 0, z: 0 },
  ])

  const handleChange = index => value => {
    const newState = state.slice()
    newState[+index] = value
    setState(newState)
  }

  return (
    <div className={styles.wrapper}>
      <Scene state={state} setState={setState} />
      <div className={styles.controlsWrapper}>
        <Controls
          onChange={handleChange(0)}
          values={state[0]}
          label="Section 1"
        />
        <Controls
          onChange={handleChange(1)}
          values={state[1]}
          label="Section 2"
        />
        <Controls
          onChange={handleChange(2)}
          values={state[2]}
          label="Section 3"
        />
      </div>
    </div>
  )
}
