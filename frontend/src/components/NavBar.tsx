import { AppBar, Box, Container, Toolbar, Typography } from '@material-ui/core'
import Image from 'next/image'
import React from 'react'
import GithubLink from './GithubLink'

const NavBar: React.FC = () => (
  <Box mb={2}>
    <AppBar color="primary" position="relative">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Box display="flex">
              <Image
                src="/favicon.png"
                alt="logo"
                width="30px"
                height="30px"
                priority
              />
              <Box ml={1}>
                <Typography variant="h6">Poetracker</Typography>
              </Box>
            </Box>
            <GithubLink />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  </Box>
)

export default NavBar
