import React from 'react'
import { motion as Motion } from 'framer-motion'
import { MapPin, ArrowUpRight, Gem, Box } from 'lucide-react'
import { Link } from 'react-router-dom'
import toothImg from '../assets/img/tooth.webp'

const CanvasSpinner = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-2 border-teal-400/40 border-t-teal-400 animate-spin" />
  </div>
)

/* ─── Marquee / Ticker Strip ─── */
const MARQUEE_ITEMS = [
  "Kirurgji",
  "Implantologji",
  "Estetikë Dentare",
  "Parodontologji",
  "Ortodonci",
  "Endodonci",
  "Mbushje Estetike",
]

const MarqueeStrip = () => (
  <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-white/[0.03] backdrop-blur-sm">
    <div className="flex overflow-hidden">
      <Motion.div
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
      </Motion.div>
      <Motion.div
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
      </Motion.div>
    </div>
  </div>
)

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#1e3a8a]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      {/* ── Background Elements ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-teal-400/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#172554]/30 rounded-full blur-[120px]" />

        {/* Topographic Wave Field */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.15]" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M-200 900 Q 100 600, 400 650 T 900 500 T 1600 50" stroke="white" strokeWidth="0.8" />
          <path d="M-200 950 Q 150 650, 500 700 T 1000 520 T 1700 0" stroke="white" strokeWidth="0.6" />
          <path d="M-200 1000 Q 200 700, 600 750 T 1100 540 T 1800 -50" stroke="white" strokeWidth="0.5" />
          <path d="M-200 1050 Q 250 750, 700 800 T 1200 560 T 1900 -100" stroke="white" strokeWidth="0.4" />
          <line x1="600" y1="0" x2="800" y2="1200" stroke="white" strokeWidth="0.2" strokeDasharray="8 16" />
          <line x1="900" y1="0" x2="1100" y2="1200" stroke="white" strokeWidth="0.15" strokeDasharray="8 16" />
          <line x1="1200" y1="0" x2="1400" y2="1200" stroke="white" strokeWidth="0.1" strokeDasharray="8 16" />
        </svg>
      </div>

      {/* ── Static Tooth Image (Optimized for LCP and Performance) ── */}
      <div className="absolute top-[80%] sm:top-[80%] md:top-[75%] lg:top-[70%] xl:top-[68%] left-1/2 lg:left-[40%] xl:left-[35%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none transition-all duration-700">
        <div className="w-[85vw] sm:w-[90vw] md:w-[85vw] lg:w-[70vw] xl:w-[60vw] max-w-[1100px] lg:max-w-[900px] xl:max-w-[800px] h-[50vh] sm:h-[60vh] md:h-[90vh] lg:h-[75vh] xl:h-[70vh]">
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={toothImg}
              alt="Aldo Dent 3D Tooth"
              width="800"
              height="800"
              decoding="async"
              className="w-full h-full object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
              // Hint to the browser that this is the most important image to load
              fetchPriority="high"
            />
          </Motion.div>
        </div>
      </div>

      {/* ── Foreground Content Container (Strict 12-Column Grid Alignment) ── */}
      <div className="relative z-20 w-full h-full min-h-screen max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 pointer-events-none items-center">

        {/* Top Left Area - Grid aligned - HIDDEN ON MOBILE */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden md:flex absolute top-[12%] md:top-[18%] lg:top-[17%] xl:top-[16%] left-0 w-full md:w-auto md:col-span-5 flex-col items-center md:items-start px-6 md:px-0 z-20"
        >
          {/* Typography Hierarchy: Bolder, bigger */}
          <h2 className="text-[2.5rem] sm:text-4xl md:text-5xl lg:text-[4.5rem] font-bold text-teal-400 tracking-tight leading-tight mb-8 drop-shadow-sm whitespace-nowrap text-center md:text-left">
            Aldo Dent Clinic
          </h2>

          <Link to="/booking" className="pointer-events-auto">
            {/* Button Refinement: Padding, smooth transition, scale hover, shadow */}
            <Motion.button
              className="group pl-6 pr-2 py-2.5 md:py-3 bg-white text-[#1e3a8a] text-sm md:text-base font-medium rounded-full flex items-center justify-between gap-6 transition-all duration-300 ease-out shadow-lg hover:shadow-[0_8px_30px_rgba(255,255,255,0.15)] hover:bg-teal-50 hover:scale-[1.02]"
            >
              Rezervo Termin
              <div className="bg-[#1e3a8a] text-white p-2 md:p-2.5 rounded-full transition-transform duration-300 group-hover:bg-teal-500">
                <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Motion.button>
          </Link>
        </Motion.div>

        {/* Middle Right Area - Grid aligned, perfectly centered and raised on mobile */}
        <Motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute bottom-auto top-[18%] sm:top-[20%] md:top-[24%] lg:top-[22%] left-0 md:left-auto right-0 md:right-[2rem] lg:right-[4rem] w-full md:w-auto md:col-span-5 flex flex-col items-center md:items-start text-center md:text-left z-20 px-6 md:px-0"
        >
          {/* Tags above "Partneri juaj..." */}
          <div className="flex items-center gap-3 mb-4 md:mb-6 self-center md:self-end">
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/80 text-[10px] md:text-xs font-light shadow-lg"
            >
              <Gem className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" strokeWidth={1.5} /> Estetikë Dentare
            </Motion.div>
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-full text-white/80 text-[10px] md:text-xs font-light shadow-lg"
            >
              <Box className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" strokeWidth={1.5} /> Skanim 3D
            </Motion.div>
          </div>
          {/* Typography Hierarchy: Dominant heading, tighter leading, increased spacing */}
          <h1 className="text-[3rem] sm:text-5xl md:text-5xl lg:text-[4.5rem] font-light text-white leading-[1.1] md:leading-tight tracking-tight z-10 drop-shadow-lg max-w-lg mb-4 md:mb-6 text-center md:text-left">
            Partneri juaj për<br />
            <span className="text-teal-400 font-medium whitespace-nowrap">shëndetin dentar</span>
          </h1>

          {/* Typography Hierarchy: Max-width constrained, relaxed leading - Now visible on mobile */}
          <p className="text-white/70 text-sm md:text-base lg:text-lg max-w-md font-light leading-relaxed z-10 drop-shadow-md mb-6 md:mb-8 text-center md:text-left">
            Ne i japim përparësi kujdesit parandalues dhe krijojmë plane trajtimi të personalizuara që mbrojnë shëndetin tuaj oral dhe ju dhurojnë vetëbesim.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 w-full justify-center md:justify-start">
            <Link to="/booking" className="pointer-events-auto md:hidden">
              {/* Button Refinement: Padding, smooth transition, scale hover, shadow - ONLY visible on mobile inside this block */}
              <Motion.button
                className="group pl-6 pr-2 py-2.5 bg-white text-[#1e3a8a] text-sm font-medium rounded-full flex items-center justify-between gap-6 transition-all duration-300 ease-out shadow-lg"
              >
                Rezervo Termin
                <div className="bg-[#1e3a8a] text-white p-2 rounded-full transition-transform duration-300 group-hover:bg-teal-500">
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Motion.button>
            </Link>

            {/* Location Tag - Positioned underneath / beside */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full shadow-lg text-white/90 text-[11px] md:text-sm font-medium z-10"
            >
              <MapPin className="w-3.5 h-3.5 md:w-4 md:h-4 text-teal-400" /> Gjilan, Kosovë
            </Motion.div>
          </div>
        </Motion.div>

      </div>

      {/* Marquee Strip */}
      <MarqueeStrip />
    </section>
  )
}

export default Hero