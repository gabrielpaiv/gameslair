/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CartButton } from '../CartButton'
import styles from './styles.module.scss'

export function Header() {
  const { asPath } = useRouter()

  const isOnCart = asPath === '/cart' ? true : false

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/images/logo.svg" alt="Logo" />
            <span>GamesLair</span>
          </a>
        </Link>
        {!isOnCart && <CartButton />}
      </div>
    </header>
  )
}
