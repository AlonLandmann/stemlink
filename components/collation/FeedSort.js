import Svg from '../Svg'
import { useRouter } from 'next/router'
import css from './FeedSort.module.scss'

export default function FeedSort({ setSortIsActive, setDdInView }) {
  const router = useRouter()

  function applySort(event) {
    const newQuery = {
      ...router.query,
      sort: event.currentTarget.id
    }

    if (newQuery.sort === 'popularity') {
      setSortIsActive(false)
    } else {
      setSortIsActive(true)
    }

    setDdInView(null)

    router.push({
      pathname: '/search',
      query: newQuery
    })
  }

  return (
    <div className={css.dropDownArea}>
      <div>
        <div className={css.itemContainer}>
          <div id='popularity' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg
                icon={
                  !router.query.sort || router.query.sort === 'popularity'
                    ? 'checkboxChecked'
                    : 'checkboxEmpty'
                }
              />
            </div>
            <div>most popular</div>
          </div>
          <div id='rating' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort === 'rating' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>highest rated</div>
          </div>
          <div id='date' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort === 'date' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>newest</div>
          </div>
          <div id='priceascending' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort === 'priceascending' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>cheapest</div>
          </div>
          <div id='pricedescending' className={css.item} onClick={applySort}>
            <div className={css.icon}>
              <Svg icon={router.query.sort === 'pricedescending' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>most expensive</div>
          </div>
        </div>
      </div>
    </div>
  )
}
