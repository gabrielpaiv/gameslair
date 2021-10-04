import { Header } from '.'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/router'
import { mocked } from 'ts-jest/utils'

jest.mock('next/router')

describe('Header Component', () => {
  it('renders correctly when home', () => {
    const useRouterMocked = mocked(useRouter)

    useRouterMocked.mockReturnValueOnce({
      asPath: '/'
    } as any)

    render(<Header />)

    expect(screen.getByText('GamesLair')).toBeInTheDocument()
    expect(screen.getByLabelText('carticon')).toBeInTheDocument()
  })
  it('not render icon when on Cart', () => {
    const useRouterMocked = mocked(useRouter)

    useRouterMocked.mockReturnValueOnce({
      asPath: '/cart'
    } as any)

    render(<Header />)

    expect(screen.getByText('GamesLair')).toBeInTheDocument()
    expect(screen.queryByLabelText('carticon')).not.toBeInTheDocument()
  })
})
