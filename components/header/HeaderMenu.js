import { useRouter } from 'next/router'
import { useSession, signIn, signOut } from 'next-auth/react'
import css from './HeaderMenu.module.scss'

export default function HeaderMenu() {
  const { data: session } = useSession()
  const router = useRouter()

  function linkToTop() {
    router.push(`${router.basePath}/search`)
  }
  function linkToSaved() {
    router.push(`${router.basePath}/search?saved=true`)
  }
  function linkToCreated() {
    router.push(`${router.basePath}/search?created=true`)
  }
  function linkToNew() {
    router.push(`${router.basePath}/links/new`)
  }

  return (
    <div className={css.container}>
      <div onClick={linkToTop}>top</div>
      {session &&
        <>
          <div onClick={linkToSaved}>saved</div>
          <div onClick={linkToCreated}>created</div>
          <div onClick={linkToNew}>new</div>
          <div onClick={signOut}>sign out</div>
        </>
      }
      {!session &&
        <div onClick={signIn}>sign in</div>
      }
    </div>
  )
}
