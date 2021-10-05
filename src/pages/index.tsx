/* eslint-disable @next/next/no-img-element */
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { FaCartPlus } from 'react-icons/fa'
import { useCart } from '../hooks/useCart'
import { api } from '../services/api'
import { Game } from '../types/game'
import { formatPrice } from '../utils/format'
import styles from './home.module.scss'

type GameFormatted = Game & {
  priceFormatted: string
}

export default function Home() {
  const [products, setProducts] = useState<GameFormatted[]>([])
  const [sortedBy, setSortedBy] = useState('')
  const [isAsc, setIsAsc] = useState(false)
  const { addProduct } = useCart()

  useEffect(() => {
    async function loadProducts() {
      await api.get<Game[]>('/products').then(data => {
        let formatted = data.data.map((item: Game) => {
          return {
            ...item,
            priceFormatted: formatPrice(item.price)
          }
        })
        setProducts(formatted)
      })
    }
    loadProducts()
  }, [])

  async function orderBy(by: string, asc: boolean) {
    if (by === sortedBy) {
      setIsAsc(!isAsc)
    } else {
      setIsAsc(true)
      setSortedBy(by)
    }
    await api
      .get<Game[]>(`/products?_sort=${by}&_order=${asc ? 'asc' : 'desc'}`)
      .then(data => {
        let orderedNFormatted = data.data.map((item: Game) => {
          return {
            ...item,
            priceFormatted: formatPrice(item.price)
          }
        })
        setProducts(orderedNFormatted)
      })
  }

  return (
    <>
      <Head>
        <title>GamesLair | Seu covil de jogos</title>
      </Head>

      <main className={styles.content}>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>
                <button onClick={() => orderBy('name', !isAsc)}>
                  Nome {sortedBy === 'name' ? (isAsc ? '↑' : '↓') : ''}
                </button>
              </th>
              <th>
                <button onClick={() => orderBy('price', !isAsc)}>
                  Preço {sortedBy === 'price' ? (isAsc ? '↑' : '↓') : ''}
                </button>
              </th>
              <th>
                <button onClick={() => orderBy('score', !isAsc)}>
                  Avaliação {sortedBy === 'score' ? (isAsc ? '↑' : '↓') : ''}
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id}>
                <td>
                  <img src={`/images/${product.image}`} alt={product.name} />
                </td>
                <td>
                  <h3>{product.name}</h3>
                </td>
                <td>
                  <h3>{product.priceFormatted}</h3>
                </td>
                <td>
                  <h3>{product.score}</h3>
                </td>
                <td>
                  <button
                    onClick={() => addProduct(product.id)}
                    data-testid="add-button"
                  >
                    <FaCartPlus size={40} color="var(--green-500)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}
