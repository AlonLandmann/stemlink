import Svg from '../Svg'
import { useRouter } from 'next/router'
import css from './ReviewSort.module.scss'

export default function ReviewSort({ setSortIsActive, setSortInView, resourceId }) {
  const router = useRouter()

  function applySort(event) {
    const newQuery = {
      ...router.query,
      sort: event.currentTarget.id
    }

    if (newQuery.sort !== 'top') {
      setSortIsActive(true)
    } else {
      setSortIsActive(false)
    }

    setSortInView(false)

    router.push({
      pathname: `/links/${resourceId}`,
      query: newQuery
    })
  }

  return (
    <div className={css.dropDownArea}>
      <div>
        <div className={css.itemContainer}>
          <div id='top' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort !== 'recent' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>upvotes</div>
          </div>
          <div id='recent' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort === 'recent' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>recent</div>
          </div>
        </div>
      </div>
    </div>
  )
}
