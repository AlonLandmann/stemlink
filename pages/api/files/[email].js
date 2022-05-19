import File from '../../../db/models/File'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'

dbConnect()

export default async function handler(req, res) {
  const session = await getSession({ req })

  try {
    switch (req.method) {
      case 'GET':
        if (session && session.user.email === req.query.email) {
          const getCursor = await File.findOne({ email: req.query.email })

          if (getCursor) {
            res.status(200).json({ success: true, data: getCursor })
          } else {
            res.status(400).json({ success: false })
          }
        } else {
          res.status(401).json({ success: false })
        }
        break;

      case 'PUT':
        if (session && session.user.email === req.query.email) {
          const options = { new: true, runValidators: true }
          const putCursor = await File.findOneAndUpdate(
            { email: req.query.email },
            req.body,
            options
          )

          if (putCursor) {
            res.status(200).json({ success: true, data: putCursor })
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
