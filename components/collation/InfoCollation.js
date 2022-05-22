import InfoSort from './InfoSort'
import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import css from './InfoCollation.module.scss'

export default function InfoCollation() {
  const router = useRouter()
  const [ddInView, setDdInView] = useState(false)
  const [sort, setSort] = useState(router.query.sort || 'top')

  function handleDdToggle() {
    setDdInView(prevDdInView => !prevDdInView)
  }
  function handleApply() {
    window.location.replace([
      `/links/${router.query.id}`,
      `?sort=${sort}`
    ].join(''))
  }
  function handleClear() {
    setSort('top')
  }

  return (
    <>
      <div className={css.collationBar}>
        <div>
          <div>Reviews</div>
          <div className={css.sortButton} onClick={handleDdToggle}>
            sort <Svg icon={ddInView ? 'chevronUp' : 'chevronDown'} />
          </div>
        </div>
      </div>
      {ddInView &&
        <InfoSort
          sort={sort}
          setSort={setSort}
          handleApply={handleApply}
          handleClear={handleClear}
        />
      }
    </>
  )
}
