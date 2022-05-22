import Svg from '../Svg'
import { useState } from 'react'
import { useRouter } from 'next/router'
import css from './SearchBar.module.scss'

export default function SearchBar() {
  const router = useRouter()
  const [searchString, setSearchString] = useState(router.query.str || '')

  function handleChange(event) {
    setSearchString(event.target.value)
  }
  function handleSubmit(event) {
    event.preventDefault()

    if (router.query.id) {
      delete router.query.sort
    }

    window.location.replace([
      '/feed',
      `?str=${searchString || ''}`,
      `&saved=${router.query.saved || 'false'}`,
      `&created=${router.query.created || 'false'}`,
      `&price=${router.query.price || 'all'}`,
      `&types=${router.query.types || '' }`,
      `&sort=${router.query.sort || 'popularity'}`
    ].join(''))
  }

  return (
    <div className={css.searchBar}>
      <form className={css.container} onSubmit={handleSubmit}>
        <div className={css.input}>
          <input
            name='searchString'
            type='text'
            placeholder='search for links'
            autoComplete='off'
            spellCheck='false'
            value={searchString}
            onChange={handleChange}
          />
        </div>
        <div className={css.icon}><Svg icon='search' /></div>
      </form>
    </div>
  )
}
