import Svg from '../Svg'
import { getFile, putFile } from '../../db/client/file'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import css from './InfoResourceCard.module.scss'
import round from '../../lib/round'
import toast from 'react-hot-toast'
import types from '../../lib/types'

export default function InfoResourceCard({ resource }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [saved, setSaved] = useState(resource.saved)
  const [count, setCount] = useState(resource.count)

  function handleEdit() {
    router.push(`/links/${router.query.id}/edit`)
  }
  function handleTopicSearch(event) {
    const newStr = event.currentTarget.innerText.replace(/ /g, '_')

    window.location.replace(`${router.basePath}/feed?str=${newStr}`)
  }
  function handleGoToResource() {
    switch (resource.safetyStatus) {
      case 'ok':
        window.open(resource.href, '_blank')
        break;

      case 'fresh':
        if ((session && resource.publishedBy === session.user.email) || confirm(
          `This link has been posted quite recently and has not yet been reviewed.
          Would you like to proceed anyway?`
        )) {
          window.open(resource.href, '_blank')
        }
        break;

      case 'flagged':
        if ((session && resource.publishedBy === session.user.email) || confirm(
          `This link has been falgged for a safety review.
          Would you like to proceed anyway?`
        )) {
          window.open(resource.href, '_blank')
        }
        break;

      case 'unsafe':
        alert ('This link has been marked unsafe. It should be removed shortly.')
        break;

      default:
        alert('The safety status of this link is undetermined. It should be reviewed shortly.')
        break;
    }
  }

  async function handleSave(event) {
    event.stopPropagation()

    if (session) {
      try {
        setCount(prevCount => saved ? prevCount - 1 : prevCount + 1)
        setSaved(prevSaved => !prevSaved)

        const file = await getFile(session.user.email)

        if (file.savedLinks.indexOf(resource._id) > -1) {
          await putFile(createFileWithoutSave(file, resource))
        } else {
          await putFile(createFileWithNewSave(file, resource))
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      signIn()
    }
  }

  function createFileWithNewSave(file, resource) {
    return {
      ...file,
      savedLinks: [...file.savedLinks, resource._id]
    }
  }
  function createFileWithoutSave(file, resource) {
    let updatedFile = { ...file }
    let index = updatedFile.savedLinks.indexOf(resource._id)

    updatedFile.savedLinks.splice(index, 1)

    return updatedFile
  }

  return (
    <div className={css.card}>
      <div className={css.main}>
        <div className={css.type}>
          <Svg icon={resource.type} />
          <div>
            {types.find(typeObj => typeObj.type === resource.type).display}
          </div>
          {session && session.user.email === resource.publishedBy &&
            <div className={css.editButton} onClick={handleEdit}>
              edit
            </div>
          }
        </div>
        <div className={css.title}>{resource.title}</div>
        <div className={css.author}>{resource.author}</div>
        <div className={resource.price > 0 ? css.paid : css.free}>
          {resource.price > 0 ? `$ ${resource.price}` : 'free'}
        </div>
        <div className={css.topicsHeading}>Resource Topics</div>
        <div className={css.topics}>
          {resource.topics.map((topic, index) => (
            <div key={index} onClick={handleTopicSearch}>
              <div>{topic}</div>
            </div>
          ))}
        </div>
        <div className={css.link}>
          <div onClick={handleGoToResource}>go to resource</div>
        </div>
      </div>
      <div className={css.rating}>
        <div><Svg icon='rating' /></div>
        <div>{resource.rating ? round(resource.rating, 1) : '-'}</div>
      </div>
      <div className={saved ? css.saved : css.notSaved} onClick={handleSave}>
        <div><Svg icon={saved ? 'bookmarkFill' : 'bookmark'} /></div>
        <div>{count}</div>
      </div>
    </div>
  )
}
