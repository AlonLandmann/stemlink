import InfoResourceCard from '../cards/InfoResourceCard'
import InfoCollation from '../collation/InfoCollation'
import InfoReviewCard from '../cards/InfoReviewCard'
import InfoReviewForm from '../forms/InfoReviewForm'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import css from './InfoContent.module.scss'

export default function InfoContent({ resource }) {
  const { data: session } = useSession()

  return (
    <>
      <InfoCollation />
      <div className={css.infoContainer}>
        <div className={css.resourceCardContainer}>
          <InfoResourceCard resource={resource} />
        </div>
        {resource.reviews.length > 0 &&
          <>
            <div className={css.separator}><div></div></div>
            <div className={css.reviewCardContainer}>
              {resource.reviews.map(review => (
                <InfoReviewCard key={review._id} review={review} />
              ))}
            </div>
          </>
        }
        {session && !resource.reviewedByUser &&
          <>
            <div className={css.separator}><div></div></div>
            <InfoReviewForm resource={resource} />
          </>
        }
      </div>
    </>
  )
}
