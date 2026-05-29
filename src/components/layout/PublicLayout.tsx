'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Twitter, Github, Linkedin, Menu, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const isLandingPage = pathname === '/';

  const navLinks = [
    { label: 'Tính năng', href: isLandingPage ? '#features' : '/#features' },
    { label: 'Bảng điều khiển', href: isLandingPage ? '#dashboard-preview' : '/#dashboard-preview' },
    { label: 'Bảng giá', href: isLandingPage ? '#pricing' : '/#pricing' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900 min-h-screen flex flex-col transition-colors duration-300">
      {/* Navbar */}
      <nav className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-semibold text-xl tracking-tight flex items-center gap-2 text-neutral-900 dark:text-white">
                <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">L</span>
                </div>
                ShortLink
              </Link>
              <div className="hidden md:flex gap-6 text-sm">
                {navLinks.map((link) => (
                  <a 
                    key={link.label}
                    href={link.href} 
                    className="text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                {user ? (
                  <Link href="/dashboard" className="text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">
                      Bảng điều khiển
                  </Link>
                ) : (
                  <>
                      <Link href="/login" className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors px-4 py-2">Đăng nhập</Link>
                      <Link href="/signup" className="text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-4 py-2 rounded-md hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors font-medium">Bắt đầu ngay</Link>
                  </>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button 
                className="md:hidden p-2 text-neutral-600 dark:text-neutral-300"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="px-4 pt-2 pb-4 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 flex flex-col gap-2">
                {user ? (
                  <Link href="/dashboard" className="block text-center px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium">
                    Bảng điều khiển
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="block text-center px-4 py-2 text-neutral-600 dark:text-neutral-300 font-medium">Đăng nhập</Link>
                    <Link href="/signup" className="block text-center px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md font-medium">Bắt đầu ngay</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-neutral-900 dark:bg-white rounded-lg flex items-center justify-center">
                  <span className="text-white dark:text-neutral-900 font-bold text-lg">L</span>
                </div>
                <span className="font-semibold text-xl tracking-tight text-neutral-900 dark:text-white">ShortLink</span>
              </Link>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
                Công cụ rút gọn link chuyên nghiệp dành cho các nhà tiếp thị liên kết và doanh nghiệp.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
                <a href="#" className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Sản phẩm</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="/#features" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Tính năng</a></li>
                <li><a href="/#pricing" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Bảng giá</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Tích hợp</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Tài nguyên</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><Link href="/blog" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Blog</Link></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Tài liệu cho nhà phát triển</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Trạng thái</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">Công ty</h3>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Về chúng tôi</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Tuyển dụng</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Pháp lý</a></li>
                <li><a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Liên hệ</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © 2024 ShortLink. Đã đăng ký bản quyền.
            </p>
            <div className="flex gap-6 text-sm text-neutral-500 dark:text-neutral-400">
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Chính sách bảo mật</a>
              <a href="#" className="hover:text-neutral-900 dark:hover:text-white transition-colors">Điều khoản dịch vụ</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
