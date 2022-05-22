import CollationItem from './CollationItem'
import css from './InfoSort.module.scss'

export default function InfoSort({ sort, setSort, handleApply, handleClear }) {
  function handleSortAdjust(event) {
    const id = event.currentTarget.id

    setSort(id)
  }

  return (
    <div className={css.collationDropDown}>
      <div className={css.collationHeading}><div>sort</div></div>
      <div className={css.collationGroup}>
        <CollationItem
          id='top'
          text='upvotes'
          isChecked={sort === 'top'}
          onClick={handleSortAdjust}
        />
        <CollationItem
          id='recent'
          text='recent'
          isChecked={sort === 'recent'}
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
