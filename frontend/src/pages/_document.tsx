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

      // A simple, naive minification of the Material UI stylesheet.
      const muiStyles = muiSheets.getStyleElement()
      muiStyles.props.dangerouslySetInnerHTML.__html = (muiStyles.props
        .dangerouslySetInnerHTML.__html as string).replace(/\s+/g, ' ')

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {styledSheet.getStyleElement()}
            {muiStyles}
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
        <Head>
          <meta name="description" content="Path of Exile rank tracker" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
