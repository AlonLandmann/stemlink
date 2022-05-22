import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import css from './MenuHeader.module.scss'

export default function MenuHeader({ handleDdmToggle }) {
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
      <div className={css.link} onClick={handleLinkToTop}>top</div>
      {session &&
        <>
          <div className={css.link} onClick={handleLinkToSaved}>saved</div>
          <div className={css.link} onClick={handleLinkToCreated}>my links</div>
          <div className={css.link} onClick={handleLinkToNew}>upload</div>
          <div className={css.image} onClick={handleDdmToggle}>
            <Image
              src={session.user.image}
              alt='profile picture'
              width={24}
              height={24}
            />
          </div>
        </>
      }
      {!session &&
        <div className={css.link} onClick={signIn}>sign in</div>
      }
    </div>
  )
}
