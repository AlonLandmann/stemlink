import Image from 'next/image'
import { useRouter } from 'next/router'
import { useSession, signIn } from 'next-auth/react'
import css from './HeaderMenu.module.scss'

export default function HeaderMenu({ setDdmInView, toggleDdm }) {
  const { data: session } = useSession()
  const router = useRouter()

  function linkToTop() {
    setDdmInView(false)
    router.push(`${router.basePath}/search`)
  }
  function linkToSaved() {
    setDdmInView(false)
    router.push(`${router.basePath}/search?saved=true`)
  }
  function linkToCreated() {
    setDdmInView(false)
    router.push(`${router.basePath}/search?created=true`)
  }
  function linkToNew() {
    setDdmInView(false)
    router.push(`${router.basePath}/links/new`)
  }

  return (
    <div className={css.container}>
      <div className={css.link} onClick={linkToTop}>top</div>
      {session &&
        <>
          <div className={css.link} onClick={linkToSaved}>saved</div>
          <div className={css.link} onClick={linkToCreated}>my links</div>
          <div className={css.link} onClick={linkToNew}>upload</div>
          <div className={css.image} onClick={toggleDdm}>
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
