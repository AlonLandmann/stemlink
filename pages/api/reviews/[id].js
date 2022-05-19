import Review from '../../../db/models/Review'
import { getSession } from 'next-auth/react'
import dbConnect from '../../../db/dbConnect'

dbConnect()

export default async function handler(req, res) {
  const session = await getSession({ req })

  try {
    switch (req.method) {
      case 'GET':
        if (session) {
          const getCursor = await Review.findOne({ _id: req.query.id })

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
        if (session) {
          const options = { new: true, runValidators: true }
          const putCursor = await Review.findOneAndUpdate(
            { _id: req.query.id },
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

      case 'DELETE':
        if (session && session.user.email === req.body.writtenBy) {
          const deleteCursor = await Review.findOneAndDelete({ _id: req.query.id })

          if (deleteCursor) {
            res.status(200).json({ success: true, data: null })
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
