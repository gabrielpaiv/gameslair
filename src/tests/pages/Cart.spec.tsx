import { render, fireEvent, waitFor } from '@testing-library/react'
import { useCart } from '../../hooks/useCart'
import Cart from '../../pages/cart'

const mockedRemoveProduct = jest.fn()
const mockedUpdateProductAmount = jest.fn()
const mockedUseCartHook = useCart as jest.Mock

jest.mock('../../hooks/useCart')

describe('Cart Page', () => {
  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
      cart: [
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
          amount: 3
        },
        {
          id: 12,
          name: 'Mortal Kombat XL',
          price: 69.99,
          score: 150,
          image: 'mortal-kombat-xl.png',
          amount: 1
        }
      ],
      removeProduct: mockedRemoveProduct,
      updateProductAmount: mockedUpdateProductAmount
    })
  })

  it('should be able to increase/decrease a product amount', async () => {
    const { getAllByTestId, rerender } = render(<Cart />)

    const [incrementFirstProduct] = getAllByTestId('increment-product')
    const [, decrementSecondProduct] = getAllByTestId('decrement-product')
    const [firstProductAmount, secondProductAmount] =
      getAllByTestId('product-amount')

    expect(firstProductAmount).toHaveTextContent('2')
    expect(secondProductAmount).toHaveTextContent('3')

    fireEvent.click(incrementFirstProduct)
    fireEvent.click(decrementSecondProduct)

    expect(mockedUpdateProductAmount).toHaveBeenCalledWith(312, 3)
    expect(mockedUpdateProductAmount).toHaveBeenCalledWith(201, 2)
  })

  it('should not be able to decrease a product amount when value is 1', () => {
    const { getAllByTestId } = render(<Cart />)

    const [, , decrementThirdProduct] = getAllByTestId('decrement-product')
    const [, , thirdProductAmount] = getAllByTestId('product-amount')

    expect(thirdProductAmount).toHaveTextContent('1')

    fireEvent.click(decrementThirdProduct)

    expect(decrementThirdProduct).toHaveProperty('disabled')
  })

  it('should be able to remove a product', () => {
    const { getAllByTestId, rerender } = render(<Cart />)

    const [removeFirstProduct] = getAllByTestId('remove-product')
    const [firstProduct, secondProduct, thirdProduct] =
      getAllByTestId('product')

    expect(firstProduct).toBeInTheDocument()
    expect(secondProduct).toBeInTheDocument()
    expect(thirdProduct).toBeInTheDocument()

    fireEvent.click(removeFirstProduct)

    expect(mockedRemoveProduct).toHaveBeenCalledWith(312)

    mockedUseCartHook.mockReturnValueOnce({
      cart: [
        {
          id: 201,
          name: 'Call Of Duty Infinite Warfare',
          price: 49.99,
          score: 80,
          image: 'call-of-duty-infinite-warfare.png',
          amount: 3
        },
        {
          id: 12,
          name: 'Mortal Kombat XL',
          price: 69.99,
          score: 150,
          image: 'mortal-kombat-xl.png',
          amount: 1
        }
      ]
    })

    rerender(<Cart />)

    expect(firstProduct).not.toBeInTheDocument()
    expect(secondProduct).toBeInTheDocument()
    expect(thirdProduct).toBeInTheDocument()
  })
})
