import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/feed')
  })

  return (
    <>
      <Head>
        <title>Stemlink</title>
      </Head>

      <main>

      </main>
    </>
  )
}
