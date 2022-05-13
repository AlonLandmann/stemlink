import Svg from '../Svg'
import { useState } from 'react'
import { useRouter } from 'next/router'
import css from './SearchBar.module.scss'

export default function SearchBar() {
  const [searchString, setSearchString] = useState('')
  const router = useRouter()

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
