import Resource from '../../../db/models/Resource'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'

dbConnect()


export default async function handler(req, res) {
  const session = await getSession({ req })

  try {
    switch (req.method) {
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
