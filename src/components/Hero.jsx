import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import heroImg from '../assets/img/heroimg.png'

/* ─── Marquee / Ticker Strip ─── */
const MARQUEE_ITEMS = [
  "Implantologji Dixhitale",
  "Faseta E-MAX",
  "Zbardhje me Laser",
  "Ortodonci Invisalign",
  "Kirurgji Orale",
  "Smile Design",
  "Stomatologji Pediatrike",
  "Kontroll Falas",
];

const MarqueeStrip = () => (
  <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
    <div className="flex overflow-hidden">
      <motion.div
        className="flex shrink-0 gap-8 py-4 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={i}
            className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 whitespace-nowrap flex items-center gap-4"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-teal-400/60" />
          </span>
        ))}
      </motion.div>
      <motion.div
        className="flex shrink-0 gap-8 py-4 px-4"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span
            key={`d-${i}`}
            className="text-xs font-medium tracking-[0.2em] uppercase text-white/40 whitespace-nowrap flex items-center gap-4"
          >
            {item}
            <span className="w-1 h-1 rounded-full bg-teal-400/60" />
          </span>
        ))}
      </motion.div>
    </div>
  </div>
)

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-between px-6 md:px-12 lg:px-24 overflow-hidden bg-[#009299]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#006b70]/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl w-full relative z-10 pt-16 lg:pt-0 lg:-translate-y-4">

        {/* Content — centered on mobile, left-aligned on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-teal-300 font-bold tracking-[0.2em] uppercase text-xs"
          >
            Aldo Dent Clinic
          </motion.span>

          {/* Main Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white leading-[1.1] lg:leading-[1.05] tracking-tight">
            Partneri juaj për{' '}
            <span className="font-medium text-teal-400">shëndetin dentar</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/60 text-lg md:text-xl lg:text-2xl font-light max-w-lg leading-relaxed">
            Ne i japim përparësi kujdesit parandalues dhe krijojmë plane trajtimi të personalizuara që mbrojnë shëndetin tuaj oral dhe ju dhurojnë vetëbesim.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-row justify-center lg:justify-start gap-3 mt-4 w-full lg:w-auto">
            <Link to="/booking">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group px-6 py-3 lg:px-8 lg:py-4 bg-white text-[#009299] text-base lg:text-lg font-medium rounded-full flex items-center justify-center gap-2 lg:gap-3 transition-colors hover:bg-teal-50 shadow-lg shadow-black/10 w-auto"
              >
                Rezervo Termin
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform group-hover:translate-x-0.5" />
              </motion.button>
            </Link>

            <Link to="/contact">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 lg:px-8 lg:py-4 border border-white/20 text-white text-base lg:text-lg font-medium rounded-full flex items-center justify-center gap-2 lg:gap-3 transition-colors hover:bg-white/10 w-auto"
              >
                Na Kontaktoni
              </motion.button>
            </Link>
          </div>
        </motion.div>

        {/* Mobile Image — visible only on mobile/tablet, centered */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:hidden flex justify-center mt-8 sm:mt-12"
        >
          <img
            src={heroImg}
            alt="Aldo Dent Smile"
            className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>

      {/* Right Side Image */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="hidden lg:block w-1/2 h-full absolute right-0 bottom-0 pointer-events-none z-10"
      >
        <img
          src={heroImg}
          alt="Aldo Dent Smile"
          className="w-full h-full object-contain object-bottom scale-110 translate-y-10 origin-bottom"
        />
      </motion.div>

      {/* Top-right gradient */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>

      {/* Marquee Strip */}
      <MarqueeStrip />
    </section>
  )
}

export default Hero