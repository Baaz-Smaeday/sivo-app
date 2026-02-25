import { Suspense } from 'react'
import AutoLogin from '../AutoLogin'

export default function SupplierLoginPage() {
  return <Suspense fallback={<div>Loading...</div>}><AutoLogin role="supplier" /></Suspense>
}
