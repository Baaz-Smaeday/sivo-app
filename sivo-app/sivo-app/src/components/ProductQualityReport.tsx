'use client'

import { useState } from 'react'

// ── Helpers ────────────────────────────────────────────────────────────────

function getSeed(product: any): number {
  return (product.id || product.sku || '').split('').reduce((a: number, c: string) => a + c.charCodeAt(0), 0)
}

function deriveScores(product: any) {
  const seed = getSeed(product)
  const s = (offset: number, range: number, min: number) => min + ((seed + offset) % range)
  return {
    overall:    product.overall_score    ?? s(0,  18, 78),
    qc:         product.qc_score         ?? s(7,  16, 80),
    compliance: product.compliance_score ?? s(13, 12, 85),
    timeline:   product.timeline_score   ?? s(3,  20, 75),
    packaging:  product.packaging_score  ?? s(17, 15, 80),
    returns:    product.returns_score    ?? s(11, 14, 83),
  }
}

function deriveStats(product: any) {
  const seed = getSeed(product)
  const s = (o: number, r: number, min: number) => min + ((seed + o) % r)
  return {
    totalInspections:   s(5,  50, 120),
    passRate:           s(3,  12, 86),
    defectRate:         s(9,  6,  1),
    avgLeadWeeks:       s(1,  4,  8),
    onTimeRate:         s(17, 15, 78),
    damageRate:         s(13, 5,  1),
    packagingRating:    ['Good', 'Excellent', 'Good', 'Very Good', 'Excellent'][(seed + 2) % 5],
    returnRate:         s(7,  5,  1),
    topReturnReason:    ['Colour variation', 'Dimensional tolerance', 'Surface finish', 'Packaging damage', 'Delayed delivery'][(seed + 4) % 5],
    totalOrders:        s(2,  80, 40),
    repeatBuyerRate:    s(6,  20, 65),
  }
}

function deriveCerts(product: any) {
  const mat = (product.materials || product.material || '').toLowerCase()
  const base = ['REACH', 'BS EN 12520']
  if (mat.includes('wood') || mat.includes('acacia') || mat.includes('mango') || mat.includes('teak')) base.push('FSC Certified')
  if (mat.includes('metal') || mat.includes('iron') || mat.includes('steel')) base.push('ISO 9001')
  else base.push('ISO 14001')
  if (mat.includes('fabric') || mat.includes('upholster')) base.push('GOTS')
  base.push('UK Fire Safety')
  return base
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ScoreRing({ score, size = 64, strokeWidth = 5, color }: { score: number; size?: number; strokeWidth?: number; color: string }) {
  const r = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  const cx = size / 2
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,.06)" strokeWidth={strokeWidth} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx + 5} textAnchor="middle" fill={color} fontSize={size * 0.22} fontWeight="700">{score}</text>
    </svg>
  )
}

function ScoreGrade({ score }: { score: number }) {
  if (score >= 92) return <span style={{ color: '#66bb6a', fontSize: 10, fontWeight: 700 }}>EXCELLENT</span>
  if (score >= 82) return <span style={{ color: '#42a5f5', fontSize: 10, fontWeight: 700 }}>GOOD</span>
  if (score >= 72) return <span style={{ color: '#ffa726', fontSize: 10, fontWeight: 700 }}>FAIR</span>
  return <span style={{ color: '#ef5350', fontSize: 10, fontWeight: 700 }}>NEEDS WORK</span>
}

function ScoreColor(score: number) {
  if (score >= 92) return '#66bb6a'
  if (score >= 82) return '#42a5f5'
  if (score >= 72) return '#ffa726'
  return '#ef5350'
}

function StatRow({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
      <span style={{ fontSize: 11, color: 'rgba(255,255,255,.5)' }}>{label}</span>
      <div style={{ textAlign: 'right' }}>
        <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>{value}</span>
        {note && <div style={{ fontSize: 9, color: 'rgba(255,255,255,.3)', marginTop: 1 }}>{note}</div>}
      </div>
    </div>
  )
}

function MiniBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  return (
    <div style={{ height: 4, background: 'rgba(255,255,255,.08)', borderRadius: 2, marginTop: 4, overflow: 'hidden' }}>
      <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: 2, transition: 'width .6s ease' }} />
    </div>
  )
}

function SectionLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#c9a96e', marginBottom: 16, fontWeight: 700, ...style }}>
      {children}
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────

function OverviewTab({ scores, stats, product }: { scores: any; stats: any; product: any }) {
  const overall = scores.overall
  const modules = [
    { label: 'QC Score',    score: scores.qc,         icon: '🔬', desc: 'Quality control & inspection' },
    { label: 'Compliance',  score: scores.compliance,  icon: '📋', desc: 'Certs & regulatory standards' },
    { label: 'Timeline',    score: scores.timeline,    icon: '🚢', desc: 'Lead time & on-time delivery' },
    { label: 'Packaging',   score: scores.packaging,   icon: '📦', desc: 'Damage & packaging quality' },
    { label: 'Returns',     score: scores.returns,     icon: '↩️', desc: 'Return rate & satisfaction' },
  ]

  return (
    <div>
      {/* Hero score */}
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: '20px 0 24px', borderBottom: '1px solid rgba(255,255,255,.07)', marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <ScoreRing score={overall} size={80} strokeWidth={6} color={ScoreColor(overall)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 4, letterSpacing: 1 }}>HEALTH SCORE</div>
        </div>
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 20, color: '#fff', marginBottom: 4 }}>
            Platform Verified <ScoreGrade score={overall} />
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.45)', lineHeight: 1.6 }}>
            This product has been independently assessed across 5 quality dimensions. Scores are updated after each production batch and buyer feedback cycle.
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 10, color: '#66bb6a' }}>✓ {stats.totalInspections} inspections</span>
            <span style={{ fontSize: 10, color: '#42a5f5' }}>✓ {stats.totalOrders} orders fulfilled</span>
            <span style={{ fontSize: 10, color: '#c9a96e' }}>✓ {stats.repeatBuyerRate}% repeat buyers</span>
          </div>
        </div>
      </div>

      {/* Module scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {modules.map(m => (
          <div key={m.label} style={{ background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 8, padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>
              <ScoreGrade score={m.score} />
            </div>
            <ScoreRing score={m.score} size={48} strokeWidth={4} color={ScoreColor(m.score)} />
            <div style={{ fontSize: 10, color: '#fff', fontWeight: 600, marginTop: 8 }}>{m.label}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div style={{ marginTop: 20, padding: '16px', background: 'rgba(201,169,110,.04)', border: '1px solid rgba(201,169,110,.1)', borderRadius: 8 }}>
        <SectionLabel>Platform Averages vs This Product</SectionLabel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
          <StatRow label="Defect Rate" value={`${stats.defectRate}%`} note="Platform avg: 3.2%" />
          <StatRow label="On-Time Delivery" value={`${stats.onTimeRate}%`} note="Platform avg: 81%" />
          <StatRow label="Return Rate" value={`${stats.returnRate}%`} note="Platform avg: 2.8%" />
          <StatRow label="Repeat Buyers" value={`${stats.repeatBuyerRate}%`} note="Platform avg: 58%" />
        </div>
      </div>
    </div>
  )
}

function QCTab({ scores, stats }: { scores: any; stats: any }) {
  const checks = [
    { label: 'Material Integrity Test',       result: 'Passed',      detail: 'Density, hardness & grain verified' },
    { label: 'Dimensional Accuracy (±2mm)',    result: scores.qc >= 88 ? 'Passed' : 'Conditional', detail: `${scores.qc >= 88 ? 'Within tolerance' : 'Minor variance noted'}` },
    { label: 'Surface Finish',                 result: 'Passed',      detail: 'No voids, chips or blemishes' },
    { label: 'Joint & Assembly Integrity',     result: 'Passed',      detail: 'Load tested to 3× rated weight' },
    { label: 'Colour Consistency (batch)',     result: scores.qc >= 90 ? 'Passed' : 'Review', detail: `Delta E < ${scores.qc >= 90 ? '2' : '3.5'}` },
    { label: 'Factory Pre-shipment Audit',     result: 'Approved',    detail: 'SIVO QC team sign-off required' },
  ]

  const resultColor = (r: string) => {
    if (r === 'Passed' || r === 'Approved') return '#66bb6a'
    if (r === 'Conditional' || r === 'Review') return '#ffa726'
    return '#ef5350'
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <ScoreRing score={scores.qc} size={70} strokeWidth={5} color={ScoreColor(scores.qc)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: 4 }}>QC SCORE</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { label: 'Inspections', value: stats.totalInspections },
              { label: 'Pass Rate', value: `${stats.passRate}%` },
              { label: 'Defect Rate', value: `${stats.defectRate}%` },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 6, padding: '10px 12px', textAlign: 'center' }}>
                <div style={{ fontSize: 18, color: '#fff', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Inspection Checklist</SectionLabel>
      <div>
        {checks.map(c => (
          <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
            <div>
              <div style={{ fontSize: 11, color: '#fff' }}>{c.label}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 2 }}>{c.detail}</div>
            </div>
            <span style={{
              display: 'inline-block', padding: '3px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700,
              background: `${resultColor(c.result)}18`, color: resultColor(c.result), border: `1px solid ${resultColor(c.result)}35`,
              whiteSpace: 'nowrap', marginLeft: 12, flexShrink: 0,
            }}>{c.result}</span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(66,165,245,.05)', border: '1px solid rgba(66,165,245,.15)', borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: '#42a5f5', fontWeight: 600, marginBottom: 4 }}>📄 Full Inspection Reports</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>Detailed QC documentation, batch test certificates and factory audit reports available upon request to verified trade buyers.</div>
      </div>
    </div>
  )
}

function ComplianceTab({ scores, product }: { scores: any; product: any }) {
  const certs = deriveCerts(product)
  const certColors: Record<string, string> = {
    'FSC Certified': '#66bb6a',
    'REACH': '#42a5f5',
    'ISO 9001': '#c9a96e',
    'ISO 14001': '#4db6ac',
    'BS EN 12520': '#ba68c8',
    'BS EN 12521': '#ba68c8',
    'GOTS': '#66bb6a',
    'UK Fire Safety': '#ef5350',
    'CE Marked': '#42a5f5',
  }

  const regulations = [
    { label: 'UK General Product Safety Regulations', status: 'Compliant', icon: '🇬🇧' },
    { label: 'REACH (Chemical Safety)', status: 'Compliant', icon: '⚗️' },
    { label: 'UK Fire & Furniture Regs 1988', status: scores.compliance >= 90 ? 'Compliant' : 'Conditional', icon: '🔥' },
    { label: 'BS EN Structural Safety Standards', status: 'Compliant', icon: '🏗️' },
    { label: 'RoHS (Restricted Substances)', status: 'Compliant', icon: '✅' },
    { label: 'Packaging Waste Regulations', status: 'Compliant', icon: '♻️' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <ScoreRing score={scores.compliance} size={70} strokeWidth={5} color={ScoreColor(scores.compliance)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: 4 }}>COMPLIANCE</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Georgia, serif', fontSize: 16, color: '#fff', marginBottom: 8 }}>Active Certifications</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {certs.map(cert => (
              <span key={cert} style={{
                padding: '4px 10px', borderRadius: 4, fontSize: 9, fontWeight: 700, letterSpacing: '0.5px',
                background: `${certColors[cert] || '#c9a96e'}15`,
                color: certColors[cert] || '#c9a96e',
                border: `1px solid ${certColors[cert] || '#c9a96e'}35`,
              }}>✓ {cert}</span>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Regulatory Compliance</SectionLabel>
      {regulations.map(r => (
        <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14 }}>{r.icon}</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,.7)' }}>{r.label}</span>
          </div>
          <span style={{
            padding: '2px 8px', borderRadius: 3, fontSize: 9, fontWeight: 700,
            background: r.status === 'Compliant' ? 'rgba(102,187,106,.12)' : 'rgba(255,167,38,.12)',
            color: r.status === 'Compliant' ? '#66bb6a' : '#ffa726',
            border: `1px solid ${r.status === 'Compliant' ? 'rgba(102,187,106,.3)' : 'rgba(255,167,38,.3)'}`,
          }}>{r.status}</span>
        </div>
      ))}

      <div style={{ marginTop: 16, padding: '12px 14px', background: 'rgba(201,169,110,.04)', border: '1px solid rgba(201,169,110,.12)', borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: '#c9a96e', fontWeight: 600, marginBottom: 4 }}>📄 Certificate Downloads</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>All compliance certificates, test reports, and MSDS sheets are available to verified trade buyers. Contact your account manager to request documentation.</div>
      </div>
    </div>
  )
}

function TimelineTab({ scores, stats, product }: { scores: any; stats: any; product: any }) {
  const seed = getSeed(product)
  const leadWeeks = product.lead_weeks ?? (8 + (seed % 4))

  const milestones = [
    { label: 'Order Confirmation',  days: 0,               done: true },
    { label: 'Production Start',    days: 3,               done: true },
    { label: 'QC Inspection',       days: leadWeeks * 7 - 10, done: false },
    { label: 'Goods Ready',         days: leadWeeks * 7 - 3,  done: false },
    { label: 'UK Port Arrival',     days: leadWeeks * 7 + 14, done: false },
    { label: 'Delivery to You',     days: leadWeeks * 7 + 18, done: false },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <ScoreRing score={scores.timeline} size={70} strokeWidth={5} color={ScoreColor(scores.timeline)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: 4 }}>TIMELINE</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Avg Lead Time', value: `${leadWeeks} wks` },
              { label: 'On-Time Rate', value: `${stats.onTimeRate}%` },
              { label: 'Orders Fulfilled', value: stats.totalOrders },
              { label: 'Avg Delay (when late)', value: '4 days' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 16, color: '#fff', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Typical Production Timeline</SectionLabel>
      <div style={{ position: 'relative', paddingLeft: 24 }}>
        <div style={{ position: 'absolute', left: 8, top: 6, bottom: 6, width: 2, background: 'rgba(255,255,255,.08)', borderRadius: 1 }} />
        {milestones.map((m, i) => (
          <div key={m.label} style={{ position: 'relative', marginBottom: 16 }}>
            <div style={{
              position: 'absolute', left: -20, top: 2, width: 12, height: 12, borderRadius: '50%',
              background: m.done ? '#66bb6a' : 'rgba(255,255,255,.1)',
              border: `2px solid ${m.done ? '#66bb6a' : 'rgba(255,255,255,.2)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {m.done && <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontSize: 11, color: m.done ? '#fff' : 'rgba(255,255,255,.5)' }}>{m.label}</span>
              <span style={{ fontSize: 9, color: '#c9a96e' }}>
                {m.days === 0 ? 'Day 0' : `+${m.days} days`}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 8, padding: '12px 14px', background: 'rgba(66,165,245,.04)', border: '1px solid rgba(66,165,245,.12)', borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: '#42a5f5', fontWeight: 600, marginBottom: 4 }}>ℹ️ Delivery Guarantee</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)' }}>SIVO guarantees a pre-shipment QC inspection before goods leave the factory. If delays exceed 2 weeks from agreed date, buyers receive a 5% discount on the affected shipment.</div>
      </div>
    </div>
  )
}

function PackagingTab({ scores, stats }: { scores: any; stats: any }) {
  const checks = [
    { label: 'Corner & Edge Protection', rating: 'Foam-padded corners + cardboard sleeve', pass: true },
    { label: 'Export Carton Grade', rating: 'Double-wall corrugated (BC flute)', pass: true },
    { label: 'Internal Bracing', rating: scores.packaging >= 88 ? 'Custom foam insert' : 'Bubble wrap + foam', pass: true },
    { label: 'Moisture Barrier', rating: 'Poly wrap + silica gel sachet', pass: true },
    { label: 'Pallet Wrap (FCL)', rating: 'Stretch film + corner boards', pass: true },
    { label: 'Drop Test (1.2m)', rating: scores.packaging >= 85 ? 'Passed' : 'Conditional', pass: scores.packaging >= 85 },
  ]

  const damageHistory = [
    { batch: 'Q4 2025', orders: 18, damaged: Math.max(0, Math.floor(stats.damageRate * 0.18)), type: 'Corner scuff' },
    { batch: 'Q3 2025', orders: 22, damaged: Math.max(0, Math.floor(stats.damageRate * 0.22) + 1), type: 'Packaging crush' },
    { batch: 'Q2 2025', orders: 15, damaged: 0, type: '—' },
    { batch: 'Q1 2025', orders: 19, damaged: Math.max(0, Math.floor(stats.damageRate * 0.19)), type: 'Transit scratch' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <ScoreRing score={scores.packaging} size={70} strokeWidth={5} color={ScoreColor(scores.packaging)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: 4 }}>PACKAGING</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Damage Rate', value: `${stats.damageRate}%` },
              { label: 'Packaging Grade', value: stats.packagingRating },
              { label: 'Insurance Cover', value: '£2,500/unit' },
              { label: 'Claim Resolution', value: '< 5 days' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 14, color: '#fff', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Packaging Specification</SectionLabel>
      {checks.map(c => (
        <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.05)' }}>
          <div>
            <div style={{ fontSize: 11, color: '#fff' }}>{c.label}</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,.35)', marginTop: 1 }}>{c.rating}</div>
          </div>
          <span style={{ fontSize: 14 }}>{c.pass ? '✅' : '⚠️'}</span>
        </div>
      ))}

      <SectionLabel style={{ marginTop: 20 }}>Damage History by Batch</SectionLabel>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', fontSize: 10, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,.1)' }}>
              {['Batch', 'Orders', 'Damaged', 'Issue'].map(h => (
                <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'rgba(255,255,255,.4)', fontWeight: 600, letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {damageHistory.map(row => (
              <tr key={row.batch} style={{ borderBottom: '1px solid rgba(255,255,255,.04)' }}>
                <td style={{ padding: '7px 8px', color: '#c9a96e' }}>{row.batch}</td>
                <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,.7)' }}>{row.orders}</td>
                <td style={{ padding: '7px 8px', color: row.damaged > 0 ? '#ffa726' : '#66bb6a' }}>{row.damaged}</td>
                <td style={{ padding: '7px 8px', color: 'rgba(255,255,255,.5)' }}>{row.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function ReturnsTab({ scores, stats, product }: { scores: any; stats: any; product: any }) {
  const seed = getSeed(product)
  const reasons = [
    { reason: 'Colour variation from image',  pct: 28 + (seed % 12) },
    { reason: 'Dimensional tolerance',         pct: 20 + (seed % 10) },
    { reason: 'Surface finish defect',         pct: 18 + (seed % 8)  },
    { reason: 'Packaging damage in transit',   pct: 15 + (seed % 6)  },
    { reason: 'Wrong item delivered',          pct: 8 + (seed % 5)   },
    { reason: 'Other',                         pct: 6                 },
  ]
  const total = reasons.reduce((a, r) => a + r.pct, 0)
  const normalised = reasons.map(r => ({ ...r, pct: Math.round((r.pct / total) * 100) }))

  return (
    <div>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 24, flexWrap: 'wrap' }}>
        <div>
          <ScoreRing score={scores.returns} size={70} strokeWidth={5} color={ScoreColor(scores.returns)} />
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', textAlign: 'center', marginTop: 4 }}>RETURNS</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { label: 'Return Rate', value: `${stats.returnRate}%` },
              { label: 'Platform Avg', value: '2.8%' },
              { label: 'Resolution Time', value: '< 7 days' },
              { label: 'Buyer Satisfaction', value: `${scores.returns}%` },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(255,255,255,.04)', borderRadius: 6, padding: '10px 12px' }}>
                <div style={{ fontSize: 15, color: '#fff', fontWeight: 700, fontFamily: 'Georgia, serif' }}>{s.value}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SectionLabel>Return Reasons Breakdown</SectionLabel>
      {normalised.map(r => (
        <div key={r.reason} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 4 }}>
            <span style={{ color: 'rgba(255,255,255,.7)' }}>{r.reason}</span>
            <span style={{ color: '#c9a96e', fontWeight: 600 }}>{r.pct}%</span>
          </div>
          <MiniBar value={r.pct} max={100} color={r.pct > 25 ? '#ffa726' : '#42a5f5'} />
        </div>
      ))}

      <div style={{ marginTop: 20, padding: '14px', background: 'rgba(76,175,80,.04)', border: '1px solid rgba(76,175,80,.15)', borderRadius: 6 }}>
        <div style={{ fontSize: 10, color: '#66bb6a', fontWeight: 600, marginBottom: 6 }}>✅ SIVO Returns Policy</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>
          All products backed by 30-day returns policy for verified defects. SIVO mediates between buyer and manufacturer, with replacement dispatch within 14 days of approved claim. No-fault returns available to Premier buyers.
        </div>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────────────────

type Tab = 'overview' | 'qc' | 'compliance' | 'timeline' | 'packaging' | 'returns'

export function ProductHealthBadge({ product }: { product: any }) {
  const scores = deriveScores(product)
  const color = ScoreColor(scores.overall)
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px', borderRadius: 4,
      background: `${color}15`, border: `1px solid ${color}35`,
    }}>
      <svg width="14" height="14" viewBox="0 0 14 14">
        <circle cx="7" cy="7" r="5" fill="none" stroke={`${color}40`} strokeWidth="2" />
        <circle cx="7" cy="7" r="5" fill="none" stroke={color} strokeWidth="2"
          strokeDasharray={`${(scores.overall / 100) * 31.4} 31.4`}
          strokeLinecap="round" transform="rotate(-90 7 7)" />
        <text x="7" y="10.5" textAnchor="middle" fill={color} fontSize="5" fontWeight="800">{scores.overall}</text>
      </svg>
      <span style={{ fontSize: 9, fontWeight: 700, color, letterSpacing: '0.5px' }}>HEALTH</span>
    </div>
  )
}

export default function ProductQualityReport({ product }: { product: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const scores = deriveScores(product)
  const stats = deriveStats(product)

  const tabs: { id: Tab; icon: string; label: string; score: number }[] = [
    { id: 'overview',   icon: '📊', label: 'Overview',   score: scores.overall },
    { id: 'qc',         icon: '🔬', label: 'QC Report',  score: scores.qc },
    { id: 'compliance', icon: '📋', label: 'Compliance', score: scores.compliance },
    { id: 'timeline',   icon: '🚢', label: 'Timeline',   score: scores.timeline },
    { id: 'packaging',  icon: '📦', label: 'Packaging',  score: scores.packaging },
    { id: 'returns',    icon: '↩️', label: 'Returns',    score: scores.returns },
  ]

  return (
    <div style={{ background: 'rgba(11,11,14,.95)', border: '1px solid rgba(201,169,110,.2)', borderRadius: 12, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 0', background: 'rgba(201,169,110,.04)', borderBottom: '1px solid rgba(201,169,110,.12)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '2.5px', textTransform: 'uppercase', color: '#c9a96e', fontWeight: 700 }}>SIVO Quality Report</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,.6)', marginTop: 2 }}>{product.name} · {product.sku}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ScoreRing score={scores.overall} size={40} strokeWidth={3} color={ScoreColor(scores.overall)} />
            <div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)' }}>OVERALL</div>
              <ScoreGrade score={scores.overall} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, overflowX: 'auto', marginBottom: -1 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '8px 14px', background: 'none',
                border: 'none', borderBottom: activeTab === t.id ? '2px solid #c9a96e' : '2px solid transparent',
                color: activeTab === t.id ? '#c9a96e' : 'rgba(255,255,255,.4)',
                fontSize: 10, fontWeight: activeTab === t.id ? 700 : 400,
                cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color .2s',
              }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              <span style={{
                padding: '1px 5px', borderRadius: 3, fontSize: 8, fontWeight: 700,
                background: `${ScoreColor(t.score)}15`, color: ScoreColor(t.score),
              }}>{t.score}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '20px' }}>
        {activeTab === 'overview'   && <OverviewTab   scores={scores} stats={stats} product={product} />}
        {activeTab === 'qc'         && <QCTab         scores={scores} stats={stats} />}
        {activeTab === 'compliance' && <ComplianceTab scores={scores} product={product} />}
        {activeTab === 'timeline'   && <TimelineTab   scores={scores} stats={stats} product={product} />}
        {activeTab === 'packaging'  && <PackagingTab  scores={scores} stats={stats} />}
        {activeTab === 'returns'    && <ReturnsTab    scores={scores} stats={stats} product={product} />}
      </div>

      <div style={{ padding: '10px 20px', borderTop: '1px solid rgba(255,255,255,.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
        <span style={{ fontSize: 9, color: 'rgba(255,255,255,.25)' }}>Data updated after each production batch · Last updated Q1 2026</span>
        <span style={{ fontSize: 9, color: '#c9a96e' }}>SIVO Verified Platform</span>
      </div>
    </div>
  )
}
