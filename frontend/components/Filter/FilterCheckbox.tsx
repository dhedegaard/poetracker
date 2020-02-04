import React from 'react'

interface IProps {
  checked: boolean
  label: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterCheckbox: React.FunctionComponent<IProps> = props => {
  const id = `id_${props.label.toLowerCase().replace(' ', '_')}`
  return (
    <div className="col-md-3">
      <input
        id={id}
        type="checkbox"
        checked={props.checked}
        onChange={props.onChange}
      />
      <label htmlFor={id}>
        <small>{props.label}</small>
      </label>
    </div>
  )
}

export default FilterCheckbox
