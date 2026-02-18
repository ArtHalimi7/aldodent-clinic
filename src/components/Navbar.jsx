import React, { useState, useEffect } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Calendar, Phone, MapPin } from 'lucide-react'

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || isOpen 
            ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          {/* --- LOGO --- */}
          <a href="#" className="z-50 relative flex items-center gap-2">
            {/* Simple Logo Placeholder */}
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">D</div>
            <span className={`text-xl font-bold tracking-tight ${scrolled || isOpen ? 'text-slate-900' : 'text-slate-900'}`}>
              Dentiva
            </span>
          </a>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* --- DESKTOP CTA --- */}
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+38344000000" className="text-sm font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-2">
               <Phone className="w-4 h-4" />
               <span>+383 44 000 000</span>
            </a>
            <button className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-full transition-all shadow-lg shadow-blue-600/20">
              Rezervo
            </button>
          </div>

          {/* --- MOBILE MENU BUTTON --- */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden z-50 relative p-2 text-slate-800"
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
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-white z-50 shadow-2xl md:hidden flex flex-col p-8 pt-24"
            >
              {/* Mobile Links */}
              <div className="flex flex-col gap-6 mb-10">
                {navLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={linkVariants}
                    onClick={() => setIsOpen(false)}
                    className="text-2xl font-semibold text-slate-800 hover:text-blue-600 transition-colors"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* Mobile Info & CTA */}
              <motion.div variants={linkVariants} className="mt-auto border-t border-slate-100 pt-8 space-y-6">
                 
                 <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <Phone size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Na Telefononi</p>
                      <p className="font-semibold text-slate-900">+383 44 123 456</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 text-slate-600">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Lokacioni</p>
                      <p className="font-semibold text-slate-900">Prishtinë, Kosovë</p>
                    </div>
                 </div>

                 <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2">
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