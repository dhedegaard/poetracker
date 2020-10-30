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
    <div className="alert alert-info">Loading data, please wait...</div>
  </>
)

export default Loader
