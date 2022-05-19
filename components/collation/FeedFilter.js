import Svg from '../Svg'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import css from './FeedFilter.module.scss'
import types from '../../lib/types'

export default function FeedFilter({ setFilterIsActive }) {
  const { data: session } = useSession()
  const router = useRouter()

  function applyPersonalFilter(event) {
    const saved = event.currentTarget.id === 'saved'
    const created = event.currentTarget.id === 'created'
    const prevSaved = router.query.saved || 'false'
    const prevCreated = router.query.created || 'false'

    const newQuery = {
      ...router.query,
      saved: saved ? (prevSaved === 'true' ? 'false' : 'true') : prevSaved,
      created: created ? (prevCreated === 'true' ? 'false' : 'true') : prevCreated
    }

    if (newQuery.saved === 'true' || newQuery.created === 'true') {
      setFilterIsActive(true)
    } else {
      setFilterIsActive(false)
    }

    router.push({
      pathname: '/search',
      query: newQuery
    })
  }
  function applyPriceFilter(event) {
    const price = event.currentTarget.id
    const prevFilter = router.query.price || 'all'
    const newQuery = {
      ...router.query,
      price: prevFilter !== price ? price : 'all'
    }

    if (newQuery.price === 'all' && (newQuery.types || 'all') === 'all') {
      setFilterIsActive(false)
    } else {
      setFilterIsActive(true)
    }

    router.push({
      pathname: '/search',
      query: newQuery
    })
  }
  function applyTypeFilter(event) {
    const type = event.currentTarget.id
    const prevFilter = router.query.types || 'all'

    let newQuery = { ...router.query }

    if (prevFilter === 'all') {
      newQuery.types = type
    } else {
      let array = prevFilter.split('-')

      if (array.length === 1) {
        if (array[0] === type) {
          newQuery.types = 'all'
        } else {
          array.push(type)
          newQuery.types = array.join('-')
        }
      } else {
        if (array.indexOf(type) > -1) {
          array.splice(array.indexOf(type), 1)
          newQuery.types = array.join('-')
        } else {
          array.push(type)
          newQuery.types = array.join('-')
        }
      }
    }

    if ((newQuery.price || 'all') === 'all' && newQuery.types === 'all') {
      setFilterIsActive(false)
    } else {
      setFilterIsActive(true)
    }

    router.push({
      pathname: '/search',
      query: newQuery
    })
  }

  return (
    <div className={css.dropDownArea}>
      <div>
        {session &&
          <>
            <div className={css.heading}><div>personal</div></div>
            <div className={css.itemContainer}>
              <div id='saved' className={css.item} onClick={applyPersonalFilter}>
                <div className={css.icon}>
                  <Svg icon={router.query.saved === 'true' ? 'checkboxChecked' : 'checkboxEmpty'} />
                </div>
                <div>saved</div>
              </div>
              <div id='created' className={css.item} onClick={applyPersonalFilter}>
                <div className={css.icon}>
                  <Svg icon={router.query.created === 'true' ? 'checkboxChecked' : 'checkboxEmpty'} />
                </div>
                <div>created</div>
              </div>
            </div>
          </>
        }
        <div className={css.heading}><div>price</div></div>
        <div className={css.itemContainer}>
          <div id='free' className={css.item} onClick={applyPriceFilter}>
            <div className={css.icon}>
              <Svg icon={router.query.price === 'free' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>free</div>
          </div>
          <div id='paid' className={css.item} onClick={applyPriceFilter}>
            <div className={css.icon}>
              <Svg icon={router.query.price === 'paid' ? 'checkboxChecked' : 'checkboxEmpty'} />
            </div>
            <div>paid</div>
          </div>
        </div>
        <div className={css.heading}><div>types</div></div>
        <div className={css.itemContainer}>
          {types.map(item => (
            <div key={item.type} id={item.type} className={css.item} onClick={applyTypeFilter}>
              <div className={css.icon}>
                <Svg
                  icon={
                    router.query.types &&
                    router.query.types !== 'all' &&
                    router.query.types.split('-').indexOf(item.type) > -1
                      ? 'checkboxChecked'
                      : 'checkboxEmpty'
                  }
                />
              </div>
              <div>{item.display}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
