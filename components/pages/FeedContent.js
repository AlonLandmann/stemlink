import FeedResourceCard from '../cards/FeedResourceCard'
import FeedCollation from '../collation/FeedCollation'
import Loader from '../Loader'
import { getResources } from '../../db/client/resource'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import css from './FeedContent.module.scss'
import toast from 'react-hot-toast'

export default function FeedContent({ initialFeed }) {
  const router = useRouter()
  const [feed, setFeed] = useState(initialFeed)
  const [pagination, setPagination] = useState(0)
  const [endOfFeed, setEndOfFeed] = useState(initialFeed.length < 20)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  useEffect(() => {
    if (!isLoadingMore) {
      window.addEventListener('scroll', function() {
        const element = document.querySelector('#detectionBox')
        if (element) {
          const position = element.getBoundingClientRect();

          if (position.top < window.innerHeight) {
            setIsLoadingMore(true)
          }
        }
      })
    }
  }, [])
  useEffect(() => {
    if (isLoadingMore) {
      sendLoadMoreRequest()
    }
  }, [isLoadingMore])

  function sendLoadMoreRequest() {
    async function executeApiCalls() {
      try {
        const collationQuery = router.asPath.slice(6)
        const paginationQuery = `pagination=${pagination + 1}`
        const query = `${collationQuery}${collationQuery ? '&' : ''}${paginationQuery}`
        const nextFeed = await getResources(query)

        if (nextFeed) {
          setFeed(prevFeed => [...prevFeed, ...nextFeed])

          if (nextFeed.length < 20) {
            setEndOfFeed(true)
          }

          return true
        }

        return false
      } catch (err) {
        return false
      }
    }

    executeApiCalls().then(success => {
      if (success) {
        setPagination(prevPagination => prevPagination + 1)
      } else {
        toast.error('Something went wrong')
      }

      setIsLoadingMore(false)
    })
  }

  return (
    <>
      <FeedCollation />
      <div className={css.feedContainer}>
        {feed.map(resource => (
          <FeedResourceCard key={resource._id} resource={resource} />
        ))}
      </div>
      {!endOfFeed &&
        <div className={css.loadMore}>
          {!isLoadingMore &&
            <div id='detectionBox'></div>
          }
          <Loader show={isLoadingMore} />
        </div>
      }
      {feed.length > 0 && endOfFeed &&
        <div className={css.endOfFeed}>
          There are no more resources matching the search criteria
        </div>
      }
      {feed.length === 0 &&
        <div className={css.noMatchFound}>
          There are no matching resources
        </div>
      }
    </>
  )
}
