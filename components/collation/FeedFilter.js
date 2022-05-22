import CollationItem from './CollationItem'
import { useSession } from 'next-auth/react'
import css from './FeedFilter.module.scss'
import types from '../../lib/types'

export default function FeedFilter({ filters, setFilters, handleApply, handleClear }) {
  const { data: session } = useSession()

  function handlePersonalAdjust(event) {
    const id = event.currentTarget.id

    setFilters(prevFilters => ({
      ...prevFilters,
      saved: id === 'saved' ? (!prevFilters.saved) : prevFilters.saved,
      created: id === 'created' ? (!prevFilters.created) : prevFilters.created
    }))
  }
  function handlePriceAdjust(event) {
    const id = event.currentTarget.id

    setFilters(prevFilters => ({
      ...prevFilters,
      price: prevFilters.price !== id ? id : 'all'
    }))
  }
  function handleTypeAdjust(event) {
    const id = event.currentTarget.id
    const index = filters.types.indexOf(id)
    const wasActive = index > -1

    setFilters(prevFilters => {
      const newFilters = { ...prevFilters }

      if (wasActive) {
        newFilters.types.splice(index, 1)
      } else {
        newFilters.types.push(id)
      }

      return newFilters
    })
  }

  return (
    <div className={css.collationDropDown}>
      {session &&
        <>
          <div className={css.collationHeading}><div>personal</div></div>
          <div className={css.collationGroup}>
            <CollationItem
              id='saved'
              text='saved'
              isChecked={filters.saved}
              onClick={handlePersonalAdjust}
            />
            <CollationItem
              id='created'
              text='created'
              isChecked={filters.created}
              onClick={handlePersonalAdjust}
            />
          </div>
        </>
      }

      <div className={css.collationHeading}><div>price</div></div>
      <div className={css.collationGroup}>
        <CollationItem
          id='free'
          text='free'
          isChecked={filters.price === 'free'}
          onClick={handlePriceAdjust}
        />
        <CollationItem
          id='paid'
          text='paid'
          isChecked={filters.price === 'paid'}
          onClick={handlePriceAdjust}
        />
      </div>

      <div className={css.collationHeading}><div>types</div></div>
      <div className={css.collationGroup}>
        {types.map(item => (
          <CollationItem
            key={item.type}
            id={item.type}
            text={item.display}
            isChecked={filters.types.indexOf(item.type) > -1}
            onClick={handleTypeAdjust}
          />
        ))}
      </div>

      <div className={css.collationButtonContainer}>
        <div>
          <button onClick={handleApply}>Apply</button>
          <button onClick={handleClear}>Clear</button>
        </div>
      </div>
    </div>
  )
}
