import React from 'react'
import { motion as Motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import herobg from '../assets/img/herobg.png'

const Hero = () => {
  return (
    <section className="relative w-full h-screen bg-white font-sans text-slate-900 overflow-hidden flex flex-col lg:flex-row">

      {/* --- LEFT CONTENT (Text) --- */}
      <div className="w-full lg:w-1/2 h-full flex flex-col justify-center px-6 md:px-12 lg:pl-24 lg:pr-12 z-10">

        <Motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-bold leading-[1.1] tracking-tight text-slate-900 mb-8">
            Partneri juaj <br />
            për <span className="text-blue-600">shëndetin dentar</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg md:text-xl text-slate-500 mb-10 leading-relaxed font-normal max-w-lg">
            Ne i japim përparësi kujdesit parandalues dhe krijojmë plane trajtimi të personalizuara që mbrojnë shëndetin tuaj oral dhe ju dhurojnë vetëbesim.
          </p>

          {/* CTA Button */}
          <button className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-2xl transition-all shadow-[0_10px_30px_-10px_rgba(37,99,235,0.4)] transform hover:-translate-y-1 flex items-center gap-3 w-fit">
            Rezervo Termin
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
        </Motion.div>

      </div>

      {/* --- RIGHT CONTENT (Image) --- */}
      <div className="relative w-full lg:w-1/2 h-[40vh] lg:h-full order-first lg:order-last">
        <img
          src={herobg}
          alt="Klinika Dentare"
          className="w-full h-full object-cover object-center"
        />
      </div>

    </section>
  )
}

export default Hero