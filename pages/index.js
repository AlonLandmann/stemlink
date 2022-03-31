import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  // until the landing page is completed
  const router = useRouter()
  
  useEffect(() => {
    router.push('/search')
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
