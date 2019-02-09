import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  body {
    cursor: wait;
  }
`

const Loader: React.FunctionComponent<{}> = () => (
  <Container className="alert alert-info">
    Loading data, please wait...
  </Container>
)

export default Loader
