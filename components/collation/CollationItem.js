import Svg from '../Svg'
import css from './CollationItem.module.scss'

export default function CollationItem({ id, text, isChecked, onClick }) {
  return (
    <div id={id} className={css.collationItem} onClick={onClick}>
      <div className={css.icon}>
        <Svg icon={isChecked ? 'checkboxChecked' : 'checkboxEmpty'} />
      </div>
      <div>{text}</div>
    </div>
  )
}
