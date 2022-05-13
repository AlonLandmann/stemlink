import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import css from './DropDownMenu.module.scss'

export default function DropDownMenu({ toggleDdm }) {
  const { data: session } = useSession()
  const router = useRouter()

  function linkToTop() {
    toggleDdm()
    window.location.replace(`${router.basePath}/search`)
  }
  function linkToSaved() {
    toggleDdm()
    window.location.replace(`${router.basePath}/search?saved=true`)
  }
  function linkToCreated() {
    toggleDdm()
    window.location.replace(`${router.basePath}/search?created=true`)
  }
  function linkToNew() {
    toggleDdm()
    router.push(`${router.basePath}/links/new`)
  }

  return (
    <div className={css.container}>
      <div className={css.item} onClick={linkToTop}>
        <div className={css.icon}><Svg icon='top' /></div>
        <div>top links</div>
      </div>
      {session &&
        <>
          <div className={css.item} onClick={linkToSaved}>
            <div className={css.icon}><Svg icon='saved' /></div>
            <div>saved links</div>
          </div>
          <div className={css.item} onClick={linkToCreated}>
            <div className={css.icon}><Svg icon='created' /></div>
            <div>created links</div>
          </div>
          <div className={css.item} onClick={linkToNew}>
            <div className={css.icon}><Svg icon='new' /></div>
            <div>create new link</div>
          </div>
          <div className={css.itemLarge} onClick={signOut}>
            <div className={css.icon}><Svg icon='signOut' /></div>
            <div>sign out</div>
          </div>
        </>
      }
      {!session &&
        <div className={css.item} onClick={signIn}>
          <div className={css.icon}><Svg icon='signIn' /></div>
          <div>sign in</div>
        </div>
      }
    </div>
  )
}
