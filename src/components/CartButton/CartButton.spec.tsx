import { CartButton } from '.'
import { render, screen } from '@testing-library/react'

jest.mock('../../hooks/useCart.tsx', () => {
  return {
    useCart: () => ({
      totalCartItems: 3
    })
  }
})

describe('CartButton Component', () => {
  it('renders items on cart correctly', () => {
    render(<CartButton />)

    expect(screen.getByText('3')).toBeInTheDocument()
  })
})
