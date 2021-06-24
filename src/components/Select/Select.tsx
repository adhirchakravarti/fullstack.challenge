import React from 'react'
import style from './style.scss'
import CalendarOption from 'src/models/CalendarOption'

type SelectProps = {
  options: CalendarOption[]
  selectedOption: CalendarOption
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select = ({
  options,
  selectedOption,
  onChange,
}: SelectProps): React.ReactElement => {
  return (
    <select
      className={style.calendarSelect}
      value={selectedOption.name}
      onChange={onChange}
    >
      {options.map((opt) => (
        <option style={{ color: opt.color }} key={opt.id} value={opt.name}>
          {opt.name}
        </option>
      ))}
    </select>
  )
}

export default Select
