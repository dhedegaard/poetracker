import {
  Box,
  Container,
  createMuiTheme,
  ThemeProvider,
} from '@material-ui/core'
import deepOrange from '@material-ui/core/colors/deepOrange'
import deepPurple from '@material-ui/core/colors/deepPurple'
import React from 'react'
import CharacterTableContainer from '../containers/character-table'
import ErrorContainer from '../containers/error'
import FilterContainer from '../containers/filter'
import Loading from './Loading'
import NavBar from './NavBar'

const theme = createMuiTheme({
  palette: { primary: deepPurple, secondary: deepOrange },
})

const Main: React.FC = () => (
  <ThemeProvider theme={theme}>
    <NavBar />

    <Container maxWidth="lg">
      <Box mb={2}>
        <ErrorContainer />
      </Box>
      <Box mb={2}>
        <FilterContainer />
      </Box>
      <CharacterTableContainer />
      <Loading />
    </Container>
  </ThemeProvider>
)
export default Main
