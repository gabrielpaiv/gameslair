/* eslint-disable @next/next/link-passhref */
import { FaShoppingCart } from 'react-icons/fa'
import { useCart } from '../../hooks/useCart'
import styles from './styles.module.scss'
import Link from 'next/link'

export function CartButton() {
  const { totalCartItems } = useCart()

  return (
    <Link href="/cart">
      <button className={styles.cartButton}>
        <FaShoppingCart size="2.5rem" color="var(--cyan-500)" />
        {totalCartItems > 0 ? <span>{totalCartItems}</span> : ''}
      </button>
    </Link>
  )
}
