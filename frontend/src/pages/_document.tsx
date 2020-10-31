import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import { ServerStyleSheets } from '@material-ui/core/styles'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const muiSheets = new ServerStyleSheets()
    const styledSheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            styledSheet.collectStyles(muiSheets.collect(<App {...props} />)),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledSheet.getStyleElement()}
            {muiSheets.getStyleElement()}
          </>
        ),
      }
    } finally {
      styledSheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        {/* TODO: Remove later. */}
        <body className="bg-light">
          <nav className="navbar navbar-dark bg-dark">
            <div className="container">
              <a
                className="navbar-text text-right"
                href="https://github.com/dhedegaard/poetracker"
                target="_blank"
                rel="noopener"
              >
                Github
              </a>
            </div>
          </nav>
          <div className="container">
            <Main />
          </div>
          <NextScript />
        </body>
      </Html>
    )
  }
}
