import EditContent from '../../../components/pages/EditContent'
import Error from 'next/error'
import Head from 'next/head'
import Header from '../../../components/header/Header'
import Resource from '../../../db/models/Resource'
import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'

export default function Edit({ resourceJson }) {
  const resource = JSON.parse(resourceJson)
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn()
    }
  }, [status])

  return (
    <>
      <Head>
        <title>Edit</title>
      </Head>

      <main>
        {status === 'authenticated' &&
          (resource.publishedBy === session.user.email
            ? <>
                <Header />
                <EditContent resource={resource} />
              </>
            : <Error statusCode={403} />
          )
        }
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  dbConnect()

  const resource = await Resource.findOne({ _id: context.query.id }).lean()

  return {
    props: {
      resourceJson: JSON.stringify(resource)
    }
  }
}
