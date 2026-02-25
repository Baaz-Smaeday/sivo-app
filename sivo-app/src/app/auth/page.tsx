import { Suspense } from 'react'
import AuthForm from './AuthForm'

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-brand-muted text-sm">Loading...</div>
      </div>
    }>
      <AuthForm />
    </Suspense>
  )
}
