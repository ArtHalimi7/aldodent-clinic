import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Come from protected route or go home
    const from = location.state?.from?.pathname || '/';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const result = await login(email, password);
        setIsLoading(false);

        if (result.success) {
            if (result.user && result.user.role === 'admin') {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            setError(result.error || 'Kyçja dështoi. Ju lutem kontrolloni të dhënat.');
        }
    };

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95, y: 20 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
                staggerChildren: 0.1,
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center p-4 relative overflow-hidden font-outfit selection:bg-teal-400 selection:text-[#1e3a8a]">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[100px] pointer-events-none mix-blend-screen animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] bg-[#172554]/60 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
            <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-teal-300/10 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-[380px] relative z-10"
            >
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-[2rem] shadow-2xl relative z-10 overflow-hidden group">
                    {/* Inner Shine Effect */}
                    <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent group-hover:via-teal-300/50 transition-all duration-700" />

                    <motion.div variants={itemVariants} className="text-center mb-8">
                        <h1 className="text-2xl font-semibold text-white mb-2 tracking-tight">
                            Mirësevini
                        </h1>
                        <p className="text-white/60 text-[13px] font-light leading-relaxed">
                            Hyni në llogarinë tuaj
                        </p>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                                className="bg-red-500/10 border border-red-500/30 text-red-200 p-3 rounded-2xl mb-6 flex items-start gap-2.5 text-[13px] shadow-inner"
                            >
                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                <p className="leading-snug">{error}</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <motion.div variants={itemVariants} className="space-y-1.5">
                            <label className="text-[12px] font-medium text-white/80 pl-1 uppercase tracking-wider block">
                                EMRI
                            </label>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Mail className="w-[18px] h-[18px] text-white/40 group-focus-within/input:text-teal-300 transition-colors duration-300" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-white/10 transition-all duration-300 shadow-inner"
                                    placeholder="emri@shembull.com"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="space-y-1.5">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[12px] font-medium text-white/80 pl-1 uppercase tracking-wider">
                                    FJALËKALIMI
                                </label>
                            </div>
                            <div className="relative group/input">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <Lock className="w-[18px] h-[18px] text-white/40 group-focus-within/input:text-teal-300 transition-colors duration-300" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-teal-400/50 focus:border-teal-400/50 focus:bg-white/10 transition-all duration-300 shadow-inner"
                                    placeholder="••••••••"
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="relative w-full py-3.5 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-[#172554] font-bold rounded-2xl shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)] flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none group/btn overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? 'Duke u kyçur...' : 'Hyr në llogari'}
                                    {!isLoading && <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </motion.div>
                    </form>

                    <motion.p variants={itemVariants} className="text-center text-white/60 mt-6 text-[13px]">
                        Nuk keni ende llogari?{' '}
                        <Link to="/signup" className="text-teal-300 hover:text-teal-200 font-semibold transition-colors border-b border-transparent hover:border-teal-300 pb-0.5">
                            Regjistrohuni këtu
                        </Link>
                    </motion.p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
