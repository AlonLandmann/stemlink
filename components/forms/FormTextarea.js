import cce from '../../lib/cce'
import css from './FormTextarea.module.scss'

export default function FormInput({ id, label, placeholder, rows, value, onChange, error }) {
  return (
    <div>
      {error &&
        <div className={css.errorMessage}>
          {error}
        </div>
      }
      <div className={cce(error, css.inputGroup, css.hasError)}>
        <label htmlFor={id}>{label}</label>
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          autoComplete='off'
          rows={rows}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
