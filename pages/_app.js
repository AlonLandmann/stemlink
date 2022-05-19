import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  )
}
