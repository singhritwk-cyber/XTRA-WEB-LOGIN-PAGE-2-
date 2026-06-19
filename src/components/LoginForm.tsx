import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, Lock, Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setError('');
    setIsLoading(true);
    
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordClick = async () => {
    setError('Discord login is not yet configured.');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 w-full max-w-[420px] p-8 glass-card rounded-2xl mx-4"
    >
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-brand-600/30 blur-3xl rounded-full" />
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-32 h-32 bg-brand-400/20 blur-3xl rounded-full" />

      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <div className="absolute inset-0 bg-brand-500/20 rounded-full blur-xl animate-pulse" />
          <img 
            src="/logo.png" 
            alt="Platform Logo" 
            className="relative w-full h-full object-cover rounded-full border border-white/10 shadow-[0_0_20px_rgba(37,99,235,0.3)] bg-brand-950"
          />
        </div>
        <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
          {isRegistering ? 'Create Account' : 'Welcome Back'}
        </h1>
        <p className="text-brand-400/80 text-sm font-medium">
          {isRegistering ? 'Sign up to create your account' : 'Sign in to continue to your account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-400/70 uppercase tracking-wider ml-1">
              Email Address
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-400 transition-colors">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-brand-950/50 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-brand-400/70 uppercase tracking-wider ml-1">
              Password
            </label>
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-brand-400 transition-colors">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-brand-950/50 border border-white/5 rounded-xl py-3 pl-11 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="flex items-center justify-between text-sm py-1">
          <label className="flex items-center space-x-2 cursor-pointer group">
            <div className="relative w-4 h-4 rounded border border-white/20 bg-brand-950/50 flex items-center justify-center group-hover:border-brand-500/50 transition-colors">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-2.5 h-2.5 rounded-sm bg-brand-500 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
            <span className="text-white/60 group-hover:text-white/90 transition-colors">Remember Me</span>
          </label>
          <a href="#" className="font-medium text-brand-400 hover:text-brand-300 transition-colors">
            Forgot Password?
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="relative w-full group overflow-hidden rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 p-[1px] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="relative w-full h-full bg-gradient-to-r from-brand-600 to-brand-500 rounded-xl py-3 flex items-center justify-center shadow-[0_0_20px_0_rgba(37,99,235,0.4)] group-hover:shadow-[0_0_30px_0_rgba(37,99,235,0.6)] transition-shadow">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <span className="font-semibold text-white tracking-wide">{isRegistering ? 'Create Account' : 'Login'}</span>
            )}
          </div>
        </button>
      </form>

      {/* Divider */}
      <div className="my-8 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative px-4 bg-transparent backdrop-blur-sm">
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Providers */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={handleGoogleLogin}
          type="button"
          className="flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-900 py-2.5 px-4 rounded-xl font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span>Google</span>
        </button>

        <button 
          onClick={handleDiscordClick}
          type="button"
          className="flex items-center justify-center space-x-2 bg-[#5865F2] hover:bg-[#4752C4] text-white py-2.5 px-4 rounded-xl font-medium transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
          </svg>
          <span>Discord</span>
        </button>
      </div>

      {/* Footer Links */}
      <div className="flex flex-col items-center justify-center space-y-4">
        <p className="text-white/60 text-sm">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
            className="font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            {isRegistering ? 'Login' : 'Create Account'}
          </button>
        </p>
        
        <div className="flex items-center space-x-1.5 text-[11px] text-white/40">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Secure login protected by encryption</span>
        </div>
      </div>
      
    </motion.div>
  );
}
