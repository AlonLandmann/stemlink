import Resource from '../../../db/models/Resource'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'
import getFeedPipeline from '../../../db/pipelines/getFeedPipeline'
import getServerSideFile from '../../../lib/getServerSideFile'

dbConnect()

export default async function handler(req, res) {
  const session = await getSession({ req })

  try {
    switch (req.method) {
      case 'GET':
        const file = await getServerSideFile(session)
        const pipeline = await getFeedPipeline(req.query, file)
        const getCursor = await Resource.aggregate(pipeline)

        if (getCursor) {
          res.status(200).json({ success: true, data: getCursor })
        } else {
          res.status(400).json({ success: false })
        }
        break;

      case 'POST':
        if (session && session.user.email === req.body.publishedBy) {
          const postCursor = await Resource.create(req.body)

          if (postCursor) {
            res.status(200).json({ success: true, data: postCursor })
          } else {
            res.status(400).json({ success: false })
          }
        } else {
          res.status(401).json({ success: false })
        }
        break;

      default:
        res.status(400).json({ success: false })
        break;
    }
  } catch (err) {
    res.status(400).json({ success: false })
  }
}
