import DetailedCard from '../cards/DetailedCard'
import ReviewCard from '../cards/ReviewCard'
import ReviewForm from '../forms/ReviewForm'
import ReviewSort from '../collation/ReviewSort'
import Svg from '../Svg'
import { useSession } from 'next-auth/react'
import { useState } from 'react'
import cce from '../../lib/cce'
import css from './InfoContent.module.scss'

export default function InfoContent({ resource }) {
  const [sortInView, setSortInView] = useState(false)
  const [sortIsActive, setSortIsActive] = useState(false)
  const { data: session } = useSession()

  function toggleSort() {
    setSortInView(prevSortInView => !prevSortInView)
  }

  return (
    <>
      <div className={css.pageTitle}>
        <div>
          <div>Reviews</div>
          <div className={cce(sortIsActive, css.sortButton, css.active)} onClick={toggleSort}>
            sort <Svg icon={sortInView ? 'chevronUp' : 'chevronDown'} />
          </div>
        </div>
      </div>
      {sortInView &&
        <ReviewSort
          setSortIsActive={setSortIsActive}
          setSortInView={setSortInView}
          resourceId={resource._id}
        />
      }
      <div className={css.mainContainer}>
        <div className={css.detailedCard}>
          <DetailedCard resource={resource} />
        </div>
        {resource.reviews.length > 0 &&
          <>
            <div className={css.separator}><div></div></div>
            <div className={css.reviewContainer}>
              {resource.reviews.map(review => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          </>
        }
        {session && !resource.reviewedByUser &&
          <>
            <div className={css.separator}><div></div></div>
            <ReviewForm resource={resource} />
          </>
        }
      </div>
    </>
  )
}
