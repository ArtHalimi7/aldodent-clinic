import { useState, useEffect, useRef } from 'react'
import { motion as Motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import logoWhite from '../assets/img/logowhite.png'

/* ─────────────────────────────────────────────────────────
   PageLoader
   • Initial load  → splash with logo, slides up to reveal
   • Route change   → instant cover, then slides up to reveal
   ───────────────────────────────────────────────────────── */

export default function PageLoader({ children }) {
    const { pathname } = useLocation()
    const isFirstRender = useRef(true)
    const [initialLoading, setInitialLoading] = useState(true)
    const [routeWipe, setRouteWipe] = useState(false)
    // Phase: 'cover' = overlay is covering page, 'reveal' = animating away
    const [wipePhase, setWipePhase] = useState('cover')

    // ── Initial splash (2s) ──
    useEffect(() => {
        const t = setTimeout(() => setInitialLoading(false), 2000)
        return () => clearTimeout(t)
    }, [])

    // ── Route transitions ──
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }

        window.scrollTo(0, 0)

        // Instantly show cover
        setWipePhase('cover')
        setRouteWipe(true)

        // After a brief hold, start the reveal animation
        const revealTimer = setTimeout(() => {
            setWipePhase('reveal')
        }, 400)

        // Remove overlay after reveal animation completes
        const doneTimer = setTimeout(() => {
            setRouteWipe(false)
        }, 1000)

        return () => {
            clearTimeout(revealTimer)
            clearTimeout(doneTimer)
        }
    }, [pathname])

    return (
        <>
            {/* ── Initial splash screen ── */}
            <AnimatePresence>
                {initialLoading && (
                    <Motion.div
                        key="splash"
                        initial={{ y: 0 }}
                        exit={{ y: '-100%' }}
                        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#2596be]"
                    >
                        <div className="absolute w-[400px] h-[400px] bg-teal-300/10 rounded-full blur-[120px]" />

                        <div className="relative flex flex-col items-center gap-8">
                            <Motion.img
                                src={logoWhite}
                                alt="AldoDent"
                                className="w-28 md:w-36"
                                initial={{ opacity: 0, scale: 0.7, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            />
                            <div className="w-20 h-[2px] bg-white/15 rounded-full overflow-hidden">
                                <Motion.div
                                    className="h-full bg-white/70 rounded-full"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1] }}
                                />
                            </div>
                        </div>
                    </Motion.div>
                )}
            </AnimatePresence>

            {/* ── Route transition wipe ── */}
            {routeWipe && (
                <Motion.div
                    key="route-wipe"
                    className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#2596be]"
                    initial={false}
                    animate={{
                        y: wipePhase === 'cover' ? '0%' : '-100%',
                    }}
                    transition={
                        wipePhase === 'cover'
                            ? { duration: 0 }
                            : { duration: 0.5, ease: [0.76, 0, 0.24, 1] }
                    }
                >
                    <div className="absolute w-[300px] h-[300px] bg-teal-300/10 rounded-full blur-[100px]" />
                    <img
                        src={logoWhite}
                        alt="AldoDent"
                        className="w-20 md:w-24 relative"
                    />
                </Motion.div>
            )}

            {/* ── Page content ── */}
            {children}
        </>
    )
}
