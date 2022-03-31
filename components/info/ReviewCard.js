import Svg from '../Svg'
import { deleteReview, getReview, putReview } from '../../mongodb/api/client'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/router'
import ago from '../../lib/ago'
import css from './ReviewCard.module.scss'
import toast from 'react-hot-toast'

export default function ReviewCard({ review }) {
  const [upvoted, setUpvoted] = useState(review.upvoted)
  const [count, setCount] = useState(review.upvotedBy.length)
  const { data: session } = useSession()
  const router = useRouter()

  function createUpdatedReviewWithNewUpvote(review) {
    return {
      ...review,
      upvotedBy: [...review.upvotedBy, session.user.email]
    }
  }
  function createUpdatedReviewWithoutUpvote(review) {
    let updatedReview = { ...review }
    let index = updatedReview.upvotedBy.indexOf(session.user.email)

    updatedReview.upvotedBy.splice(index, 1)

    return updatedReview
  }
  function handleDelete() {
    if (confirm('Are you sure you want to delete this review?')) {
      async function executeApiCalls() {
        try {
          const success = await deleteReview(review)

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
          toast.success('Your review has been successfully deleted!')
          router.reload()
        } else {
          toast.error('Something went wrong')
        }
      })
    }
  }

  async function toggleUpvote() {
    if (session) {
      setCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1)
      setUpvoted(prevUpvoted => !prevUpvoted)

      try {
        const upToDateReview =  await getReview(review._id)

        if (upToDateReview.upvotedBy.indexOf(session.user.email) > -1) {
          await putReview(createUpdatedReviewWithoutUpvote(upToDateReview))
        } else {
          await putReview(createUpdatedReviewWithNewUpvote(upToDateReview))
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
      <div className={upvoted ? css.upvoted : css.notUpvoted} onClick={toggleUpvote}>
        <div><Svg icon={upvoted ? 'upvoteFill' : 'upvote'} /></div>
        <div>{count}</div>
      </div>
      <div className={css.main}>
        <div className={css.topLine}>
          <div className={css.rating}>
            {review.rating}
          </div>
          {session && session.user.email === review.writtenBy &&
            <div className={css.delete} onClick={handleDelete}>
              delete
            </div>
          }
          <div className={css.writtenAtBy}>
            {ago(new Date(review.writtenAt))}
          </div>
        </div>
        <div className={css.title}>
          {review.title}
        </div>
        <div className={css.content}>
          {review.content}
        </div>
      </div>
    </div>
  )
}
