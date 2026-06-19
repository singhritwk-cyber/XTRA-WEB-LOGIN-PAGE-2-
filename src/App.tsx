import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import Fireworks from './components/Fireworks';
import LoginForm from './components/LoginForm';
import { auth } from './lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-brand-950 flex items-center justify-center text-brand-400">Loading...</div>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-brand-950 flex flex-col items-center justify-center font-sans antialiased selection:bg-brand-500/30">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-900 via-brand-950 to-brand-950 z-0" />
      <Fireworks />

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center justify-center">
        {!user ? (
          <LoginForm />
        ) : (
          <div className="glass-card p-8 rounded-2xl w-full max-w-[420px] text-center mx-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full border-2 border-brand-500/50 overflow-hidden bg-brand-950">
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold bg-brand-800 text-white">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
            </div>
            <h2 className="text-2xl font-display font-bold text-white mb-2">Welcome In!</h2>
            <p className="text-brand-400 mb-8">{user?.email || 'Preview User'}</p>
            <button
              onClick={() => signOut(auth)}
              className="flex items-center justify-center space-x-2 w-full py-3 px-4 rounded-xl font-medium bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Terms */}
      {!user && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center text-[11px] text-white/30 z-10 w-full px-4">
          By logging in, you agree to our{' '}
          <a href="#" className="underline hover:text-white/60 transition-colors">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="underline hover:text-white/60 transition-colors">Privacy Policy</a>.
        </div>
      )}
    </div>
  );
}
