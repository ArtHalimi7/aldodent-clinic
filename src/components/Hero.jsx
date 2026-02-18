import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import heroImg from '../assets/img/heroimg.png'

const Hero = () => {
  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-between px-6 md:px-12 lg:px-24 overflow-hidden gap-12 bg-[#009299]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="max-w-4xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-8"
        >

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-[1.05] tracking-tight">
            Partneri juaj për <br />
            <span className="font-medium text-teal-400">shëndetin dentar</span>
          </h1>

          {/* Subtext */}
          <p className="text-white/80 text-lg md:text-xl font-light max-w-lg leading-relaxed">
            Ne i japim përparësi kujdesit parandalues dhe krijojmë plane trajtimi të personalizuara që mbrojnë shëndetin tuaj oral dhe ju dhurojnë vetëbesim.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group px-8 py-4 bg-white text-[#009299] text-lg font-medium rounded-full flex items-center gap-3 transition-colors hover:bg-slate-50"
            >
              Rezervo Termin
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 border border-white/30 text-white text-lg font-medium rounded-full flex items-center gap-3 transition-colors hover:bg-white/10"
            >
              Na Kontaktoni
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Radial Texture/Glow behind image */}
      <div className="hidden lg:block absolute right-[0%] bottom-[-20%] w-[50vw] h-[50vw] min-w-[600px] min-h-[600px] z-0 pointer-events-none translate-x-[10%] translate-y-[10%]">
        <div className="absolute inset-0 w-full h-full rounded-full bg-[radial-gradient(circle,rgba(88,160,152,0.1)_0%,rgba(88,160,152,0.05)_45%,transparent_70%)] blur-[120px] opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-[radial-gradient(circle,rgba(88,160,152,0.2)_0%,rgba(88,160,152,0.1)_50%,transparent_70%)] blur-[100px] opacity-10"></div>
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

      {/* Subtle Background Element/Gradient for depth */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent"></div>
    </section>
  )
}

export default Hero