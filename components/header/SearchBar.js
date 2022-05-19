import Svg from '../Svg'
import { useState, useEffect } from 'react'
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

    const newQuery = {
      ...router.query,
      str: searchString
    }

    router.push({
      pathname: '/search',
      query: newQuery
    })
  }

  return (
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
      <div className={css.icon}>
        <Svg icon='search' />
      </div>
    </form>
  )
}
