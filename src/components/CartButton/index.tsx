import { FaShoppingCart } from 'react-icons/fa'
import styles from './styles.module.scss'

interface CartButtonProps {
  cartItens: number
}

export function CartButton({ cartItens }: CartButtonProps) {
  return (
    <button className={styles.cartButton}>
      <FaShoppingCart size="2.5rem" color="var(--cyan-500)" />
      {cartItens > 0 ? <span>{cartItens}</span> : ''}
    </button>
  )
}
