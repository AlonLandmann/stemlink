import Head from 'next/head'
import Header from '../components/header/Header'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.scss'

export default function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Head>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Header />
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  )
}
