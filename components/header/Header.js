import MenuDropDown from './MenuDropDown'
import MenuHeader from './MenuHeader'
import SearchBar from './SearchBar'
import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useState } from 'react'
import css from './Header.module.scss'

export default function Header() {
  const router = useRouter()
  const [ddmInView, setDdmInView] = useState(false)

  function handleLinkToHome() {
    setDdmInView(false)
    router.push('/')
  }
  function handleDdmToggle() {
    setDdmInView(prevDdmInView => !prevDdmInView)
  }

  return (
    <>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.logo} onClick={handleLinkToHome}>sl</div>
          <div className={css.logoWideView} onClick={handleLinkToHome}>Stemlink</div>
          <SearchBar />
          <MenuHeader handleDdmToggle={handleDdmToggle} />
          <div className={css.ddm} onClick={handleDdmToggle}>
            <Svg icon={ddmInView ? 'close' : 'ddm'} />
          </div>
        </div>
      </div>

      {ddmInView &&
        <MenuDropDown />
      }
    </>
  )
}
