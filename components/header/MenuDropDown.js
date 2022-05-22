import Svg from '../Svg'
import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import css from './MenuDropDown.module.scss'

export default function MenuDropDown() {
  const router = useRouter()
  const { data: session } = useSession()

  function handleLinkToTop() {
    window.location.replace(`${router.basePath}/feed`)
  }
  function handleLinkToSaved() {
    window.location.replace(`${router.basePath}/feed?saved=true`)
  }
  function handleLinkToCreated() {
    window.location.replace(`${router.basePath}/feed?created=true`)
  }
  function handleLinkToNew() {
    window.location.replace(`${router.basePath}/links/new`)
  }

  return (
    <div className={css.container}>
      <div className={css.item} onClick={handleLinkToTop}>
        <div className={css.icon}><Svg icon='top' /></div>
        <div>top links</div>
      </div>
      {session &&
        <>
          <div className={css.item} onClick={handleLinkToSaved}>
            <div className={css.icon}><Svg icon='saved' /></div>
            <div>saved links</div>
          </div>
          <div className={css.item} onClick={handleLinkToCreated}>
            <div className={css.icon}><Svg icon='created' /></div>
            <div>created links</div>
          </div>
          <div className={css.item} onClick={handleLinkToNew}>
            <div className={css.icon}><Svg icon='new' /></div>
            <div>create new link</div>
          </div>
          <div className={css.itemStayOnWideView} onClick={signOut}>
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
