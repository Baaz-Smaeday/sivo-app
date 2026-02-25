import { Suspense } from 'react'
import AutoLogin from '../AutoLogin'

export default function AdminLoginPage() {
  return <Suspense fallback={<div>Loading...</div>}><AutoLogin role="admin" /></Suspense>
}
