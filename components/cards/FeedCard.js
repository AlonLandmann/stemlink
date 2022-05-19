import Svg from '../Svg'
import { getFile, putFile } from '../../db/api/file'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import css from './FeedCard.module.scss'
import round from '../../lib/round'

export default function FeedCard({ resource }) {
  const [saved, setSaved] = useState(resource.saved)
  const [count, setCount] = useState(resource.count)
  const { data: session } = useSession()
  const router = useRouter()

  function handleClick() {
    router.push(`../links/${resource._id}`)
  }

  async function toggleSave(event) {
    event.stopPropagation()

    if (session) {
      setSaved(prevSaved => !prevSaved)
      setCount(prevCount => saved ? prevCount - 1 : prevCount + 1)

      try {
        const file = await getFile(session.user.email)

        if (file.savedLinks.indexOf(resource._id) > -1) {
          await putFile(createUpdatedFileWithoutSave(file, resource))
        } else {
          await putFile(createUpdatedFileWithNewSave(file, resource))
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      signIn()
    }
  }

  function createUpdatedFileWithNewSave(file, resource) {
    return {
      ...file,
      savedLinks: [...file.savedLinks, resource._id]
    }
  }
  function createUpdatedFileWithoutSave(file, resource) {
    let updatedFile = { ...file }
    let index = updatedFile.savedLinks.indexOf(resource._id)

    updatedFile.savedLinks.splice(index, 1)

    return updatedFile
  }

  return (
    <div className={css.card} onClick={handleClick}>
      <div className={css.type}>
        <Svg icon={resource.type} />
      </div>
      <div className={css.main}>
        <div className={css.title}>
          {resource.title}
        </div>
        <div className={css.author}>
          {resource.author}
        </div>
        <div className={resource.price > 0 ? css.paid : css.free}>
          {resource.price > 0 ? `$ ${round(resource.price, 0)}` : 'free'}
        </div>
      </div>
      <div className={css.rating}>
        <div><Svg icon='rating' /></div>
        <div>{resource.rating ? round(resource.rating, 1) : '-'}</div>
      </div>
      <div className={saved ? css.saved : css.notSaved} onClick={toggleSave}>
        <div><Svg icon={saved ? 'bookmarkFill' : 'bookmark'} /></div>
        <div>{count}</div>
      </div>
    </div>
  )
}
