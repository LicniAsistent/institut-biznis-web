'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      // Check if user has admin role - redirect to admin
      const token = localStorage.getItem('institut-biznis-token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const userRole = payload.role;
          if (userRole === 'founder' || userRole === 'vision_lead' || userRole === 'admin') {
            router.push('/admin');
            return;
          }
        } catch (e) {
          // Invalid token, continue to profile
        }
      }
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Došlo je do greške. Pokušajte ponovo.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-primary-500/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Nazad na početnu
        </Link>

        <Card variant="gradient">
          <CardBody className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <Badge variant="primary" className="mb-4"> Dobrodošli nazad! </Badge>
              <h1 className="text-3xl font-bold mb-2">Prijavi se</h1>
              <p className="text-dark-400">
                Ili{' '}
                <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 transition-colors">
                  kreiraj novi nalog
                </Link>
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email adresa
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tvoj@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Lozinka
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-12 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-dark-500 hover:text-dark-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-dark-700 bg-dark-800 text-primary-500 focus:ring-primary-500" />
                  <span className="text-sm text-dark-400">Zapamti me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">
                  Zaboravljena lozinka?
                </Link>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={isLoading}
              >
                {isLoading ? 'Prijavljivanje...' : 'Prijavi se'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dark-700" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-dark-900 text-dark-500">ili</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <Button variant="secondary" fullWidth>
                Google
              </Button>
              <Button variant="secondary" fullWidth>
                Facebook
              </Button>
            </div>

            {/* Benefits */}
            <div className="mt-8 p-4 bg-dark-800/50 rounded-lg">
              <h3 className="font-semibold mb-3 text-center">Šta dobijaš?</h3>
              <div className="space-y-2 text-sm text-dark-400">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-500" />
                  <span>Pristup zajednici od 10.000+ članova</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-500" />
                  <span>XP i rang sistem</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary-500" />
                  <span>Besplatni uvodni kurs</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <p className="text-center text-dark-500 text-sm mt-6">
          Nemaš nalog?{' '}
          <Link href="/auth/register" className="text-primary-400 hover:text-primary-300 transition-colors">
            Registruj se besplatno
          </Link>
        </p>
      </div>
    </div>
  );
}
