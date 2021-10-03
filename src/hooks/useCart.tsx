import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react'
import { api } from '../services/api'
import { Game } from '../types/game'
import { toast } from 'react-toastify'

interface CartProviderProps {
  children: ReactNode
}

type UpdateProductAmount = {
  productId: number
  amount: number
}

type CartContextData = {
  cart: Game[]
  totalCartItems: number
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Game[]>([])

  async function getStorage() {
    const storagedCart = localStorage.getItem('@GamesLair:cart')

    if (storagedCart) {
      const parseCart = await JSON.parse(storagedCart)
      await setCart(parseCart)
      return
    }
    setCart([])
  }

  useEffect(() => {
    getStorage()
  }, [])

  const totalCartItems = cart.reduce((sumTotal, item) => {
    sumTotal += item.amount
    return sumTotal
  }, 0)

  async function addProduct(productId: number) {
    try {
      const updatedCart = [...cart]

      const productExists = updatedCart.find(
        product => product.id === productId
      )
      const currentAmount = productExists ? productExists.amount : 0
      const amount = currentAmount + 1

      if (productExists) {
        productExists.amount = amount
      } else {
        const { data } = await api.get<any>(`/products/${productId}`)
        const newProduct = {
          ...data,
          amount: 1
        }
        updatedCart.push(newProduct)
      }
      setCart(updatedCart)
      localStorage.setItem('@GamesLair:cart', JSON.stringify(updatedCart))
    } catch (error) {
      toast.error('Erro na adição do produto')
    }
  }

  function removeProduct(productId: number) {
    try {
      const updatedCart = [...cart]
      const productExists = updatedCart.findIndex(
        product => product.id === productId
      )
      if (productExists >= 0) {
        updatedCart.splice(productExists, 1)
        setCart(updatedCart)
        localStorage.setItem('@GamesLair:cart', JSON.stringify(updatedCart))
      } else {
        throw Error()
      }
    } catch {
      toast.error('Erro na remoção do produto')
    }
  }

  async function updateProductAmount({
    productId,
    amount
  }: UpdateProductAmount) {
    try {
      if (amount === 0) {
        return
      }
      var updatedAmount = [...cart]
      const productExists = updatedAmount.find(
        product => product.id === productId
      )
      if (productExists) {
        productExists.amount = amount
        setCart(updatedAmount)
        localStorage.setItem('@GamesLair:cart', JSON.stringify(updatedAmount))
      } else {
        throw Error()
      }
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        totalCartItems,
        addProduct,
        removeProduct,
        updateProductAmount
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)
  return context
}
