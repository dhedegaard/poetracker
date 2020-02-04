import React from 'react'
import { connect } from 'react-redux'
import styled, { createGlobalStyle } from 'styled-components'

const Container = styled.div<{ isVisible: boolean; isLoading: boolean }>`
  display: flex;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(255, 255, 255, 0.6);
  justify-content: center;
  align-items: center;
  font-size: 24px;
  user-select: none;
  pointer-events: none;
  transition: opacity 0.5s ease-in;
  opacity: ${p => (p.isVisible ? 1 : 0)};
`

const GlobalWaitStyle = createGlobalStyle`
  body {
    cursor: wait;
  }
`

type Props = ReturnType<typeof mapStateToProps>

const Loading: React.FunctionComponent<Props> = props => (
  <Container
    isVisible={props.error !== '' || props.loading}
    isLoading={props.loading}
  >
    {props.loading && <GlobalWaitStyle />}
    <div>{props.error !== '' ? `Error: ${props.error}` : 'Loading...'}</div>
  </Container>
)

const mapStateToProps = (state: poetracker.IState) => ({
  error: state.error,
  loading: state.loading
})

export default connect(mapStateToProps)(Loading)
