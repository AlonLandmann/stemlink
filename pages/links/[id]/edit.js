import EditContent from '../../../components/crud/EditContent'
import Error from 'next/error'
import Head from 'next/head'
import Resource from '../../../mongodb/models/Resource'
import { useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import dbConnect from '../../../mongodb/dbConnect'

export default function Edit({ resourceJson }) {
  const { data: session, status } = useSession()
  const resource = JSON.parse(resourceJson)

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
            ? <EditContent resource={resource} />
            : <Error statusCode={403} />
          )
        }
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  dbConnect()

  let resource = await Resource.findOne({ _id: context.query.id }).lean()

  return {
    props: {
      resourceJson: JSON.stringify(resource)
    }
  }
}
