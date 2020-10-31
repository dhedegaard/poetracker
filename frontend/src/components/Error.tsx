import React from 'react'
import { Alert, AlertTitle } from '@material-ui/lab'

export interface IErrorProps {
  error: string
}

const Error = (props: IErrorProps) => {
  if (!props.error) {
    return null
  }

  const onClick = () => {
    window.location.reload()
  }

  return (
    <>
      <Alert variant="filled" severity="error">
        <AlertTitle>Error</AlertTitle>
        {props.error}{' '}
        <a
          onClick={onClick}
          className="text-primary"
          href="javascript:void(0);"
        >
          <b>Reload page</b>
        </a>
      </Alert>
      <hr />
    </>
  )
}
export default Error
