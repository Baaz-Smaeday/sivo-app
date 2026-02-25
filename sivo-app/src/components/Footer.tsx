import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border)] mt-0" style={{ background: 'var(--navy)' }}>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[var(--gold)] rounded flex items-center justify-center">
                <span className="text-[var(--dark)] font-serif font-bold">S</span>
              </div>
              <span className="text-white font-bold tracking-[3px] text-sm">SIVO</span>
            </div>
            <p className="text-xs text-[var(--muted)] leading-relaxed">
              Premium Indian-crafted furniture for UK trade buyers. Direct sourcing, exceptional quality, genuine wholesale pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--muted)] mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/catalog" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Collection</Link>
              <Link href="/collections" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Signature Collections</Link>
              <Link href="/about" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Why SIVO</Link>
              <Link href="/how-to-order" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">How to Order</Link>
              <Link href="/trade-terms" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Trade Terms</Link>
            </div>
          </div>

          {/* Trade */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--muted)] mb-4">Trade</h4>
            <div className="space-y-2">
              <Link href="/auth?tab=register" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Apply for Trade Account</Link>
              <Link href="/auth?tab=login" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Trade Login</Link>
              <Link href="/trade-viewing" className="block text-sm text-[var(--txt)] hover:text-[var(--gold)] transition-colors">Book Trade Viewing</Link>
              <a href="https://heyzine.com/flip-book/a486532728.html" target="_blank" rel="noopener noreferrer"
                 className="block text-sm text-[var(--gold)] hover:text-[var(--gold-l)] transition-colors">
                📖 Digital Catalogue
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-[var(--muted)] mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <p>trade@sivohome.com</p>
              <p>Leeds, United Kingdom</p>
              <p className="text-xs mt-4">Mon–Fri: 9am – 5pm GMT</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-[var(--muted)] tracking-wider">
            © {new Date().getFullYear()} SIVO HOME LTD · UK Registered
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['HMRC Compliant', 'UK Fire Safety', 'REACH Compliant', 'FSC Where Applicable'].map(seal => (
              <span key={seal} className="sivo-seal-badge">{seal}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
