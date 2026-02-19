import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar, Phone, MapPin, ArrowRight, Instagram, Facebook } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import logoWhite from '../assets/img/logowhite.png'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close sidebar on route change
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { name: 'Shërbimet', href: '/services' },
    { name: 'Galeria', href: '/gallery' },
    { name: 'Rreth Nesh', href: '/about' },
    { name: 'Kontakti', href: '/contact' },
  ]

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-[#2596be]/95 backdrop-blur-md shadow-lg shadow-black/5 py-5'
          : 'bg-transparent py-5'
          }`}
        style={{ fontFamily: "'Outfit', sans-serif" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">

          {/* Logo — always white */}
          <Link to="/" className="z-50 relative flex items-center gap-2.5 group">
            <div className="h-12 w-12 flex items-center justify-center pointer-events-none">
              <img src={logoWhite} alt="Aldo Dent" width="56" height="56" className="w-14 h-14 object-contain" />
            </div>
            <span className="text-xl font-medium tracking-tight text-white">
              Aldo Dent
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 ${location.pathname === link.href
                  ? 'text-white'
                  : 'text-white/70 hover:text-white'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="tel:+38344231769"
              className="text-sm font-medium flex items-center gap-2 text-white/70 hover:text-white transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>044 231 769</span>
            </a>
            <Link to="/booking">
              <button className={`px-6 py-2.5 text-sm font-medium rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${scrolled
                ? 'bg-white text-[#2596be] hover:bg-teal-50 shadow-black/10'
                : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 shadow-transparent'
                }`}>
                Rezervo
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden z-50 relative p-2 text-white"
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <Motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </Motion.div>
              ) : (
                <Motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </Motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ─── MOBILE SIDEBAR ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Panel */}
            <Motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 350, damping: 35 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-[#1d7aa1] z-50 md:hidden flex flex-col overflow-hidden"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              {/* Sidebar Background Glow */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-30%] w-[300px] h-[300px] bg-teal-400/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[250px] h-[250px] bg-[#196384]/50 rounded-full blur-[60px]" />
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 z-20 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X size={24} />
              </button>

              {/* Sidebar Content */}
              <div className="relative z-10 flex flex-col h-full px-8 pt-28 pb-8">
                {/* Nav Links */}
                <div className="flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <Motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        to={link.href}
                        onClick={() => setIsOpen(false)}
                        className={`group flex items-center justify-between py-4 border-b border-white/10 transition-colors ${location.pathname === link.href
                          ? 'text-teal-300'
                          : 'text-white/80 hover:text-white'
                          }`}
                      >
                        <span className="text-2xl font-light">{link.name}</span>
                        <ArrowRight size={18} className="text-white/20 group-hover:text-teal-300 group-hover:translate-x-1 transition-all" />
                      </Link>
                    </Motion.div>
                  ))}
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Contact Info */}
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-5 mb-6"
                >
                  <a href="tel:+38344231769" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-teal-300 group-hover:bg-white/15 transition-colors">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold">Na Telefononi</p>
                      <p className="text-white font-medium">044 231 769</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/30 uppercase tracking-[0.15em] font-bold">Lokacioni</p>
                      <p className="text-white font-medium">Gjilan, Kosovë</p>
                    </div>
                  </div>
                </Motion.div>

                {/* CTA Button */}
                <Motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Link to="/booking" onClick={() => setIsOpen(false)}>
                    <button className="w-full py-4 bg-white text-[#2596be] font-medium rounded-2xl shadow-lg shadow-black/10 flex items-center justify-center gap-2.5 text-lg active:scale-[0.97] transition-transform">
                      <Calendar className="w-5 h-5" />
                      Rezervo Termin
                    </button>
                  </Link>
                </Motion.div>

                {/* Socials */}
                <Motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center gap-3 mt-6 pt-5 border-t border-white/10"
                >
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors" aria-label="Instagram">
                    <Instagram size={16} />
                  </a>
                  <a href="#" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors" aria-label="Facebook">
                    <Facebook size={16} />
                  </a>
                  <span className="ml-auto text-[10px] text-white/20 uppercase tracking-widest">© Aldo Dent</span>
                </Motion.div>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar