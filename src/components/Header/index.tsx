/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { CartButton } from '../CartButton'
import styles from './styles.module.scss'

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/images/logo.svg" alt="Logo" />
            <span>GamesLair</span>
          </a>
        </Link>
        <CartButton cartItens={0} />
      </div>
    </header>
  )
}
