import React, { useState, useEffect } from 'react';

export default function EduAdaptLanding() {
  const [theme, setTheme] = useState('dark');
  const [offline, setOffline] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'signup'
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [message]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
  const toggleOffline = () => setOffline((s) => !s);

  // --- Simple client-side auth helpers (demo only) ---
  function saveUserToStorage(email, password) {
    const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
    users.push({ email, password });
    localStorage.setItem('edu_users', JSON.stringify(users));
  }

  function findUser(email) {
    const users = JSON.parse(localStorage.getItem('edu_users') || '[]');
    return users.find((u) => u.email === email);
  }

  // --- Sign Up / Sign In handlers ---
  const handleSignup = ({ name, email, password }) => {
    // simple validation
    if (!name || !email || !password) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return;
    }
    if (findUser(email)) {
      setMessage({ type: 'error', text: 'Account already exists with this email.' });
      return;
    }
    saveUserToStorage(email, password);
    setMessage({ type: 'success', text: 'Account created! You can sign in now.' });
    setAuthTab('signin');
  };

  const handleSignin = ({ email, password }) => {
    if (!email || !password) {
      setMessage({ type: 'error', text: 'Enter email and password.' });
      return;
    }
    const user = findUser(email);
    if (!user || user.password !== password) {
      setMessage({ type: 'error', text: 'Invalid credentials.' });
      return;
    }
    setMessage({ type: 'success', text: `Welcome back, ${email.split('@')[0]}!` });
    setAuthOpen(false);
  };

  // --- Inline small components: AuthForm ---
  function AuthForm({ mode }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      // Reset fields when switching tabs
      setName('');
      setEmail('');
      setPassword('');
      setShowPassword(false);
    }, [mode]);

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (mode === 'signup') handleSignup({ name: name.trim(), email: email.trim(), password });
          else handleSignin({ email: email.trim(), password });
        }}
        className="space-y-3"
      >
        {mode === 'signup' && (
          <label className="block">
            <div className="text-sm font-medium">Full name</div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md p-3 bg-white/5 focus:outline-none focus:ring-2"
              placeholder="Your name"
              aria-label="Full name"
              required
            />
          </label>
        )}

        <label className="block">
          <div className="text-sm font-medium">Email</div>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md p-3 bg-white/5 focus:outline-none focus:ring-2"
            placeholder="you@example.com"
            type="email"
            aria-label="Email"
            required
          />
        </label>

        <label className="block relative">
          <div className="flex items-center justify-between text-sm font-medium">
            <span>Password</span>
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="text-xs underline"
              aria-pressed={showPassword}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-md p-3 bg-white/5 focus:outline-none focus:ring-2"
            placeholder="Choose a strong password"
            type={showPassword ? 'text' : 'password'}
            aria-label="Password"
            required
            minLength={6}
          />
        </label>

        <div className="flex items-center justify-between gap-2">
          <button
            type="submit"
            className="flex-1 px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold focus:outline-none focus:ring-2"
          >
            {mode === 'signup' ? 'Create Account' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => {
              // demo: fill with a test account if available
              const demo = findUser('demo@example.com');
              if (demo) {
                setMessage({ type: 'info', text: 'Demo user exists — sign in with demo@example.com / password' });
              } else {
                saveUserToStorage('demo@example.com', 'password');
                setMessage({ type: 'success', text: 'Demo user created: demo@example.com / password' });
              }
            }}
            className="px-3 py-2 rounded-md bg-white/6"
          >
            Demo
          </button>
        </div>

        <div className="text-xs opacity-70">
          By continuing you agree to our <a className="underline">Terms</a> and <a className="underline">Privacy Policy</a>.
        </div>
      </form>
    );
  }

  return (
    <div className={theme === 'dark' ? 'min-h-screen bg-[#050316] text-white' : 'min-h-screen bg-gray-50 text-gray-900'}>
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">EDUADAPT</h1>
          <p className="mt-1 opacity-80 uppercase text-xs">Personalized adaptive learning powered by AI</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-pressed={theme === 'dark'}
            className="px-3 py-2 rounded-md text-sm bg-white/6 backdrop-blur focus:outline-none focus:ring-2"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Theme
          </button>

          <button
            onClick={() => {
              setAuthOpen(true);
              setAuthTab('signin');
            }}
            className="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-semibold shadow-lg focus:outline-none focus:ring-2"
          >
            Sign in
          </button>
        </div>
      </header>

      <main id="main-content" className="max-w-6xl mx-auto px-6">
        {/* hero / features */}
        <section id="features-section" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {[
            {
              id: 'quality',
              title: 'Quality Content',
              desc: 'Expert-curated lessons designed for effective learning',
            },
            {
              id: 'ai',
              title: 'AI-Powered',
              desc: 'Personalized recommendations based on your progress',
            },
            {
              id: 'offline',
              title: 'Offline Ready',
              desc: 'Learn anywhere, anytime with offline support',
            },
          ].map((f) => (
            <article key={f.id} className="relative rounded-2xl p-6 bg-gradient-to-b from-white/3 to-white/2/5 shadow-lg backdrop-blur-md border border-white/6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/5 text-blue-300">
                  {/* minimal icon placeholder */}
                  <div className="w-8 h-8 rounded-md bg-white/6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1 opacity-80 text-sm">{f.desc}</p>
                </div>
              </div>

              {f.id === 'offline' && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    onClick={toggleOffline}
                    aria-pressed={offline}
                    className={`px-3 py-1 rounded-full text-sm font-medium focus:outline-none focus:ring-2 ${offline ? 'bg-green-600/30' : 'bg-red-600/20'}`}
                  >
                    {offline ? 'Enabled' : 'Disabled'}
                  </button>
                  <span className="text-xs opacity-70">Offline learning visual toggle</span>
                </div>
              )}
            </article>
          ))}
        </section>

        {/* metrics + CTA */}
        <section id="metrics-section" className="mt-12 text-center">
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">2K+</div>
              <div className="text-sm opacity-70">Learners</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">80+</div>
              <div className="text-sm opacity-70">Lessons</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-extrabold">95%</div>
              <div className="text-sm opacity-70">Growth</div>
            </div>
          </div>

          <div className="mt-8">
            <a
              href="#start"
              onClick={(e) => e.preventDefault()}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 text-white font-bold shadow-2xl hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-500/30"
              role="button"
            >
              Start Learning →
            </a>
          </div>

          <p className="mt-3 text-sm opacity-60">Don't have an account? <button onClick={() => { setAuthOpen(true); setAuthTab('signup'); }} className="underline">Sign up</button></p>
        </section>

        {/* extras */}
        <section id="extras-section" className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl p-6 bg-white/3 border border-white/6 backdrop-blur-md">
            <h4 className="font-semibold">Extra features included</h4>
            <ul className="mt-3 space-y-2 text-sm opacity-85">
              <li>• Smooth micro-interactions & focus states (keyboard accessible)</li>
              <li>• Responsive layout: stacked on mobile, 3 columns on desktop</li>
              <li>• Progressive enhancement hooks for offline / PWA support</li>
              <li>• Theming toggle (dark/light) and accessible contrast</li>
              <li>• Local demo Auth (replace with API)</li>
            </ul>
          </div>

          <div className="rounded-xl p-6 bg-white/3 border border-white/6 backdrop-blur-md">
            <h4 className="font-semibold">How to wire into a real app</h4>
            <ol className="mt-3 ml-4 list-decimal text-sm opacity-85 space-y-2">
              <li>Replace localStorage auth with secure API endpoints (POST /auth/signup, POST /auth/signin)</li>
              <li>Use secure cookies or Authorization headers for session tokens</li>
              <li>Register a Service Worker and enable PWA offline caching</li>
              <li>Store theme & offline preferences in localStorage or user profile</li>
            </ol>
          </div>
        </section>
      </main>

      {/* Auth slide-over panel */}
      {authOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAuthOpen(false)} />

          <aside className="relative ml-auto w-full max-w-md h-full bg-white text-gray-900 dark:bg-[#0b0b12] dark:text-white shadow-2xl p-6 overflow-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Welcome</h2>
              <button onClick={() => setAuthOpen(false)} className="px-2 py-1 rounded-md bg-white/6">Close</button>
            </div>

            <div className="mt-4">
              <div className="flex gap-2 bg-white/5 rounded-full p-1 w-max">
                <button
                  onClick={() => setAuthTab('signin')}
                  className={`px-4 py-2 rounded-full ${authTab === 'signin' ? 'bg-white/8 font-semibold' : 'bg-transparent'}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthTab('signup')}
                  className={`px-4 py-2 rounded-full ${authTab === 'signup' ? 'bg-white/8 font-semibold' : 'bg-transparent'}`}
                >
                  Sign Up
                </button>
              </div>

              <div className="mt-6">
                <AuthForm mode={authTab} />
              </div>

              <div className="mt-4 text-sm opacity-80">
                <div className={`rounded-md p-2 ${message?.type === 'error' ? 'bg-red-600/20' : message?.type === 'success' ? 'bg-green-600/20' : 'bg-white/5'}`}>
                  {message ? message.text : 'We will never share your information.'}
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      <footer className="max-w-6xl mx-auto px-6 py-10 text-sm opacity-60">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} EduAdapt</div>
          <div className="flex items-center gap-3">
            <div className="text-xs">Offline:</div>
            <div className={`text-xs font-medium ${offline ? 'text-green-300' : 'text-red-300'}`}>{offline ? 'Enabled' : 'Disabled'}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
