import CollationItem from './CollationItem'
import css from './FeedSort.module.scss'

export default function FeedSort({ sort, setSort, handleApply, handleClear }) {
  function handleSortAdjust(event) {
    const id = event.currentTarget.id

    setSort(id)
  }

  return (
    <div className={css.collationDropDown}>
      <div className={css.collationHeading}><div>sort</div></div>
      <div className={css.collationGroup}>
        <CollationItem
          id='popularity'
          text='most popular'
          isChecked={sort === 'popularity'}
          onClick={handleSortAdjust}
        />
        <CollationItem
          id='rating'
          text='highest rated'
          isChecked={sort === 'rating'}
          onClick={handleSortAdjust}
        />
        <CollationItem
          id='date'
          text='newest'
          isChecked={sort === 'date'}
          onClick={handleSortAdjust}
        />
        <CollationItem
          id='priceascending'
          text='cheapest'
          isChecked={sort === 'priceascending'}
          onClick={handleSortAdjust}
        />
        <CollationItem
          id='pricedescending'
          text='most expensive'
          isChecked={sort === 'pricedescending'}
          onClick={handleSortAdjust}
        />
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
