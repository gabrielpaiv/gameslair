import { Footer } from '.'
import { render, screen } from '@testing-library/react'

describe('Footer Component', () => {
  it('renders correctly', () => {
    render(<Footer />)

    expect(
      screen.getByText('Made with 🦆 by Gabriel Paiva')
    ).toBeInTheDocument()
  })
})
