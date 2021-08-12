import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.scss'
import Layout from '../components/layout'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
