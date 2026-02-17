'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, Users, User, ChevronDown, LogOut, Crown, Home } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/ui/Avatar';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    logout();
    router.push('/auth/login');
  };

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // If on auth pages, don't show navigation
  if (pathname?.includes('/auth/')) return null;

  // If not authenticated, show minimal nav
  if (!isAuthenticated || !user) {
    const isLanding = pathname === '/';
    return (
      <nav className={`fixed ${isLanding ? 'top-0' : 'bottom-0'} left-0 right-0 z-50 ${isLanding ? 'bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50' : 'bg-dark-800/95 backdrop-blur-lg border-t border-dark-700'}`}>
        <div className={`${isLanding ? 'max-w-7xl mx-auto px-4 py-3 flex items-center justify-between' : 'flex items-center justify-around py-2'}`}>
          {isLanding ? (
            <>
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-green-600 flex items-center justify-center font-bold">IB</div>
                <span className="font-bold text-lg">Institut Biznis</span>
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors">Prijavi se</Link>
                <Link href="/auth/register" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">Registruj se</Link>
              </div>
            </>
          ) : (
            <>
              <Link href="/courses" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-dark-400 hover:text-white">
                <div className="p-2 rounded-lg"><BookOpen className="w-5 h-5" /></div>
                <span className="text-xs font-medium">Kursevi</span>
              </Link>
              <Link href="/community" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-dark-400 hover:text-white">
                <div className="p-2 rounded-lg"><Users className="w-5 h-5" /></div>
                <span className="text-xs font-medium">Zajednica</span>
              </Link>
              <Link href="/auth/login" className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl text-dark-400 hover:text-white">
                <div className="p-2 rounded-lg"><User className="w-5 h-5" /></div>
                <span className="text-xs font-medium">Prijavi se</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    );
  }

  // User is authenticated - show user menu
  const isLanding = pathname === '/';

  return (
    <>
      {isLanding ? (
        // Landing page - user menu in top right
        <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-green-600 flex items-center justify-center font-bold">IB</div>
              <span className="font-bold text-lg">Institut Biznis</span>
            </Link>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-dark-800 transition-colors"
              >
                <Avatar size="sm" status="online">{user.nickname?.charAt(0) || '?'}</Avatar>
                <span className="hidden sm:block text-sm font-medium">{user.nickname}</span>
                <ChevronDown className={`w-4 h-4 text-dark-400 transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-dark-800 border border-dark-700 rounded-xl shadow-xl z-20 overflow-hidden">
                    <div className="p-4 border-b border-dark-700">
                      <p className="font-bold text-sm">{user.nickname}</p>
                      <p className="text-xs text-dark-400 truncate">{user.email}</p>
                    </div>
                    
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-dark-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <User className="w-4 h-4 text-blue-400" />Moj profil
                      </Link>
                      
                      {user.role === 'founder' || user.role === 'vision_lead' || user.role === 'admin' ? (
                        <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-dark-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                          <Crown className="w-4 h-4 text-gold-400" />Admin Panel
                        </Link>
                      ) : null}
                      
                      <Link href="/courses" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-dark-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <BookOpen className="w-4 h-4 text-purple-400" />Kursevi
                      </Link>
                      
                      <Link href="/community" className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-dark-700 transition-colors" onClick={() => setIsMenuOpen(false)}>
                        <Users className="w-4 h-4 text-green-400" />Zajednica
                      </Link>
                    </div>
                    
                    <div className="border-t border-dark-700 py-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-500/20 text-red-400 transition-colors w-full">
                        <LogOut className="w-4 h-4" />Izloguj se
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </nav>
      ) : (
        // Other pages - bottom nav
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800/95 backdrop-blur-lg border-t border-dark-700">
          <div className="flex items-center justify-around py-2">
            <Link href="/courses" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${pathname?.startsWith('/courses') ? 'text-white bg-dark-700' : 'text-dark-400 hover:text-white'}`}>
              <div className={`p-2 rounded-lg ${pathname?.startsWith('/courses') ? 'bg-gradient-to-br from-purple-500 to-pink-500' : ''}`}><BookOpen className="w-5 h-5" /></div>
              <span className="text-xs font-medium">Kursevi</span>
            </Link>
            
            <Link href="/community" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${pathname?.startsWith('/community') ? 'text-white bg-dark-700' : 'text-dark-400 hover:text-white'}`}>
              <div className={`p-2 rounded-lg ${pathname?.startsWith('/community') ? 'bg-gradient-to-br from-green-500 to-emerald-600' : ''}`}><Users className="w-5 h-5" /></div>
              <span className="text-xs font-medium">Zajednica</span>
            </Link>
            
            <Link href="/profile" className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${pathname?.startsWith('/profile') ? 'text-white bg-dark-700' : 'text-dark-400 hover:text-white'}`}>
              <div className={`p-2 rounded-lg ${pathname?.startsWith('/profile') ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : ''}`}><User className="w-5 h-5" /></div>
              <span className="text-xs font-medium">Profil</span>
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
