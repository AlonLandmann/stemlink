import cce from '../../lib/cce'
import css from './FormInput.module.scss'

export default function FormInput({ id, label, type, placeholder, value, onChange, error }) {
  return (
    <div>
      {error &&
        <div className={css.errorMessage}>
          {error}
        </div>
      }
      <div className={cce(error, css.inputGroup, css.hasError)}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          autoComplete='off'
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}
