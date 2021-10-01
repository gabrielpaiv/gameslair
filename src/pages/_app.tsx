import { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import { Header } from '../components/Header'
import { CartProvider } from '../hooks/useCart'
import '../styles/global.scss'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <CartProvider>
      <Header />
      <Component {...pageProps} />
      <ToastContainer autoClose={3000} />
    </CartProvider>
  )
}

export default MyApp
