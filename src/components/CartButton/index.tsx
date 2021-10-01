import { FaShoppingCart } from 'react-icons/fa'
import styles from './styles.module.scss'

interface CartButtonProps {
  cartitems: number
}

export function CartButton({ cartitems }: CartButtonProps) {
  return (
    <button className={styles.cartButton}>
      <FaShoppingCart size="2.5rem" color="var(--cyan-500)" />
      {cartitems > 0 ? <span>{cartitems}</span> : ''}
    </button>
  )
}
