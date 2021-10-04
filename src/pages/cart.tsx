/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '../hooks/useCart'
import { formatPrice } from '../utils/format'
import styles from './cart.module.scss'

export default function Cart() {
  const { cart, removeProduct, updateProductAmount, totalCartItems } = useCart()
  const [shipping, setShipping] = useState('R$ 0')
  const [subtotal, setSubtotal] = useState('R$ 0')
  const [total, setTotal] = useState('R$ 0')

  useEffect(() => {
    const calc = cart.reduce((sumAmount, product) => {
      sumAmount += product.price * product.amount
      return sumAmount
    }, 0)
    setSubtotal(formatPrice(calc))
    if (calc > 250) {
      setShipping('R$ 0')
      setTotal(formatPrice(calc))
    } else {
      const ship = totalCartItems * 10
      setShipping(formatPrice(ship))
      setTotal(formatPrice(calc + ship))
    }
  }, [cart])

  return (
    <>
      <Head>
        <title>GamesLair | Carrinho</title>
      </Head>
      <main className={styles.content}>
        <div className={styles.items}>
          <section className={styles.box}>
            <div className={styles.list}>
              <h2>Meu Carrinho</h2>
              {cart.length ? (
                <ul>
                  {cart.map(item => (
                    <li key={item.id}>
                      <img src={`/images/${item.image}`} alt={item.name} />
                      <h3>{item.name}</h3>
                      <div>
                        <h3>{formatPrice(item.price * item.amount)}</h3>
                        <h4>x{item.amount}</h4>
                      </div>
                      <div className={styles.actions}>
                        <button
                          onClick={() =>
                            updateProductAmount(item.id, item.amount + 1)
                          }
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            updateProductAmount(item.id, item.amount - 1)
                          }
                          disabled={item.amount === 1}
                        >
                          -
                        </button>
                        <button onClick={() => removeProduct(item.id)}>
                          Remover
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <Link href="/">
                  <a>Seu carrinho está vazio. Comece a comprar!</a>
                </Link>
              )}
            </div>
            <div className={styles.infos}>
              <div>
                <h5>Frete: {shipping}</h5>
                <h4>Subtotal: {subtotal}</h4>
                <h3>Total: {total}</h3>
              </div>
              <button
                onClick={() =>
                  alert(
                    'Itens Comprados' +
                      cart.map(item => {
                        return ` ${item.name} x ${item.amount}`
                      })
                  )
                }
              >
                Finalizar Compra
              </button>
            </div>
          </section>
          <footer>O frete é grátis para compras acima de R$250,00</footer>
        </div>
      </main>
    </>
  )
}
