import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar, Phone, MapPin } from 'lucide-react'
import logoBlue from '../assets/img/logowhite.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect for glass background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Shërbimet', href: '#sherbimet' },
    { name: 'Galeria', href: '#galeria' },
    { name: 'Rreth Nesh', href: '#rreth-nesh' },
    { name: 'Kontakti', href: '#kontakti' },
  ]

  // Animation variants for mobile menu
  const sidebarVariants = {
    closed: { x: "100%", opacity: 0 },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const linkVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isOpen
          ? 'bg-white/95 backdrop-blur-md shadow-sm py-4'
          : 'bg-transparent py-6'
          }`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* --- LOGO --- */}
          <a href="#" className="z-50 relative flex items-center gap-2 group">
            {/* Logo Icon */}
            {/* Logo Icon */}
            <div className={`h-10 w-10 flex items-center justify-center pointer-events-none`}>
              <img src={logoBlue} alt="Aldo Dent" className="w-12 h-12 object-contain" />
            </div>
            <span className={`text-xl font-medium tracking-tight transition-colors duration-300 ${scrolled || isOpen ? 'text-slate-900' : 'text-white'
              }`}>
              Aldo Dent
            </span>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${scrolled ? 'text-slate-600 hover:text-[#009299]' : 'text-white/90 hover:text-white'
                  }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* --- DESKTOP CTA --- */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+38344000000"
              className={`text-sm font-medium flex items-center gap-2 transition-colors duration-300 ${scrolled ? 'text-slate-600 hover:text-[#009299]' : 'text-white/90 hover:text-white'
                }`}
            >
              <Phone className="w-4 h-4" />
              <span>+383 44 000 000</span>
            </a>
            <button className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${scrolled
              ? 'bg-[#009299] hover:bg-[#007a80] text-white shadow-[#009299]/20'
              : 'bg-white hover:bg-slate-100 text-[#009299] shadow-white/10'
              }`}>
              Rezervo
            </button>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`md:hidden z-50 relative p-2 transition-colors duration-300 ${scrolled || isOpen ? 'text-slate-800' : 'text-white'
              }`}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* --- MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={sidebarVariants}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col p-8 pt-28"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {/* Mobile Links */}
              <div className="flex flex-col gap-6 mb-10">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={linkVariants}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-light text-slate-800 hover:text-[#009299] transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Info & CTA */}
              <motion.div variants={linkVariants} className="mt-auto border-t border-slate-100 pt-8 space-y-6">

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 rounded-full bg-[#009299]/10 flex items-center justify-center text-[#009299]">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Na Telefononi</p>
                    <p className="font-medium text-slate-900 text-lg">+383 44 123 456</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-600">
                  <div className="w-12 h-12 rounded-full bg-[#009299]/10 flex items-center justify-center text-[#009299]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">Lokacioni</p>
                    <p className="font-medium text-slate-900 text-lg">Prishtinë, Kosovë</p>
                  </div>
                </div>

                <button className="w-full py-4 bg-[#009299] text-white font-medium rounded-xl shadow-lg shadow-[#009299]/30 flex items-center justify-center gap-2 text-lg active:scale-95 transition-transform">
                  <Calendar className="w-5 h-5" />
                  Rezervo Termin
                </button>
              </motion.div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar