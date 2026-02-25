import Link from 'next/link'

export default function TradeViewingPage() {
  return (
    <div className="pt-[80px]">
      <section className="section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="sub-label">Appointment Only</span>
            <h1 className="font-serif text-4xl sm:text-5xl text-white mt-2">SIVO Trade Viewing &amp; Appointments</h1>
            <div className="gold-line-center" />
            <p className="text-sm text-[var(--muted)] mt-4 max-w-lg mx-auto leading-relaxed">
              Personal product viewings for approved trade accounts. See the finish, assess the quality, and plan your collection — before you commit to a production order.
            </p>
          </div>

          {/* Viewing Types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {[
              {
                i: '📍',
                t: 'In-Person Viewing',
                d: 'Visit our showroom in Leeds to see products firsthand. Handle materials, check finishes, and discuss your requirements face-to-face.',
                details: 'By appointment · Leeds, UK',
              },
              {
                i: '💻',
                t: 'Virtual Viewing',
                d: 'HD video walkthrough of our current stock and samples. Screen-share our full catalogue. Discuss custom options in real-time.',
                details: 'Zoom · 30-45 minutes',
              },
              {
                i: '📦',
                t: 'Sample Service',
                d: 'Request physical samples delivered to your premises. Sample fee credited against your first confirmed production order.',
                details: 'UK delivery · Fee from £25/sample',
              },
            ].map(v => (
              <div key={v.t} className="card card-glow p-8 text-center">
                <div className="text-4xl mb-4">{v.i}</div>
                <h3 className="font-serif text-xl text-white mb-3">{v.t}</h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed mb-4">{v.d}</p>
                <div className="text-xs text-[var(--gold)]">{v.details}</div>
              </div>
            ))}
          </div>

          {/* What to Expect */}
          <div className="card p-8 mb-12">
            <h3 className="font-serif text-2xl text-white mb-6 text-center">What to Expect</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { n: '01', t: 'Book', d: 'Choose your preferred viewing type and time. We\'ll confirm within 24 hours.' },
                { n: '02', t: 'Prepare', d: 'Tell us what you\'re looking for — categories, price range, volumes, timeline.' },
                { n: '03', t: 'View', d: 'See products up close. Review materials, finishes, and construction quality.' },
                { n: '04', t: 'Plan', d: 'Get a personalised quote for your selection. No obligation to order.' },
              ].map(s => (
                <div key={s.n} className="text-center">
                  <div className="font-serif text-2xl text-[var(--gold)] mb-2">{s.n}</div>
                  <div className="font-semibold text-white text-sm mb-1">{s.t}</div>
                  <div className="text-xs text-[var(--muted)] leading-relaxed">{s.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h3 className="font-serif text-2xl text-white mb-3">Ready to Book a Viewing?</h3>
            <p className="text-sm text-[var(--muted)] mb-6 max-w-md mx-auto">
              Available to approved trade account holders. If you don&apos;t have an account yet, apply first — approval takes 1–2 working days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="mailto:trade@sivohome.com?subject=Trade Viewing Request" className="btn-gold text-sm tracking-wider uppercase">
                Request Viewing
              </a>
              <Link href="/auth?tab=register" className="btn-outline text-sm tracking-wider uppercase">
                Apply for Trade Account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
