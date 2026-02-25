import { Suspense } from 'react'
import AdminClient from './AdminClient'

export default function AdminPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>Loading...</div>}>
      <AdminClient />
    </Suspense>
  )
}
