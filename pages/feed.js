import FeedContent from '../components/pages/FeedContent'
import Head from 'next/head'
import Header from '../components/header/Header'
import Resource from '../db/models/Resource'
import { getSession } from 'next-auth/react'
import dbConnect from '../db/dbConnect'
import getFeedPipeline from '../db/pipelines/getFeedPipeline'
import getServerSideFile from '../lib/getServerSideFile'

export default function Feed({ initialFeedJson }) {
  return (
    <>
      <Head>
        <title>Stemlink</title>
      </Head>

      <main>
        <Header />
        <FeedContent initialFeed={JSON.parse(initialFeedJson)} />
      </main>
    </>
  )
}

export async function getServerSideProps(context) {
  dbConnect()

  const session = await getSession(context)
  const file = await getServerSideFile(session)
  const pipeline = await getFeedPipeline(context.query, file)
  const initialFeed = await Resource.aggregate(pipeline)

  return {
    props: {
      initialFeedJson: JSON.stringify(initialFeed)
    }
  }
}
