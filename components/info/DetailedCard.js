import Link from 'next/link'
import Svg from '../Svg'
import { deleteResource, getFile, putFile } from '../../mongodb/api/client'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import css from './DetailedCard.module.scss'
import round from '../../lib/round'
import toast from 'react-hot-toast'

export default function DetailedCard({ resource }) {
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
  function goToResource() {
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
        alert ('This link has been marked unsafe. It should be remove shortly.')
        break;

      default:
        alert('The safety status of this link is undetermined. It should be reviewed shortly.')
        break;
    }
  }
  function handleTopicSearch(event) {
    const newStr = event.currentTarget.innerText.replace(/ /g, '_')

    window.location.replace(`${router.basePath}/search?str=${newStr}`)
  }
  function handleDelete() {
    if (confirm('Are you sure you want to delete this link?')) {
      async function executeApiCalls() {
        try {
          const success = await deleteResource(resource)

          if (success) {
            return true
          }

          return false
        } catch (err) {
          return false
        }
      }

      executeApiCalls().then(success => {
        if (success) {
          toast.success('Your link has been successfully deleted!')
          router.push('/')
        } else {
          toast.error('Something went wrong')
        }
      })
    }
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
    <div className={css.card}>
      <div className={css.main}>
        <div className={css.type}>
          <Svg icon={resource.type} />
        </div>
        <div className={css.title}>
          <div>
            {resource.title}
          </div>
          {resource.rating &&
            <div className={css.rating}>
              <div>{round(resource.rating, 2)}</div>
            </div>
          }
        </div>
        <div className={css.author}>
          {resource.author}
        </div>
        <div className={resource.price > 0 ? css.paid : css.free}>
          {resource.price > 0 ? `$ ${resource.price}` : 'free'}
        </div>
        <div className={css.topicsHeading}>Topics</div>
        <div className={css.topics}>
          {resource.topics.map((topic, index) => (
            <div key={index} onClick={handleTopicSearch}>
              <div>{topic}</div>
            </div>
          ))}
        </div>
        <div className={css.links}>
          <div onClick={goToResource}>go to resource</div>
          {session && session.user.email === resource.publishedBy &&
            <>
              <Link href={`/links/${router.query.id}/edit`}>
                <div>edit link</div>
              </Link>
              <div onClick={handleDelete}>delete link</div>
            </>
          }
        </div>
      </div>
      <div className={saved ? css.saved : css.notSaved} onClick={toggleSave}>
        <div><Svg icon={saved ? 'bookmarkFill' : 'bookmark'} /></div>
        <div>{count}</div>
      </div>
    </div>
  )
}
