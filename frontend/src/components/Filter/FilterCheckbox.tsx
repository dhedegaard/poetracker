import { Box, FormLabel, Switch } from '@material-ui/core'
import React from 'react'

interface IProps {
  checked: boolean
  label: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const FilterCheckbox: React.FunctionComponent<IProps> = (props) => {
  const id = `id_${props.label.toLowerCase().replace(' ', '_')}`
  return (
    <Box display="flex" alignItems="center" width="100%" flexBasis="100%">
      <Switch
        id={id}
        checked={props.checked}
        size="small"
        onChange={props.onChange}
      />
      <FormLabel htmlFor={id}>{props.label}</FormLabel>
    </Box>
  )
}

export default FilterCheckbox
