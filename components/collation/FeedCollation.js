import FeedFilter from './FeedFilter'
import FeedSort from './FeedSort'
import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import css from './FeedCollation.module.scss'

export default function FeedCollation() {
  const router = useRouter()
  const [ddInView, setDdInView] = useState(false)
  const [filters, setFilters] = useState({
    saved: router.query.saved === 'true',
    created: router.query.created === 'true',
    price: router.query.price || 'all',
    types: router.query.types ? router.query.types.split('-') : []
  })
  const [sort, setSort] = useState(router.query.sort || 'popularity')

  function handleFilterToggle() {
    if (ddInView === 'filter') {
      setDdInView(false)
    } else {
      setDdInView('filter')
    }
  }
  function handleSortToggle() {
    if (ddInView === 'sort') {
      setDdInView(false)
    } else {
      setDdInView('sort')
    }
  }
  function handleApply() {
    window.location.replace([
      '/feed',
      `?str=${router.query.str || ''}`,
      `&saved=${filters.saved}`,
      `&created=${filters.created}`,
      `&price=${filters.price}`,
      `&types=${filters.types.join('-')}`,
      `&sort=${sort}`
    ].join(''))
  }
  function handleClearFilters() {
    setFilters({
      saved: false,
      created: false,
      price: 'all',
      types: []
    })
  }
  function handleClearSort() {
    setSort('popularity')
  }

  return (
    <>
      <div className={css.collationBar}>
        <div>
          <div>Resources</div>
          <div className={css.filterButton} onClick={handleFilterToggle}>
            filter <Svg icon={ddInView === 'filter' ? 'chevronUp' : 'chevronDown'} />
          </div>
          <div className={css.sortButton} onClick={handleSortToggle}>
            sort <Svg icon={ddInView === 'sort' ? 'chevronUp' : 'chevronDown'} />
          </div>
        </div>
      </div>
      {ddInView === 'filter' &&
        <FeedFilter
          filters={filters}
          setFilters={setFilters}
          handleApply={handleApply}
          handleClear={handleClearFilters}
        />
      }
      {ddInView === 'sort' &&
        <FeedSort
          sort={sort}
          setSort={setSort}
          handleApply={handleApply}
          handleClear={handleClearSort}
        />
      }
    </>
  )
}
