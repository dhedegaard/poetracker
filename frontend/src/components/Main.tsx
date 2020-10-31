import {
  AppBar,
  Box,
  Container,
  createMuiTheme,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@material-ui/core'
import React from 'react'
import deepPurple from '@material-ui/core/colors/deepPurple'
import deepOrange from '@material-ui/core/colors/deepOrange'
import CharacterTableContainer from '../containers/character-table'
import ErrorContainer from '../containers/error'
import FilterContainer from '../containers/filter'
import Loading from './Loading'
import Image from 'next/image'
import GithubLink from './GithubLink'

const theme = createMuiTheme({
  palette: { primary: deepPurple, secondary: deepOrange },
})

const Main: React.FunctionComponent<{}> = () => (
  <ThemeProvider theme={theme}>
    <AppBar color="primary" position="relative">
      <Container maxWidth="lg">
        <Toolbar>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex">
              <Image src="/favicon.png" alt="logo" width="30px" height="30px" />
              <Box ml={1}>
                <Typography variant="h6">Poetracker</Typography>
              </Box>
            </Box>
            <GithubLink />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>

    <Container maxWidth="lg">
      <ErrorContainer />
      <FilterContainer />
      <hr />
      <CharacterTableContainer />
      <Loading />
    </Container>
  </ThemeProvider>
)
export default Main
