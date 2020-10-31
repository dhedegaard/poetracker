import Document, { Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: any) => (props: any) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en">
        <body className="bg-light">
          <nav className="navbar navbar-dark bg-dark">
            <div className="container">
              <span className="navbar-brand">
                <img
                  src="/favicon-32x32.png"
                  width="30"
                  height="30"
                  alt="Poetracker"
                  asp-append-version="true"
                />
                Poetracker
              </span>
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
