'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    fullName: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Loinke se ne poklapaju');
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Lozinka mora imati najmanje 6 karaktera');
      setIsLoading(false);
      return;
    }

    // Validate nickname
    if (formData.nickname.length < 3) {
      setError('Nadimak mora imati najmanje 3 karaktera');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.email, formData.password, formData.nickname, formData.fullName);
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
              <Badge variant="primary" className="mb-4"> Pridruži se zajednici! </Badge>
              <h1 className="text-3xl font-bold mb-2">Kreiraj nalog</h1>
              <p className="text-dark-400">
                Ili se{' '}
                <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 transition-colors">
                  prijavi
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
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Ime i prezime <span className="text-dark-500">(opciono)</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Petar Petrović"
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Nickname */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Nadimak <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="text"
                    name="nickname"
                    value={formData.nickname}
                    onChange={handleChange}
                    placeholder="petar123"
                    required
                    minLength={3}
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Email adresa <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tvoj@email.com"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Lozinka <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={6}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Potvrdi lozinku <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-dark-800 border border-dark-700 rounded-lg text-white placeholder-dark-500 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button 
                type="submit" 
                variant="primary" 
                fullWidth 
                loading={isLoading}
              >
                {isLoading ? 'Kreiranje naloga...' : 'Kreiraj nalog'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
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
            <div className="mt-6 p-4 bg-dark-800/50 rounded-lg">
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
          Imaš nalog?{' '}
          <Link href="/auth/login" className="text-primary-400 hover:text-primary-300 transition-colors">
            Prijavi se
          </Link>
        </p>
      </div>
    </div>
  );
}
