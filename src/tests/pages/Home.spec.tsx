import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import AxiosMock from 'axios-mock-adapter'
import { useCart } from '../../hooks/useCart'
import Home from '../../pages'
import { api } from '../../services/api'

const apiMock = new AxiosMock(api)
const mockedAddProduct = jest.fn()
const mockedUseCartHook = useCart as jest.Mock

jest.mock('../../hooks/useCart.tsx')

describe('Home Page', () => {
  beforeAll(() => {
    apiMock.onGet('products').reply(200, [
      {
        id: 312,
        name: 'Super Mario Odyssey',
        price: 197.88,
        score: 100,
        image: 'super-mario-odyssey.png'
      },
      {
        id: 201,
        name: 'Call Of Duty Infinite Warfare',
        price: 49.99,
        score: 80,
        image: 'call-of-duty-infinite-warfare.png'
      },
      {
        id: 102,
        name: 'The Witcher III Wild Hunt',
        price: 119.5,
        score: 250,
        image: 'the-witcher-iii-wild-hunt.png'
      }
    ])
  })

  beforeEach(() => {
    mockedUseCartHook.mockReturnValue({
      addProduct: mockedAddProduct
    })
  })

  it('render each product correctly', async () => {
    render(<Home />)
    await waitFor(() => {
      expect(screen.getByAltText('Super Mario Odyssey')).toBeInTheDocument()
      expect(
        screen.getByAltText('Call Of Duty Infinite Warfare')
      ).toBeInTheDocument()
      expect(
        screen.getByAltText('The Witcher III Wild Hunt')
      ).toBeInTheDocument()
    })
  })

  it('orders by name', () => {
    const { rerender, getByText } = render(<Home />)
    const nameButton = getByText('Nome')

    fireEvent.click(nameButton)

    rerender(<Home />)

    expect(getByText('Nome ↑')).toBeInTheDocument()

    fireEvent.click(nameButton)

    rerender(<Home />)

    expect(getByText('Nome ↓')).toBeInTheDocument()
  })
  it('orders by price', () => {
    const { rerender, getByText } = render(<Home />)
    const priceButton = getByText('Preço')

    fireEvent.click(priceButton)

    rerender(<Home />)

    expect(getByText('Preço ↑')).toBeInTheDocument()

    fireEvent.click(priceButton)

    rerender(<Home />)

    expect(getByText('Preço ↓')).toBeInTheDocument()
  })
  it('orders by score', () => {
    const { rerender, getByText } = render(<Home />)
    const scoreButton = getByText('Avaliação')

    fireEvent.click(scoreButton)

    rerender(<Home />)

    expect(getByText('Avaliação ↑')).toBeInTheDocument()

    fireEvent.click(scoreButton)

    rerender(<Home />)

    expect(getByText('Avaliação ↓')).toBeInTheDocument()
  })
})
