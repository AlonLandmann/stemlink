import DropDownMenu from './DropDownMenu'
import HeaderMenu from './HeaderMenu'
import SearchBar from './SearchBar'
import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import css from './Header.module.scss'

export default function Header() {
  const [ddmInView, setDdmInView] = useState(false)
  const router = useRouter()

  function linkToHome() {
    setDdmInView(false)
    router.push('/')
  }
  function toggleDdm() {
    setDdmInView(prevDdmInView => !prevDdmInView)
  }

  return (
    <>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.logo} onClick={linkToHome}>sl</div>
          <div className={css.logoLarge} onClick={linkToHome}>Stemlink</div>
          <div className={css.searchBar}>
            <SearchBar />
          </div>
          <HeaderMenu setDdmInView={setDdmInView} toggleDdm={toggleDdm} />
          <div className={css.ddm} onClick={toggleDdm}>
            <Svg icon={ddmInView ? 'close' : 'ddm'} />
          </div>
        </div>
      </div>

      {ddmInView && <DropDownMenu toggleDdm={toggleDdm} />}
    </>
  )
}
