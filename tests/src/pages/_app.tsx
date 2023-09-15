import './globals.css'

import type { AppProps } from 'next/app'
import Providers from './providers'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Near Social Bridge Tests</title>
      </Head>
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </>
  )
}
