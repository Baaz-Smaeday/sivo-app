import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-gold rounded flex items-center justify-center">
                <span className="text-brand-bg font-serif font-bold">S</span>
              </div>
              <span className="text-white font-bold tracking-[3px] text-sm">SIVO</span>
            </div>
            <p className="text-xs text-brand-muted leading-relaxed">
              Premium Indian-crafted furniture for UK trade buyers. Direct sourcing, exceptional quality, genuine wholesale pricing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-muted mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/catalog" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">Collection</Link>
              <Link href="/about" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">Why SIVO</Link>
              <Link href="/how-to-order" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">How to Order</Link>
              <Link href="/trade-terms" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">Trade Terms</Link>
            </div>
          </div>

          {/* Trade */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-muted mb-4">Trade</h4>
            <div className="space-y-2">
              <Link href="/auth?tab=register" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">Apply for Trade Account</Link>
              <Link href="/auth?tab=login" className="block text-sm text-brand-text hover:text-brand-gold transition-colors">Trade Login</Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-semibold tracking-[1.5px] uppercase text-brand-muted mb-4">Contact</h4>
            <div className="space-y-2 text-sm text-brand-muted">
              <p>trade@sivohome.com</p>
              <p>Leeds, United Kingdom</p>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-brand-muted tracking-wider">
            © {new Date().getFullYear()} SIVO HOME LTD · UK Registered
          </p>
          <div className="flex gap-4 text-[10px] text-brand-muted tracking-wider">
            <span>HMRC Compliant</span>
            <span>·</span>
            <span>UK Fire Safety</span>
            <span>·</span>
            <span>FSC Where Applicable</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
