import AxiosMock from 'axios-mock-adapter'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { useCart, CartProvider } from './useCart'
import { renderHook, act } from '@testing-library/react-hooks'
import { waitFor } from '@testing-library/dom'

const apiMock = new AxiosMock(api)

jest.mock('react-toastify')

const mockedToastError = toast.error as jest.Mock
const mockedSetItemLocalStorage = jest.spyOn(Storage.prototype, 'setItem')
const initialStoragedData = [
  {
    id: 312,
    name: 'Super Mario Odyssey',
    price: 197.88,
    score: 100,
    image: 'super-mario-odyssey.png',
    amount: 1
  },
  {
    id: 201,
    name: 'Call Of Duty Infinite Warfare',
    price: 49.99,
    score: 80,
    image: 'call-of-duty-infinite-warfare.png',
    amount: 2
  }
]

describe('useCart Hook', () => {
  it('should be able to initialize cart if localStorage is empty', async () => {
    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitForNextUpdate({ timeout: 200 }).then(() => {
      expect(result.current.cart).toEqual(expect.arrayContaining([]))
    })
  })
  beforeEach(() => {
    apiMock.reset()

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(initialStoragedData))
  })

  it('should be able to initialize cart with localStorage value', async () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitFor(() => {
      return expect(result.current.cart).toEqual(
        expect.arrayContaining([
          {
            id: 312,
            name: 'Super Mario Odyssey',
            price: 197.88,
            score: 100,
            image: 'super-mario-odyssey.png',
            amount: 1
          },
          {
            id: 201,
            name: 'Call Of Duty Infinite Warfare',
            price: 49.99,
            score: 80,
            image: 'call-of-duty-infinite-warfare.png',
            amount: 2
          }
        ])
      )
    })
  })

  it('should be able to add a new product', async () => {
    const productId = 12

    apiMock.onGet(`products/${productId}`).reply(200, {
      id: 12,
      name: 'Mortal Kombat XL',
      price: 69.99,
      score: 150,
      image: 'mortal-kombat-xl.png'
    })

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.addProduct(productId)
    })

    await waitFor(() => {
      return expect(result.current.cart).toEqual(
        expect.arrayContaining([
          {
            id: 312,
            name: 'Super Mario Odyssey',
            price: 197.88,
            score: 100,
            image: 'super-mario-odyssey.png',
            amount: 1
          },
          {
            id: 201,
            name: 'Call Of Duty Infinite Warfare',
            price: 49.99,
            score: 80,
            image: 'call-of-duty-infinite-warfare.png',
            amount: 2
          },
          {
            id: 12,
            name: 'Mortal Kombat XL',
            price: 69.99,
            score: 150,
            image: 'mortal-kombat-xl.png',
            amount: 1
          }
        ])
      )
    })
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@GamesLair:cart',
      JSON.stringify(result.current.cart)
    )
  })

  it('should not be able add a product that does not exist', async () => {
    const productId = 1

    apiMock.onGet(`products/${productId}`).reply(404)

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider
    })

    act(() => {
      result.current.addProduct(productId)
    })

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na adição do produto'
        )
      },
      { timeout: 200 }
    )
    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    )
  })

  it('should be able to increase a product amount when adding a product that already exists on cart', async () => {
    const productId = 312

    apiMock.onGet(`products/${productId}`).reply(200, {
      id: 312,
      name: 'Super Mario Odyssey',
      price: 197.88,
      score: 100,
      image: 'super-mario-odyssey.png'
    })

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })
    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.addProduct(productId)
    })

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 312,
          name: 'Super Mario Odyssey',
          price: 197.88,
          score: 100,
          image: 'super-mario-odyssey.png',
          amount: 2
        },
        {
          id: 201,
          name: 'Call Of Duty Infinite Warfare',
          price: 49.99,
          score: 80,
          image: 'call-of-duty-infinite-warfare.png',
          amount: 2
        }
      ])
    )
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@GamesLair:cart',
      JSON.stringify(result.current.cart)
    )
  })

  it('should be able to remove a product', async () => {
    const productId = 312

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.removeProduct(productId)
    })

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 201,
          name: 'Call Of Duty Infinite Warfare',
          price: 49.99,
          score: 80,
          image: 'call-of-duty-infinite-warfare.png',
          amount: 2
        }
      ])
    )
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@GamesLair:cart',
      JSON.stringify(result.current.cart)
    )
  })

  it('should not be able to remove a product that does not exist', async () => {
    const productId = 1

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.removeProduct(productId)
    })

    expect(mockedToastError).toHaveBeenCalledWith('Erro na remoção do produto')
    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    )
  })

  it('should be able to update a product amount', async () => {
    const productId = 201

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider
    })

    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.updateProductAmount(productId, 1)
    })

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: 312,
          name: 'Super Mario Odyssey',
          price: 197.88,
          score: 100,
          image: 'super-mario-odyssey.png',
          amount: 1
        },
        {
          id: 201,
          name: 'Call Of Duty Infinite Warfare',
          price: 49.99,
          score: 80,
          image: 'call-of-duty-infinite-warfare.png',
          amount: 1
        }
      ])
    )
    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@GamesLair:cart',
      JSON.stringify(result.current.cart)
    )
  })

  it('should not be able to update a product that does not exist', async () => {
    const productId = 1

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider
    })

    act(() => {
      result.current.updateProductAmount(productId, 3)
    })

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na alteração de quantidade do produto'
        )
      },
      { timeout: 200 }
    )

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    )
  })

  it('should not be able to update a product amount to a value smaller than 1', async () => {
    const productId = 201

    const { result, waitForNextUpdate, waitForValueToChange } = renderHook(
      useCart,
      {
        wrapper: CartProvider
      }
    )

    await waitForNextUpdate({ timeout: 200 })

    act(() => {
      result.current.updateProductAmount(productId, 0)
    })

    try {
      await waitForValueToChange(
        () => {
          return result.current.cart
        },
        { timeout: 50 }
      )
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      )
    } catch {
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      )
    }
  })
})
