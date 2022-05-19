import FeedCard from '../cards/FeedCard'
import FeedFilter from '../collation/FeedFilter'
import FeedSort from '../collation/FeedSort'
import Svg from '../Svg'
import { useState } from 'react'
import cce from '../../lib/cce'
import css from './FeedContent.module.scss'

export default function FeedContent({ feed }) {
  const [ddInView, setDdInView] = useState(false)
  const [filterIsActive, setFilterIsActive] = useState(false)
  const [sortIsActive, setSortIsActive] = useState(false)

  function toggleFilter() {
    if (ddInView === 'filter') {
      setDdInView(false)
    } else {
      setDdInView('filter')
    }
  }
  function toggleSort() {
    if (ddInView === 'sort') {
      setDdInView(false)
    } else {
      setDdInView('sort')
    }
  }

  return (
    <>
      <div className={css.pageTitle}>
        <div>
          <div>Resources</div>
          <div className={cce(filterIsActive, css.filterButton, css.active)} onClick={toggleFilter}>
            filter <Svg icon={ddInView === 'filter' ? 'chevronUp' : 'chevronDown'} />
          </div>
          <div className={cce(sortIsActive, css.sortButton, css.active)} onClick={toggleSort}>
            sort <Svg icon={ddInView === 'sort' ? 'chevronUp' : 'chevronDown'} />
          </div>
        </div>
      </div>
      {ddInView === 'filter' &&
        <FeedFilter
          setFilterIsActive={setFilterIsActive}
        />
      }
      {ddInView === 'sort' &&
        <FeedSort
          setSortIsActive={setSortIsActive}
          setDdInView={setDdInView}
        />
      }
      <div className={css.feedContainer}>
        {feed.map(resource => (
          <FeedCard key={resource._id} resource={resource} />
        ))}
      </div>
      {feed.length === 0 &&
        <div className={css.noMatch}>
          There are no matching resources
        </div>
      }
    </>
  )
}
