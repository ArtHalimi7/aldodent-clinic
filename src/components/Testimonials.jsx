import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const REVIEWS = [
    {
        name: "Anass Khairey",
        text: "Great welcome, very kind and professional people, I spent 5 days in Kosovo and honestly I don't regret it. Thank you very much and see you soon.",
        rating: 5,
        time: "1 vit më parë",
        badge: "12 reviews",
        featured: true,
    },
    {
        name: "Egzon Elezi",
        text: "This is really the place to be, I strongly advise you to visit this magnificent office and above all the professionalism is impeccable 👌.",
        rating: 5,
        time: "1 vit më parë",
        badge: null,
    },
    {
        name: "Bajram Mulaj",
        text: "An Ordinance with a special ability. At the same time with very reasonable prices for their professionalism and a very wonderful staff, but above all the hospitality and respect towards the patients.",
        rating: 5,
        time: "2 vite më parë",
        badge: "Local Guide",
        featured: true,
    },
    {
        name: "Drilon Kurteshi",
        text: "The place was super clean, the staff were very kind and most importantly professional. Highly recommend it! 👍🏻",
        rating: 5,
        time: "5 vite më parë",
        badge: "Local Guide",
    },
    {
        name: "Armend Elezi",
        text: null,
        rating: 5,
        time: "1 vit më parë",
        badge: null,
    },
    {
        name: "Burhan Ljatifi",
        text: null,
        rating: 5,
        time: "2 vite më parë",
        badge: "3 reviews",
    },
];

/* ── Google "G" logo as SVG ── */
const GoogleG = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
);

/* ── Rating Stars ── */
const Stars = ({ count = 5 }) => (
    <div className="flex gap-0.5">
        {Array.from({ length: count }).map((_, i) => (
            <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
        ))}
    </div>
);

/* ── Small avatar-only cards for text-less reviews ── */
const MiniReview = ({ review, delay }) => (
    <Motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="flex items-center gap-3 px-5 py-4 bg-[#1d7aa1] border border-[#2596be]/30 rounded-2xl"
    >
        <div className="w-9 h-9 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300 font-semibold text-sm shrink-0">
            {review.name.charAt(0)}
        </div>
        <div className="min-w-0">
            <span className="text-white text-sm font-medium block truncate">{review.name}</span>
            <Stars />
        </div>
    </Motion.div>
);

/* ── Full Review Card (blue cards on white background) ── */
const ReviewCard = ({ review, delay, className = "" }) => (
    <Motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`group relative rounded-3xl p-7 transition-all duration-300 ${review.featured
            ? 'bg-[#1d7aa1] border border-[#2596be]/30 hover:bg-[#1a6e93]'
            : 'bg-[#2596be] border border-[#2dd4bf]/15 hover:bg-[#218eaf]'
            } ${className}`}
    >
        {/* Decorative Quote */}
        <Quote
            size={review.featured ? 48 : 32}
            className="absolute top-5 right-5 text-white/[0.06] group-hover:text-white/[0.10] transition-colors"
        />

        {/* Header */}
        <div className="flex items-start gap-3.5 mb-5">
            <div className={`shrink-0 rounded-full flex items-center justify-center font-semibold ${review.featured
                ? 'w-12 h-12 bg-gradient-to-br from-teal-400/25 to-teal-400/10 text-teal-300 text-base'
                : 'w-10 h-10 bg-teal-400/20 text-teal-300 text-sm'
                }`}>
                {review.name.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
                <span className="text-white font-medium text-sm block">{review.name}</span>
                <div className="flex items-center gap-2 mt-1">
                    <Stars />
                    <span className="text-white/25 text-[11px]">·</span>
                    <span className="text-white/40 text-xs">{review.time}</span>
                </div>
                {review.badge && (
                    <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-teal-300/70 bg-teal-400/10 px-2 py-0.5 rounded-full">
                        {review.badge}
                    </span>
                )}
            </div>
        </div>

        {/* Quote Text */}
        <p className={`font-light leading-relaxed ${review.featured ? 'text-white/75 text-[15px]' : 'text-white/65 text-sm'
            }`}>
            "{review.text}"
        </p>
    </Motion.div>
);

/* ── Main Section ── */
const Testimonials = () => {
    const withText = REVIEWS.filter(r => r.text);
    const withoutText = REVIEWS.filter(r => !r.text);

    return (
        <section className="relative bg-white py-24 md:py-32 overflow-hidden" style={{ fontFamily: "'Outfit', sans-serif" }}>
            {/* Subtle Background Accents */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[30%] w-[50vw] h-[50vw] bg-[#2596be]/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-15%] right-[-5%] w-[40vw] h-[40vw] bg-teal-400/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
                {/* Header Row */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
                    <div>
                        <Motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[#2596be] font-bold tracking-[0.2em] uppercase text-xs mb-3 block"
                        >
                            Vlerësimet
                        </Motion.span>
                        <Motion.h2
                            initial={{ opacity: 0, y: 15 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-3xl md:text-5xl font-light tracking-tight text-gray-900"
                        >
                            Çfarë thonë pacientët tanë
                        </Motion.h2>
                    </div>

                    {/* Google Rating Badge */}
                    <Motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3 self-start md:self-auto"
                    >
                        <GoogleG />
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-gray-900 font-medium text-lg">5.0</span>
                                <Stars />
                            </div>
                            <span className="text-gray-400 text-xs">Google Reviews</span>
                        </div>
                    </Motion.div>
                </div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Featured card — spans 7 cols */}
                    <div className="md:col-span-7">
                        <ReviewCard review={withText[0]} delay={0.1} className="h-full" />
                    </div>

                    {/* Stacked right column — spans 5 cols */}
                    <div className="md:col-span-5 flex flex-col gap-4">
                        <ReviewCard review={withText[1]} delay={0.2} className="flex-1" />
                        {/* Mini reviews row */}
                        <div className="grid grid-cols-2 gap-3">
                            {withoutText.map((r, i) => (
                                <MiniReview key={i} review={r} delay={0.3 + i * 0.05} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom row — two cards side by side */}
                    <div className="md:col-span-5">
                        <ReviewCard review={withText[2]} delay={0.3} className="h-full" />
                    </div>
                    <div className="md:col-span-7">
                        <ReviewCard review={withText[3]} delay={0.4} className="h-full" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
