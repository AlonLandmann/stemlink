import Head from 'next/head'
import Header from '../../components/header/Header'
import NewContent from '../../components/pages/NewContent'
import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'

export default function New() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  return (
    <>
      <Head>
        <title>New</title>
      </Head>

      <main>
        {status === 'authenticated' &&
          <>
            <Header />
            <NewContent />
          </>
        }
      </main>
    </>
  )
}
