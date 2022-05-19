import css from './Loader.module.scss'

export default function Loader({ show }) {
  return show ? <div className={css.loader}></div> : null
}
