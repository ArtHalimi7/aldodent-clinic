import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react';

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
            setError(result.error || 'Failed to login');
        }
    };

    return (
        <div className="min-h-screen bg-[#1e3a8a] flex items-center justify-center p-6 relative overflow-hidden font-outfit">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#172554]/60 rounded-full blur-[120px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-md"
            >
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 p-8 rounded-3xl shadow-2xl relative z-10">
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-block mb-4">
                            <span className="text-2xl font-medium tracking-tight text-white">
                                Aldo Dent
                            </span>
                        </Link>
                        <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back</h1>
                        <p className="text-white/60 text-sm">Sign in to manage your appointments.</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-xl mb-6 flex items-start gap-3 text-sm"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/80 pl-1 block">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-teal-300 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-teal-400/50 focus:bg-white/10 transition-all"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-white/80 pl-1 block">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-teal-300 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-teal-400/50 focus:bg-white/10 transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-300 hover:to-teal-400 text-[#1e3a8a] font-semibold rounded-2xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                            {!isLoading && <ArrowRight className="w-5 h-5" />}
                        </button>
                    </form>

                    <p className="text-center text-white/60 mt-8 text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-teal-300 hover:text-teal-200 font-medium transition-colors">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
