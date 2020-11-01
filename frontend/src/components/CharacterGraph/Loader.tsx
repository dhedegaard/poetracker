import { Alert } from '@material-ui/lab'
import React from 'react'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    cursor: wait;
  }
`

const Loader: React.FunctionComponent<{}> = () => (
  <>
    <GlobalStyle />
    <Alert severity="info">Loading data, please wait...</Alert>
  </>
)

export default Loader
