import React from 'react'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { CssBaseline } from '@material-ui/core'

const MyApp = ({ Component, pageProps }: AppProps) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="theme-color" content="#673ab7" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
        asp-append-version="true"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
        asp-append-version="true"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
        asp-append-version="true"
      />
      <link
        rel="manifest"
        href="/manifest.webmanifest"
        asp-append-version="true"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <title>Poetracker</title>
      <meta name="robots" content="noindex,nofollow" />
      <meta property="og:title" content="Poetracker" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="Path of Exile rank tracker" />
      <meta property="og:image" content="/favicon.png" />{' '}
    </Head>
    <CssBaseline />
    <Component {...pageProps} />
  </>
)

export default MyApp
