import File from '../db/models/File'
import dbConnect from '../db/dbConnect'

dbConnect()

export default async function getServerSideFile(session) {
  let file = null

  if (session) {
    file = await File.findOne({ email: session.user.email })

    if (!file) {
      file = await File.create({ ...session.user, savedLinks: [] })
    }
  }

  return file
}
