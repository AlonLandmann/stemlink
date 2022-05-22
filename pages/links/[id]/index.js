import Head from 'next/head'
import Header from '../../../components/header/Header'
import InfoContent from '../../../components/pages/InfoContent'
import Resource from '../../../db/models/Resource'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'
import getInfoPipeline from '../../../db/pipelines/getInfoPipeline'
import getServerSideFile from '../../../lib/getServerSideFile'

export default function Info({ resourceJson }) {
  return (
    <>
      <Head>
        <title>{JSON.parse(resourceJson).title}</title>
      </Head>

      <main>
        <Header />
        <InfoContent resource={JSON.parse(resourceJson)} />
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  dbConnect()

  const session = await getSession(context)
  const file = await getServerSideFile(session)
  const pipeline = await getInfoPipeline(context.query, file)
  const resource = (await Resource.aggregate(pipeline))[0]

  return {
    props: {
      resourceJson: JSON.stringify(resource)
    }
  }
}
