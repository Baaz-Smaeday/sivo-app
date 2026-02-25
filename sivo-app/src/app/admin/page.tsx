import { Suspense } from 'react'
import AutoLogin from '../AutoLogin'

export default function AdminLoginPage() {
  return <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading...</div>}><AutoLogin role="admin" /></Suspense>
}
