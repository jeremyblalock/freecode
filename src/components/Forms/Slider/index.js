import React, { useCallback } from 'react'
import styles from './Slider.module.css'

export default function Slider({ input, min, max, step = 1 }) {
  const { value, onChange } = input

  const handleChange = useCallback(e => {
    onChange(e.currentTarget.value)
  }, [])

  return (
    <div className={styles.wrapper}>
      <input
        type="range"
        className={styles.slider}
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
      />
      <input
        type="number"
        className={styles.input}
        min={min}
        max={max}
        value={value}
        step={step}
        onChange={handleChange}
      />
    </div>
  )
}
