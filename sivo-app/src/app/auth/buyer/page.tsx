import { Suspense } from 'react'
import AutoLogin from '../AutoLogin'

export default function BuyerLoginPage() {
  return <Suspense fallback={<div>Loading...</div>}><AutoLogin role="buyer" /></Suspense>
}
