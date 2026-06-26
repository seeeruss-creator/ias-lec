import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, usePresence } from 'motion/react'
import {
  ArrowRight,
  ArrowUpRight,
  Shield,
  Lock,
  Cpu,
  Users,
  Search,
  BookOpen,
  AlertTriangle,
  Plus,
} from 'lucide-react'
import { phasesReport, finalReportSections } from './reportData'

// ─── DATA ────────────────────────────────────────────────────────────────────

const phasesData = [
  {
    id: '01',
    name: 'Physical Security Breach',
    summary: 'CCTV blind spots, tailgating, and inadequate access controls allowed unauthorized facility entry.',
    icon: Shield,
  },
  {
    id: '02',
    name: 'Mobile Device & Data Handling',
    summary: 'Portable storage devices bypassed network security perimeters enabling silent data exfiltration.',
    icon: Cpu,
  },
  {
    id: '03',
    name: 'Personnel Security Failure',
    summary: 'Offboarding breakdown left active credentials and physical access for a resigned employee.',
    icon: Users,
  },
  {
    id: '04',
    name: 'Security Management Review',
    summary: 'Stale policies, absent audits, and untrained staff created systemic organizational vulnerabilities.',
    icon: Lock,
  },
  {
    id: '05',
    name: 'Digital Forensics Investigation',
    summary: 'Registry artifacts, access logs, and forensic imaging reconstructed the full incident timeline.',
    icon: Search,
  },
]

const findingsData = [
  {
    phase: 'Physical',
    icon: Shield,
    label: 'CCTV Blind Spots',
    detail: 'Cameras were poorly positioned, allowing the suspect to operate undetected in critical corridors leading to the server room.',
  },
  {
    phase: 'Physical',
    icon: Shield,
    label: 'Tailgating Exploit',
    detail: 'No mantraps or anti-tailgate barriers. Suspect followed authorized personnel through secure checkpoints undetected.',
  },
  {
    phase: 'Data',
    icon: Cpu,
    label: 'USB Exfiltration',
    detail: 'Personal unauthorized USB device connected to university workstation. Data transfer bypassed all network-level monitoring.',
  },
  {
    phase: 'Personnel',
    icon: Users,
    label: 'Active Credentials',
    detail: 'HR failed to notify IT upon resignation. Logical and physical access remained fully active for 14 days post-resignation.',
  },
  {
    phase: 'Management',
    icon: Lock,
    label: 'Policy Neglect',
    detail: 'Security policies were 3 years outdated. No audits scheduled. Staff not trained to challenge tailgating incidents.',
  },
  {
    phase: 'Forensics',
    icon: Search,
    label: 'Evidence Recovery',
    detail: 'Deleted files recovered from unallocated disk space. USB registry artifacts confirmed hardware identity and timestamp.',
  },
]

const timelineData = [
  { time: 'T–14 Days', label: 'Suspect Resigns', detail: 'HR fails to notify IT/Security. All access remains active.' },
  { time: '11:37 PM', label: 'Building Entry', detail: 'Active keycard used. Tailgating bypasses secondary controls to reach server room.' },
  { time: '11:42 PM', label: 'USB Connected', detail: 'Unauthorized personal drive inserted into university workstation.' },
  { time: '11:43 PM', label: 'Data Copied', detail: 'Admin privileges used to copy HR, faculty, and research data.' },
  { time: '11:58 PM', label: 'Cover-Up', detail: 'Documents deleted, browser history cleared, local logs wiped.' },
  { time: '8:45 AM', label: 'Anomaly Detected', detail: 'Security team flags log irregularities. Incident declared.' },
]

const recommendationsData = [
  { num: '01', title: 'Automated IAM for Onboarding/Offboarding', body: 'Eliminate the human-error element by automating access revocation immediately upon employee resignation or termination.' },
  { num: '02', title: 'Endpoint Data Loss Prevention (DLP)', body: 'Install software on all university workstations that restricts or entirely blocks the use of unapproved, unencrypted USB storage devices.' },
  { num: '03', title: 'Upgrade Physical Access to Critical Facilities', body: 'Retrofit the Data Center and Research Facility with anti-tailgating mantraps and multi-factor authentication (Badge + PIN/Biometric).' },
  { num: '04', title: 'Enforce the Principle of Least Privilege (PoLP)', body: 'Conduct an immediate audit of all user accounts. Revoke permanent administrator rights and implement a Privileged Access Management (PAM) system where admin rights are "checked out" only when strictly needed.' },
  { num: '05', title: 'Establish a Security Governance Committee', body: 'Create a committee comprising HR, IT, and University Administration to review security policies annually and ensure cross-departmental communication regarding security risks.' },
]

// ─── ANIMATION VARIANTS ──────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const letterBlock = {
  initial: { y: 120, opacity: 0 },
  animate: {
    y: 0,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

// ─── SCAN LINE TRANSITION IMAGE ──────────────────────────────────────────────

function ScanTransitionIcon({ PhaseIcon, active }: { PhaseIcon: React.ComponentType<{ size?: number; strokeWidth?: number }>, active: boolean }) {
  const [isPresent, safeToRemove] = usePresence()
  const [opacity, setOpacity] = useState(active ? 1 : 0)
  const frameRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)
  const duration = 600

  useEffect(() => {
    if (isPresent) {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const t = Math.min((ts - startRef.current) / duration, 1)
        const eased = 1 - Math.pow(1 - t, 3)
        setOpacity(eased)
        if (t < 1) frameRef.current = requestAnimationFrame(animate)
      }
      frameRef.current = requestAnimationFrame(animate)
    } else {
      const animate = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const t = Math.min((ts - startRef.current) / duration, 1)
        const eased = Math.pow(t, 2)
        setOpacity(1 - eased)
        if (t < 1) {
          frameRef.current = requestAnimationFrame(animate)
        } else {
          safeToRemove()
        }
      }
      startRef.current = null
      frameRef.current = requestAnimationFrame(animate)
    }
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [isPresent, safeToRemove])

  return (
    <div
      style={{ opacity, transition: 'none' }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <PhaseIcon size={80} strokeWidth={0.7} />
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePhase, setActivePhase] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredRec, setHoveredRec] = useState<number | null>(null)

  // Auto-cycle phases
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePhase((prev) => (prev + 1) % 5)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'Findings', href: '#findings' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Forensics', href: '#phases' },
    { label: 'Report', href: '#report' },
  ]

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative w-full overflow-x-hidden" style={{ background: '#fcfcfc', color: '#111' }}>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 1: HERO
      ════════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col overflow-hidden">

        {/* Subtle grid background */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(17,17,17,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(17,17,17,0.04) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Red accent stripe — top edge */}
        <div className="absolute top-0 left-0 right-0 h-[3px] z-50" style={{ background: '#c0392b' }} />

        {/* 1A: HEADER — USIU Logo SVG */}
        <motion.header
          className="relative pt-7 px-6 md:px-16 z-20"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          <motion.h1
            variants={{ animate: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
          >
            <svg
              viewBox="0 0 900 100"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
              style={{ fill: '#111' }}
            >
              {/* U */}
              <g transform="translate(0,0)">
                <motion.polygon variants={letterBlock} points="0,0 16,0 16,72 0,72" />
                <motion.polygon variants={letterBlock} points="196,0 212,0 212,72 196,72" />
                <motion.polygon variants={letterBlock} points="0,72 212,72 212,100 0,100" />
              </g>
              {/* S */}
              <g transform="translate(260,0)">
                <motion.polygon variants={letterBlock} points="0,0 200,0 200,16 0,16" />
                <motion.polygon variants={letterBlock} points="0,0 16,0 16,55 0,55" />
                <motion.polygon variants={letterBlock} points="0,42 200,42 200,58 0,58" />
                <motion.polygon variants={letterBlock} points="184,45 200,45 200,100 184,100" />
                <motion.polygon variants={letterBlock} points="0,84 200,84 200,100 0,100" />
              </g>
              {/* I */}
              <g transform="translate(520,0)">
                <motion.polygon variants={letterBlock} points="0,0 200,0 200,16 0,16" />
                <motion.polygon variants={letterBlock} points="93,16 107,16 107,84 93,84" />
                <motion.polygon variants={letterBlock} points="0,84 200,84 200,100 0,100" />
              </g>
              {/* U */}
              <g transform="translate(780,0)">
                <motion.polygon variants={letterBlock} points="0,0 14,0 14,72 0,72" />
                <motion.polygon variants={letterBlock} points="106,0 120,0 120,72 106,72" />
                <motion.polygon variants={letterBlock} points="0,72 120,72 120,100 0,100" />
              </g>
            </svg>
          </motion.h1>

          {/* 1B: SUB-NAV BAR */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)_auto_minmax(0,1fr)] items-start mt-8 gap-4 md:gap-6"
            variants={fadeUp}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            {/* Left: org info */}
            <div className="hidden md:block">
              <div
                className="text-[10px] leading-relaxed"
                style={{ fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111' }}
              >
                <div>University</div>
                <div>Security</div>
                <div>Investigation</div>
              </div>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-start pt-1 justify-center">
              <ArrowRight size={14} strokeWidth={1} style={{ color: '#aaa' }} />
            </div>

            {/* Center: tagline */}
            <div>
              <p
                className="leading-relaxed max-w-md"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#333' }}
              >
                Unauthorized access, data exfiltration
                <br />
                & insider threat analysis — Case #02:
                <br />
                Operation Insider Whack-A-Mole
              </p>
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-start pt-1 justify-center">
              <ArrowRight size={14} strokeWidth={1} style={{ color: '#aaa' }} />
            </div>

            {/* Nav links */}
            <div className="hidden md:flex flex-col gap-1.5">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="transition-all duration-200 hover:text-black hover:underline"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#333', textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Hamburger */}
            <button
              className="md:hidden flex flex-col items-end justify-center gap-[6px] w-8 h-8 z-[60] relative"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <span
                className="block bg-black transition-all duration-300"
                style={{
                  height: '1.5px',
                  width: isMobileMenuOpen ? '2rem' : '2rem',
                  transform: isMobileMenuOpen ? 'translateY(7.5px) rotate(45deg)' : 'none',
                }}
              />
              <span
                className="block bg-black transition-all duration-300"
                style={{
                  height: '1.5px',
                  width: isMobileMenuOpen ? '2rem' : '1.5rem',
                  transform: isMobileMenuOpen ? 'translateY(-7.5px) rotate(-45deg)' : 'none',
                }}
              />
            </button>
          </motion.div>
        </motion.header>

        {/* 1C: MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute top-[120px] left-0 right-0 z-40 border-b border-gray-200 shadow-xl px-6 py-8"
              style={{ background: '#fcfcfc' }}
            >
              <div className="flex flex-col gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#111', textDecoration: 'none' }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hero body — flex row keeps left & right columns from overlapping */}
        <div className="relative flex flex-col md:flex-row md:justify-between md:items-start flex-1 px-6 md:px-16 mt-12 md:mt-20 pb-28 md:pb-32 z-10 gap-10 md:gap-16">

        {/* 1E: LEFT SIDEBAR CONTENT */}
        <motion.div
          className="relative w-full md:w-[420px] md:flex-shrink-0"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.6 } } }}
        >
          {/* Section indicator */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-6"
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#888', letterSpacing: '0.1em' }}>01</span>
            <div style={{ width: '64px', height: '1.5px', background: 'rgba(17,17,17,0.15)' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#888', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Case File</span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            variants={fadeUp}
            transition={{ duration: 0.8 }}
            style={{ fontSize: 'clamp(2.8rem, 6vw, 5rem)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1, color: '#111' }}
          >
            INSIDER
            <br />
            THREAT
          </motion.h2>

          {/* Sub-label */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-4"
            style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#c0392b' }}
          >
            Operation Whack-A-Mole
          </motion.p>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-4"
            style={{ fontSize: '13px', color: '#555', lineHeight: 1.7, maxWidth: '280px' }}
          >
            A former employee breached physical barriers,
            <br />
            exfiltrated confidential data, and exploited
            <br />
            systemic gaps in access governance.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            variants={fadeUp}
            transition={{ duration: 0.7 }}
            className="mt-8"
          >
            <CtaButton onClick={() => scrollTo('report')} />
          </motion.div>
        </motion.div>

        {/* 1F: RIGHT SIDEBAR — Case stats */}
        <motion.div
          className="hidden md:flex flex-col gap-6 w-[200px] flex-shrink-0 md:pt-2"
          initial="initial"
          animate="animate"
          variants={{ animate: { transition: { staggerChildren: 0.15, delayChildren: 0.9 } } }}
        >
          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, color: '#111' }}>
              EX-EMPLOYEE
            </div>
            <div style={{ fontSize: '12px', color: '#666', lineHeight: 1.6, marginTop: '4px' }}>
              Former IT Administrator
              <br />
              Resigned: 14 days prior
            </div>
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.6 }} className="flex flex-col gap-3 mt-2">
            {[
              { label: 'Phases', value: '5' },
              { label: 'Data Stolen', value: '~18 GB' },
            ].map(({ label, value }) => (
              <div key={label}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#aaa' }}>{label}</div>
                <div style={{ fontSize: '13px', fontWeight: 500, marginTop: '2px' }}>{value}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp} transition={{ duration: 0.6 }}>
            <ViewDetailsButton onClick={() => scrollTo('phases')} />
          </motion.div>
        </motion.div>

        </div>

        {/* 1G: BOTTOM-LEFT SCROLL CUE */}
        <motion.div
          className="absolute bottom-10 left-10 md:left-16 hidden md:flex items-center gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <div
            className="flex items-center justify-center rounded-full border"
            style={{ width: '48px', height: '48px', borderColor: '#ddd' }}
          >
            <div className="flex gap-[4px]">
              <div style={{ width: '1px', height: '12px', background: '#888' }} />
              <div style={{ width: '1px', height: '12px', background: '#888' }} />
            </div>
          </div>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', fontWeight: 600 }}>
            Scroll to explore
          </span>
        </motion.div>

        {/* Severity badge */}
        <motion.div
          className="absolute bottom-10 right-6 md:right-16 hidden md:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#c0392b' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888' }}>
            Severity: Critical
          </span>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 2: INVESTIGATE OUR FINDINGS
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="overview" className="relative w-full bg-[#fcfcfc] flex flex-col z-20 pt-24 md:pt-32 pb-0 scroll-mt-8">

        {/* 2A: SECTION LABEL */}
        <motion.div
          className="flex items-center gap-3 px-6 md:px-16 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#aaa', letterSpacing: '0.1em' }}>[ 02 ]</span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#111', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
            Investigate Our Findings
          </span>
        </motion.div>

        {/* 2B: MAIN HEADING */}
        <motion.h2
          className="px-6 md:px-16 text-center mx-auto"
          style={{ fontSize: 'clamp(2rem, 4vw, 4.2rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.1, color: '#111', maxWidth: '1000px' }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          Uncovering how trust, access & policy failures
          <br className="hidden md:block" />
          let an insider walk out with the keys.
        </motion.h2>

        {/* 2C: FILTER PILLS */}
        <motion.div
          className="flex flex-wrap gap-3 md:gap-4 justify-center px-6 md:px-16 mt-10 mb-10 md:mb-24"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={{ animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } } }}
        >
          {[
            { icon: Shield, label: 'Physical' },
            { icon: Cpu, label: 'Data Breach' },
            { icon: Users, label: 'Personnel' },
            { icon: Lock, label: 'Governance' },
            { icon: BookOpen, label: 'Forensics' },
          ].map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all duration-300"
              style={{ borderColor: '#ddd', background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(4px)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#444', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.borderColor = '#111'
                el.style.background = '#111'
                el.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.borderColor = '#ddd'
                el.style.background = 'rgba(255,255,255,0.5)'
                el.style.color = '#444'
              }}
            >
              <Icon size={14} strokeWidth={2} />
              {label}
            </motion.button>
          ))}
        </motion.div>

        {/* 2D: Spacer for overlap */}
        <div className="min-h-[180px] md:min-h-[380px]" />

        {/* 2E: BOTTOM TEXT */}
        <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-8 md:pb-12 pointer-events-none">
          <div className="hidden md:flex justify-between">
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#bbb', fontWeight: 500 }}>
              WE DON'T JUST FIND BREACHES.
            </span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#bbb', fontWeight: 500 }}>
              CYBERSECURITY (C) 2026
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          SECTION 3: CASE INVESTIGATION (Dark)
      ════════════════════════════════════════════════════════════════════════ */}
      <section
        id="phases"
        className="relative w-full text-white flex flex-col z-30 scroll-mt-8"
        style={{ background: '#0a0a0a' }}
      >
        {/* Overlapping alert icon */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-0"
          style={{ top: 0 }}
          initial={{ y: '-55%', opacity: 0 }}
          whileInView={{ y: '-70%', opacity: 1 }}
          viewport={{ once: true, margin: '100px' }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        >
          <AlertTriangle
            size={380}
            strokeWidth={0.3}
            style={{ color: 'rgba(192,57,43,0.12)' }}
          />
        </motion.div>

        {/* 3B: HEADING AREA */}
        <div className="relative px-6 md:px-16 pt-24 md:pt-44 mb-12 md:mb-16 z-10">
          <div className="flex flex-col xl:flex-row justify-between gap-8 xl:gap-16">
            {/* Left heading */}
            <h2
              style={{ fontSize: 'clamp(1.8rem, 3.5vw, 4rem)', fontWeight: 500, letterSpacing: '-0.02em', lineHeight: 1.15, color: '#fff', maxWidth: '700px' }}
            >
              Documented across{' '}
              <span className="inline-flex gap-2 md:gap-3 align-middle mx-2 translate-y-[-2px]">
                {[Shield, Lock, Search].map((Icon, i) => (
                  <PhaseCircleIcon key={i} Icon={Icon} />
                ))}
              </span>
              {' '}five phases of breach & discovery.
            </h2>

            {/* Right tagline + pills */}
            <div className="flex flex-col gap-4 xl:w-[280px]">
              <p style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666', lineHeight: 1.8 }}>
                WE DON'T JUST LOG INCIDENTS
                <br />
                WE TRACE THE FULL THREAT LIFECYCLE
              </p>
              <div className="flex flex-wrap gap-2">
                {['Forensic', 'Verified', 'Actionable'].map((pill) => (
                  <button
                    key={pill}
                    className="px-4 py-1.5 rounded-full border transition-all duration-200"
                    style={{ borderColor: '#333', fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#888', cursor: 'pointer', background: 'transparent' }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget
                      el.style.background = '#fff'
                      el.style.color = '#111'
                      el.style.borderColor = '#fff'
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget
                      el.style.background = 'transparent'
                      el.style.color = '#888'
                      el.style.borderColor = '#333'
                    }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />

        {/* 3C: TWO-COLUMN PANEL */}
        <div className="flex flex-col md:flex-row z-10">

          {/* Left Panel — Phase Icon Viewer */}
          <div
            className="relative flex flex-col justify-between p-8 min-h-[360px] md:min-h-[480px] md:w-[35%] md:flex-shrink-0 border-b md:border-b-0 md:border-r"
            style={{ borderColor: '#1f1f1f' }}
          >

            {/* Top asterisk */}
            <div style={{ fontFamily: 'JetBrains Mono, monospace', color: '#333', fontSize: '18px', letterSpacing: '0.3em' }}>* * *</div>

            {/* Icon display */}
            <div className="relative flex-1 flex items-center justify-center" style={{ color: '#333', minHeight: '160px' }}>
              <AnimatePresence mode="wait">
                <ScanTransitionIcon
                  key={activePhase}
                  PhaseIcon={phasesData[activePhase].icon}
                  active={true}
                />
              </AnimatePresence>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-3">
              <div style={{ overflow: 'hidden', height: '18px' }}>
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activePhase}
                    initial={{ y: 18 }}
                    animate={{ y: 0 }}
                    exit={{ y: -18 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#666' }}
                  >
                    {String(activePhase + 1).padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span style={{ color: '#222', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px' }}>/</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#333' }}>05</span>
            </div>
          </div>

          {/* Right Panel — Phase list */}
          <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
            {/* Top bar */}
            <div
              className="flex justify-between items-center px-6 md:px-8 py-5"
              style={{ borderBottom: '1px solid #1f1f1f' }}
            >
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.15em' }}>
                Investigate the breach. Understand the failure.
              </span>
              <AnimatePresence mode="wait">
                <motion.span
                  key={activePhase}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c0392b', letterSpacing: '0.1em' }}
                >
                  Phase {phasesData[activePhase].id}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Phase list */}
            {phasesData.map((phase, idx) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(idx)}
                className="w-full text-left flex items-center justify-between px-6 md:px-8 py-6 md:py-7 transition-colors duration-300"
                style={{
                  borderBottom: '1px solid rgba(31,31,31,0.8)',
                  color: idx === activePhase ? '#fff' : '#333',
                  background: 'transparent',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (idx !== activePhase) (e.currentTarget).style.color = '#888'
                }}
                onMouseLeave={(e) => {
                  if (idx !== activePhase) (e.currentTarget).style.color = '#333'
                }}
              >
                <div className="flex items-start gap-4">
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em', marginTop: '6px' }}>
                    {phase.id}
                  </span>
                  <div>
                    <div style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)', fontWeight: 500, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                      {phase.name}
                    </div>
                    {idx === activePhase && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        style={{ fontSize: '12px', color: '#666', marginTop: '6px', lineHeight: 1.6, maxWidth: '420px' }}
                      >
                        {phase.summary}
                      </motion.p>
                    )}
                  </div>
                </div>
                <AnimatePresence>
                  {idx === activePhase && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <ArrowUpRight size={22} strokeWidth={1} style={{ color: '#666' }} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            ))}
          </div>
        </div>

        {/* ─── PHASE DETAIL REPORT ─────────────────────────────────────────── */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div id="report" className="px-6 md:px-16 py-16 md:py-20 z-10 scroll-mt-8">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>[ 03 ]</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Phase Investigation Report
            </span>
          </motion.div>

          <p className="mb-10 max-w-2xl" style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
            UNIVERSITY SECURITY INVESTIGATION UNIT (USIU) — CASE FILE #02: Operation Insider Whack-A-Mole.
            Incident Overview: Unauthorized access to restricted facilities and confidential data exfiltration by a former employee.
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePhase}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="border rounded-sm"
              style={{ borderColor: '#1f1f1f' }}
            >
              <div className="px-6 md:px-8 py-5 border-b" style={{ borderColor: '#1f1f1f' }}>
                <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c0392b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {phasesReport[activePhase].title}
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: '#1f1f1f' }}>
                {phasesReport[activePhase].sections.map((section, idx) => (
                  <div key={idx} className="px-6 md:px-8 py-6 md:py-7">
                    <h4 style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '10px' }}>
                      {idx + 1}. {section.heading}
                    </h4>
                    {section.body && (
                      <p style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>
                        {section.body}
                      </p>
                    )}
                    {section.bullets && (
                      <ul className="mt-2 space-y-2">
                        {section.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex gap-3" style={{ fontSize: '13px', color: '#777', lineHeight: 1.75 }}>
                            <span style={{ color: '#c0392b', flexShrink: 0 }}>—</span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ─── FINAL INVESTIGATION REPORT ──────────────────────────────────── */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div className="px-6 md:px-16 py-16 md:py-20 z-10">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>FINAL</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Security Investigation Report
            </span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">
            {finalReportSections.map((section, sIdx) => (
              <motion.div
                key={section.id}
                className="border rounded-sm p-6 md:p-8"
                style={{ borderColor: '#1f1f1f' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: sIdx * 0.08, duration: 0.5 }}
              >
                <h3 style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c0392b', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '16px' }}>
                  {sIdx + 1}. {section.title}
                </h3>
                <div className="space-y-4">
                  {section.items.map((item, iIdx) => (
                    <div key={iIdx}>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#ddd', marginBottom: '4px' }}>
                        {item.label}
                      </div>
                      <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
                        {item.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── INCIDENT TIMELINE ───────────────────────────────────────────── */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div id="timeline" className="px-6 md:px-16 py-16 md:py-20 z-10 scroll-mt-8">
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>[ 04 ]</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Incident Timeline
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ background: '#1f1f1f' }}>
            {timelineData.map((item, idx) => (
              <motion.div
                key={idx}
                className="p-6 md:p-8"
                style={{ background: '#0a0a0a' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <div className="flex items-start gap-4 mb-3">
                  <div
                    className="flex-shrink-0 flex items-center justify-center rounded-full"
                    style={{ width: '28px', height: '28px', border: '1px solid #333', marginTop: '2px' }}
                  >
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: '#555' }}>{String(idx + 1).padStart(2, '0')}</span>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#c0392b', letterSpacing: '0.15em', marginBottom: '4px' }}>
                      {item.time}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                      {item.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.6 }}>
                      {item.detail}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── KEY FINDINGS GRID ───────────────────────────────────────────── */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div id="findings" className="px-6 md:px-16 py-16 md:py-20 z-10 scroll-mt-8">
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>[ 05 ]</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Key Findings
            </span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {findingsData.map((finding, idx) => (
              <motion.div
                key={idx}
                className="p-6 border transition-colors duration-300 rounded-sm"
                style={{ borderColor: '#1f1f1f', background: 'transparent' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1f1f1f' }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <finding.icon size={16} strokeWidth={1} style={{ color: '#c0392b' }} />
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#555' }}>
                    {finding.phase}
                  </span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#fff', marginBottom: '8px' }}>
                  {finding.label}
                </div>
                <div style={{ fontSize: '12px', color: '#555', lineHeight: 1.7 }}>
                  {finding.detail}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ─── RECOMMENDATIONS ─────────────────────────────────────────────── */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div className="px-6 md:px-16 py-16 md:py-20 z-10">
          <motion.div
            className="flex items-center gap-3 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>[ 06 ]</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Top 5 Cybersecurity Recommendations
            </span>
          </motion.div>

          <div className="flex flex-col" style={{ border: '1px solid #1f1f1f' }}>
            {recommendationsData.map((rec, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col md:flex-row gap-4 md:gap-8 p-6 md:p-8 cursor-pointer transition-colors duration-200"
                style={{
                  borderBottom: idx < recommendationsData.length - 1 ? '1px solid #1f1f1f' : 'none',
                  background: hoveredRec === idx ? '#111' : 'transparent',
                }}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                onMouseEnter={() => setHoveredRec(idx)}
                onMouseLeave={() => setHoveredRec(null)}
              >
                <div
                  className="flex-shrink-0"
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#c0392b', letterSpacing: '0.1em', minWidth: '32px', paddingTop: '2px' }}
                >
                  {rec.num}
                </div>
                <div className="flex-1">
                  <div style={{ fontSize: '16px', fontWeight: 500, color: '#fff', marginBottom: '6px' }}>
                    {rec.title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
                    {rec.body}
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center">
                  <ArrowUpRight
                    size={18}
                    strokeWidth={1}
                    style={{ color: hoveredRec === idx ? '#fff' : '#2a2a2a', transition: 'color 0.2s' }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 3D: FOOTER */}
        <div style={{ height: '1px', background: '#1f1f1f' }} />
        <div
          className="px-6 md:px-16 py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          style={{ background: '#0a0a0a' }}
        >
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#333' }}>
            UNIVERSITY SECURITY INVESTIGATION UNIT — CASE #02
          </span>
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#333' }}>
            CLASSIFIED — FOR INTERNAL USE ONLY
          </span>
        </div>
      </section>
    </div>
  )
}

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function CtaButton({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)
  const [active, setActive] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative overflow-hidden rounded-md border flex items-center gap-3 px-6 py-3.5 transition-all duration-200"
      style={{
        background: '#1a1a1a',
        borderColor: '#1a1a1a',
        boxShadow: active
          ? 'none'
          : hovered
          ? '3px 3px 0px rgba(17,17,17,0.5)'
          : '0 1px 3px rgba(0,0,0,0.12)',
        transform: active ? 'none' : hovered ? 'translateY(-0.5px)' : 'none',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false) }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {/* Sliding bg panel */}
      <div
        className="absolute inset-0 transition-transform"
        style={{
          background: '#fcfcfc',
          transform: hovered ? 'translateX(0)' : 'translateX(-101%)',
          transitionDuration: '700ms',
          transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      {/* Shield icon */}
      <div className="relative z-10 transition-all duration-300" style={{ transform: hovered ? 'scale(1.1) translateY(-1px)' : 'none' }}>
        <Shield
          size={16}
          strokeWidth={1.5}
          style={{ color: hovered ? '#111' : '#fff', transition: 'color 0.3s' }}
        />
      </div>

      <span
        className="relative z-10 transition-colors duration-300"
        style={{ fontSize: '15px', fontWeight: 500, color: hovered ? '#111' : '#fff' }}
      >
        View Full Report
      </span>
    </button>
  )
}

function ViewDetailsButton({ onClick }: { onClick?: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="flex items-center gap-3 mt-4">
      <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center rounded-full border transition-all duration-200"
        style={{
          width: '40px',
          height: '40px',
          borderColor: hovered ? '#111' : '#aaa',
          background: hovered ? '#111' : 'transparent',
          cursor: 'pointer',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Plus
          size={16}
          strokeWidth={1.5}
          style={{ color: hovered ? '#fff' : '#555', transition: 'color 0.2s' }}
        />
      </button>
      <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700, color: '#888' }}>
        Case Details
      </span>
    </div>
  )
}

function PhaseCircleIcon({ Icon }: { Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) {
  const [hovered, setHovered] = useState(false)

  return (
    <span
      className="inline-flex items-center justify-center rounded-full border transition-all duration-200"
      style={{
        width: '40px',
        height: '40px',
        borderColor: hovered ? '#fff' : '#333',
        background: hovered ? '#fff' : '#111',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Icon
        size={16}
        strokeWidth={1.2}
      />
    </span>
  )
}
