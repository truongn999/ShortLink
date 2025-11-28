
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Link2, 
  BarChart3, 
  QrCode, 
  CalendarClock, 
  Shield, 
  Code, 
  Copy, 
  CheckCircle, 
  Zap, 
  Loader2, 
  AlertCircle,
  Layout,
  Smartphone,
  Globe,
  Github,
  Twitter,
  Linkedin,
  ArrowRight,
  Check,
  ClipboardPaste
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import AdsBanner from '../components/AdsBanner';
import SEO from '../components/SEO';

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const handleShorten = async () => {
    if (!url) return;
    
    // Basic URL validation
    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = 'https://' + url;
    }

    setLoading(true);
    setError(null);
    setShortened('');

    try {
      const slug = generateSlug();
      
      // Payload preparation
      const payload: any = {
        original_url: finalUrl,
        short_code: slug,
        is_active: true,
        // If user exists, save user_id. If not, send null (requires DB to allow NULL user_id)
        user_id: user ? user.id : null 
      };

      const { data, error: insertError } = await supabase
        .from('links')
        .insert(payload)
        .select()
        .single();

      if (insertError) throw insertError;

      // Construct the display URL (using current domain)
      const domain = window.location.host; 
      setShortened(`${domain}/${slug}`); // Removed /#/ to support clean URLs
      
    } catch (err: any) {
      console.error('Error creating link:', err);
      setError(err.message || 'An error occurred while creating the link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
     if(shortened) {
         navigator.clipboard.writeText(shortened);
         alert('Copied to clipboard!');
     }
  }

  const handlePaste = async () => {
    try {
      // Check if clipboard API is supported
      if (!navigator.clipboard || !navigator.clipboard.readText) {
          throw new Error('Clipboard API not supported');
      }
      
      const text = await navigator.clipboard.readText();
      setUrl(text);
      setError(null);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      setError('Browser blocked clipboard access. Please paste manually (Ctrl+V).');
      // Focus the input for better UX
      const input = document.getElementById('url-input');
      if (input) input.focus();
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen flex flex-col transition-colors duration-300">
      <SEO 
        title="ShortLink - Affiliate Link Shortener & Tracking"
        description="The best free link shortener for affiliate marketers. Track clicks, analyze traffic, and boost your earnings with custom branded links."
      />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "ShortLink",
          "applicationCategory": "BusinessApplication",
          "operatingSystem": "Web",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "featureList": "Link Shortening, Analytics, Custom Domains, QR Codes"
        })}
      </script>
      <nav className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <div className="font-semibold text-xl tracking-tight flex items-center gap-2 text-neutral-900 dark:text-white">
                <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">L</span>
                </div>
                ShortLink
              </div>
              <div className="hidden md:flex gap-6 text-sm">
                <a href="#features" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a>
                <a href="#dashboard-preview" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">Dashboard</a>
                <a href="#pricing" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">Pricing</a>
                <Link to="/blog" className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors">Blog</Link>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">
                    Dashboard
                </Link>
              ) : (
                <>
                    <Link to="/login" className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors px-4 py-2">Login</Link>
                    <Link to="/signup" className="text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
            Free Affiliate Link Shortener<br />with Detailed Analytics
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-12 max-w-2xl mx-auto">
            Create professional short links, track detailed analytics, and optimize your affiliate marketing campaigns effortlessly.
          </p>

          <div className="bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg p-8 max-w-2xl mx-auto shadow-sm transition-colors">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="url-input"
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Paste your link here..."
                  className="w-full pl-11 pr-12 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white focus:border-transparent text-base"
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-all"
                  title="Paste from clipboard"
                >
                  <ClipboardPaste className="w-5 h-5" strokeWidth={1.5} />
                </button>
              </div>
              <button 
                onClick={handleShorten} 
                disabled={loading || !url}
                className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Shorten Now'}
              </button>
            </div>

            {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-in fade-in slide-in-from-top-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {shortened && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-md p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-500 flex-shrink-0" />
                    <a href={`http://${shortened}`} target="_blank" rel="noreferrer" className="text-base font-medium truncate text-green-700 dark:text-green-400 hover:underline">{shortened}</a>
                  </div>
                  <button onClick={handleCopy} className="ml-3 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex-shrink-0 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md">
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                {!user && (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                        <Link to="/signup" className="text-neutral-900 dark:text-white font-medium hover:underline">Register</Link> to track statistics and manage your links permanently.
                    </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 max-w-2xl mx-auto">
              <AdsBanner 
                size="responsive" 
                className="w-full h-20 sm:h-24 shadow-sm" 
                label="Sponsored"
              />
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>High Security</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span>Real-time Stats</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-neutral-200 dark:border-neutral-800">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-4">Features</h2>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">Everything you need to manage affiliate links effectively</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: Link2, title: 'Custom Slugs', desc: 'Customize your URL paths or let us generate them.' },
            { icon: BarChart3, title: 'Detailed Analytics', desc: 'Track clicks, devices, locations and more.' },
            { icon: QrCode, title: 'QR Codes', desc: 'Auto-generated QR codes for every link.' },
            { icon: CalendarClock, title: 'Expiration Dates', desc: 'Set expiry dates and click limits.' },
            { icon: Shield, title: 'Bot Protection', desc: 'Detect and block fake traffic automatically.' },
            { icon: Code, title: 'Developer API', desc: 'Integrate into your apps via REST API.' },
          ].map((feature, idx) => (
            <div key={idx} className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-6 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors hover:shadow-sm bg-white dark:bg-neutral-800">
              <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-700 rounded-md flex items-center justify-center mb-4">
                <feature.icon className="w-5 h-5 text-neutral-900 dark:text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-base text-neutral-600 dark:text-neutral-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Capabilities Section */}
      <section id="dashboard-preview" className="bg-neutral-50 dark:bg-neutral-800/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
               <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white mb-6">
                 Powerful Dashboard<br/> 
                 <span className="text-neutral-500 dark:text-neutral-400">Insights at your fingertips.</span>
               </h2>
               <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
                 Dive deep into your audience behavior with our comprehensive analytics dashboard. 
                 Understand where your traffic comes from, what devices they use, and which links perform best.
               </p>
               <ul className="space-y-4">
                 {[
                   { text: 'Real-time click tracking and visitor data', icon: Zap },
                   { text: 'Geographic location & device breakdown', icon: Globe },
                   { text: 'Top performing products analysis', icon: BarChart3 },
                   { text: 'Exportable reports in CSV/PDF', icon: Layout },
                 ].map((item, i) => (
                   <li key={i} className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
                     <div className="p-1 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
                        <Check className="w-4 h-4" strokeWidth={2} />
                     </div>
                     {item.text}
                   </li>
                 ))}
               </ul>
               <div className="mt-8">
                 <Link to="/signup" className="inline-flex items-center gap-2 text-neutral-900 dark:text-white font-medium hover:underline">
                    Explore Dashboard <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
            </div>

            {/* Abstract Dashboard UI Visualization (Bento Grid) */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 rotate-1 hover:rotate-0 transition-transform duration-500">
               {/* Card 1: Total Clicks */}
               <div className="col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <BarChart3 className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Total Clicks</div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">24.5K</div>
                  <div className="text-xs text-green-600 dark:text-green-400 mt-1">+12% vs last week</div>
               </div>

               {/* Card 2: Devices */}
               <div className="col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                        <Smartphone className="w-4 h-4" />
                      </div>
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Mobile Users</div>
                  </div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-white">68%</div>
                  <div className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full mt-2">
                      <div className="h-full bg-purple-600 w-[68%] rounded-full"></div>
                  </div>
               </div>

               {/* Card 3: Chart Visual */}
               <div className="col-span-2 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700 h-32 flex flex-col justify-between">
                   <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Traffic Trend</span>
                      <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full">Live</span>
                   </div>
                   <div className="flex items-end gap-1 h-16">
                       {[30, 50, 45, 70, 60, 85, 95, 65, 75, 90].map((h, i) => (
                           <div key={i} className="flex-1 bg-neutral-900 dark:bg-white opacity-80 rounded-t-sm hover:opacity-100 transition-opacity" style={{ height: `${h}%` }}></div>
                       ))}
                   </div>
               </div>

               {/* Card 4: Locations */}
               <div className="col-span-2 lg:col-span-1 bg-neutral-50 dark:bg-neutral-800 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-3">
                      <Globe className="w-4 h-4 text-neutral-400" />
                      <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Top Locations</div>
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between text-sm text-neutral-900 dark:text-white">
                          <span className="flex items-center gap-2">🇻🇳 Vietnam</span>
                          <span className="font-semibold">62%</span>
                      </div>
                      <div className="flex justify-between text-sm text-neutral-900 dark:text-white">
                          <span className="flex items-center gap-2">🇺🇸 USA</span>
                          <span className="font-semibold">15%</span>
                      </div>
                  </div>
               </div>

               {/* Card 5: Quick Actions */}
               <div className="col-span-2 lg:col-span-1 bg-neutral-900 dark:bg-white p-4 rounded-xl border border-neutral-900 dark:border-white text-white dark:text-neutral-900 flex flex-col justify-center items-center text-center">
                   <QrCode className="w-8 h-8 mb-2" />
                   <div className="font-bold">Generate QR</div>
                   <div className="text-xs opacity-70">One-click creation</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">L</span>
                </div>
                <span className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-white">ShortLink</span>
              </Link>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                The professional link shortener designed for affiliate marketers and businesses.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Integration</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Resources</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link to="/blog" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Developer Docs</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Legal</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © 2024 ShortLink. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
