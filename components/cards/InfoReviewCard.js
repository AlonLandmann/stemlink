import Svg from '../Svg'
import { getReview, putReview, deleteReview } from '../../db/client/review'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import { useState } from 'react'
import ago from '../../lib/ago'
import css from './InfoReviewCard.module.scss'
import toast from 'react-hot-toast'

export default function InfoReviewCard({ review }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [upvoted, setUpvoted] = useState(review.upvoted)
  const [count, setCount] = useState(review.upvotedBy.length)

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

  async function handleUpvote() {
    if (session) {
      try {
        setUpvoted(prevUpvoted => !prevUpvoted)
        setCount(prevCount => upvoted ? prevCount - 1 : prevCount + 1)

        const upToDateReview =  await getReview(review._id)

        if (upToDateReview.upvotedBy.indexOf(session.user.email) > -1) {
          await putReview(createReviewWithoutUpvote(upToDateReview))
        } else {
          await putReview(createReviewWithNewUpvote(upToDateReview))
        }
      } catch (err) {
        console.error(err)
      }
    } else {
      signIn()
    }
  }

  function createReviewWithNewUpvote(review) {
    return {
      ...review,
      upvotedBy: [...review.upvotedBy, session.user.email]
    }
  }
  function createReviewWithoutUpvote(review) {
    let updatedReview = { ...review }
    let index = updatedReview.upvotedBy.indexOf(session.user.email)

    updatedReview.upvotedBy.splice(index, 1)

    return updatedReview
  }

  return (
    <div className={css.card}>
      <div className={css.main}>
        <div className={css.topLine}>
          <div className={css.writtenAtBy}>
            {ago(new Date(review.writtenAt))}
          </div>
          {session && session.user.email === review.writtenBy &&
            <div className={css.delete} onClick={handleDelete}>
              delete
            </div>
          }
        </div>
        <div className={css.title}>{review.title}</div>
        <div className={css.content}>{review.content}</div>
      </div>
      <div className={css.rating}>
        <div><Svg icon='rating' /></div>
        <div>{review.rating}</div>
      </div>
      <div className={upvoted ? css.upvoted : css.notUpvoted} onClick={handleUpvote}>
        <div><Svg icon={upvoted ? 'upvoteFill' : 'upvote'} /></div>
        <div>{count}</div>
      </div>
    </div>
  )
}
