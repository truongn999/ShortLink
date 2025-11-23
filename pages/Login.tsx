import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-neutral-900">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-neutral-900 transition-colors">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex flex-col gap-2 mb-8">
            <Link to="/" className="flex items-center gap-2 w-fit">
                <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">L</span>
                </div>
                <span className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-white">ShortLink</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Please enter your details to sign in.
            </p>
          </div>

          <div className="mt-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-neutral-900 dark:text-white">
                  Email address
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-neutral-900 dark:text-white">
                  Password
                </label>
                <div className="mt-2 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-neutral-400" aria-hidden="true" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-md bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent sm:text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-neutral-900 focus:ring-neutral-900 border-neutral-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-900 dark:text-white">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full justify-center rounded-md border border-transparent bg-neutral-900 dark:bg-white py-2.5 px-4 text-sm font-medium text-white dark:text-neutral-900 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>

            {/* <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-neutral-900 px-2 text-neutral-500 dark:text-neutral-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <a
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <span className="sr-only">Sign in with Google</span>
                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                    </svg>
                  </a>
                </div>

                <div>
                  <a
                    href="#"
                    className="inline-flex w-full justify-center rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 py-2 px-4 text-sm font-medium text-neutral-500 dark:text-neutral-300 shadow-sm hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <span className="sr-only">Sign in with GitHub</span>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        fillRule="evenodd"
                        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.026.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div> */}

            <div className="mt-8 text-center">
               <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-medium text-neutral-900 dark:text-white hover:underline">
                    Sign up for free
                  </Link>
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visuals */}
      <div className="hidden lg:block relative w-0 flex-1 bg-neutral-50 dark:bg-neutral-800">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-10">
           <div className="max-w-md w-full space-y-8">
               {/* Decorative Stats Card */}
               <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center justify-between mb-4">
                     <div>
                        <div className="text-sm text-neutral-500 dark:text-neutral-400">Total Revenue</div>
                        <div className="text-3xl font-bold text-neutral-900 dark:text-white mt-1">₫154,200,000</div>
                     </div>
                     <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                        <div className="w-6 h-6 text-green-600 dark:text-green-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/></svg>
                          +24%
                      </span>
                      <span className="text-neutral-500 dark:text-neutral-400">vs last month</span>
                  </div>
               </div>

               <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-6 -rotate-2 hover:rotate-0 transition-transform duration-500 ml-8 -mt-4">
                   <div className="space-y-4">
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">T</div>
                           <div className="flex-1">
                               <div className="text-sm font-medium text-neutral-900 dark:text-white">Tiki Affiliate Campaign</div>
                               <div className="text-xs text-neutral-500 dark:text-neutral-400">1,240 clicks • 4.5% CR</div>
                           </div>
                           <div className="text-sm font-semibold text-neutral-900 dark:text-white">₫4.2M</div>
                       </div>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold">S</div>
                           <div className="flex-1">
                               <div className="text-sm font-medium text-neutral-900 dark:text-white">Shopee Super Sale</div>
                               <div className="text-xs text-neutral-500 dark:text-neutral-400">8,420 clicks • 3.2% CR</div>
                           </div>
                           <div className="text-sm font-semibold text-neutral-900 dark:text-white">₫12.8M</div>
                       </div>
                   </div>
               </div>

               <div className="mt-12">
                   <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Manage your links professionally</h3>
                   <div className="space-y-3">
                       <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                           <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                           <span>Advanced analytics and tracking</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                           <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                           <span>Custom domains and branding</span>
                       </div>
                       <div className="flex items-center gap-3 text-neutral-600 dark:text-neutral-400">
                           <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                           <span>Team collaboration features</span>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
