import Svg from '../Svg'
import { getFile, putFile } from '../../mongodb/api/client'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import css from './Card.module.scss'
import round from '../../lib/round'

export default function Card({ resource }) {
  const [saved, setSaved] = useState(resource.saved)
  const [count, setCount] = useState(resource.count)
  const { data: session } = useSession()
  const router = useRouter()

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
  function handleClick() {
    router.push(`../links/${resource._id}`)
  }

  async function toggleSave(event) {
    event.stopPropagation()

    if (session) {
      setCount(prevCount => saved ? prevCount - 1 : prevCount + 1)
      setSaved(prevSaved => !prevSaved)

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
          {resource.price > 0 ? `$ ${resource.price}` : 'free'}
        </div>
      </div>

      <div className={css.rating}>
        <div><Svg icon='rating' /></div>
        <div>{resource.rating ? round(resource.rating, 2) : '-'}</div>
      </div>

      <div className={saved ? css.saved : css.notSaved} onClick={toggleSave}>
        <div><Svg icon={saved ? 'bookmarkFill' : 'bookmark'} /></div>
        <div>{count}</div>
      </div>
    </div>
  )
}
