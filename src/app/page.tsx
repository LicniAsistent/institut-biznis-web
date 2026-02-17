'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { 
  ArrowRight, Lock, Unlock, Star, Trophy, Users, 
  BookOpen, MessageSquare, ChevronDown, Target,
  TrendingUp, Zap, Clock, CheckCircle, Play, Home, Book, Users as UsersIcon
} from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // If logged in, show simplified dashboard view
  if (isAuthenticated && user) {
    return <LoggedInHome user={user} />;
  }

  // Original landing page for non-logged-in users
  return <LandingPage />;
}

function LoggedInHome({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden pt-12">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-blue-500/10 blur-[80px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-500/10 blur-[80px]" />
      </div>

      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-gold-500 flex items-center justify-center font-bold text-sm">
              IB
            </div>
            <span className="font-bold">Institut Biznis</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-dark-400">Zdravo, {user.nickname || user.email.split('@')[0]}!</span>
            <Link href="/profile">
              <Avatar size="sm" status="online" />
            </Link>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <section className="pt-20 pb-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">
            Dobrodošao nazad, {user.nickname || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-dark-400">Nastavi gde si stao — tvoj biznis čeka.</p>
        </div>
      </section>

      {/* Quick Navigation - Compact Cards */}
      <section className="px-4 pb-8">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          {/* Community */}
          <Link href="/community" className="group">
            <Card variant="glass" className="h-full hover:bg-dark-800/80 transition-all">
              <CardBody className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UsersIcon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold text-sm">Zajednica</h3>
                <p className="text-xs text-dark-400 mt-1">247 online</p>
              </CardBody>
            </Card>
          </Link>

          {/* Courses */}
          <Link href="/courses" className="group">
            <Card variant="glass" className="h-full hover:bg-dark-800/80 transition-all">
              <CardBody className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Book className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold text-sm">Kursevi</h3>
                <p className="text-xs text-dark-400 mt-1">50+ kurseva</p>
              </CardBody>
            </Card>
          </Link>

          {/* Profile */}
          <Link href="/profile" className="group">
            <Card variant="glass" className="h-full hover:bg-dark-800/80 transition-all">
              <CardBody className="p-4 text-center">
                <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Avatar size="sm" />
                </div>
                <h3 className="font-semibold text-sm">Profil</h3>
                <p className="text-xs text-dark-400 mt-1">Rank {user.rankLevel}</p>
              </CardBody>
            </Card>
          </Link>
        </div>
      </section>

      {/* Stats Row */}
      <section className="px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="text-2xl font-bold text-primary-500">{user.xpPoints}</div>
              <div className="text-xs text-dark-400">XP</div>
            </div>
            <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="text-2xl font-bold text-gold-500">{user.rankLevel}</div>
              <div className="text-xs text-dark-400">Rank</div>
            </div>
            <div className="text-center p-3 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="text-2xl font-bold text-green-500">3</div>
              <div className="text-xs text-dark-400">Dani</div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold mb-3">Brzi pristup</h2>
          <div className="space-y-2">
            <Link href="/community" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700 hover:bg-dark-800 transition-colors">
              <UsersIcon className="w-5 h-5 text-green-400" />
              <span className="flex-1">Pogledaj aktivnost u zajednici</span>
              <ArrowRight className="w-4 h-4 text-dark-400" />
            </Link>
            <Link href="/courses" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700 hover:bg-dark-800 transition-colors">
              <Book className="w-5 h-5 text-purple-400" />
              <span className="flex-1">Nastavi sa lekcijama</span>
              <ArrowRight className="w-4 h-4 text-dark-400" />
            </Link>
            <Link href="/challenges" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-lg border border-dark-700 hover:bg-dark-800 transition-colors">
              <Trophy className="w-5 h-5 text-gold-400" />
              <span className="flex-1">Pogledaj izazove</span>
              <ArrowRight className="w-4 h-4 text-dark-400" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-15%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute top-[20%] right-[-5%] w-[35vw] h-[35vw] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-gold-500/8 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.015)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/80 backdrop-blur-lg border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-gold-500 flex items-center justify-center font-bold">IB</div>
            <span className="font-bold text-lg">Institut Biznis</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="px-4 py-2 text-sm text-dark-300 hover:text-white transition-colors">
              Prijavi se
            </Link>
            <Link href="/auth/register" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors">
              Registruj se
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            <span className="text-blue-400 text-sm font-medium">Prvi hakaton — Mart 2026!</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            <span className="text-gradient">Zaradi</span> znanje.{' '}
            <span className="text-gradient-gold">Znanje</span> donosi pare.
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-dark-300 mb-10 max-w-3xl mx-auto">
            Pridruži se <span className="text-blue-400 font-semibold">10.000+ preduzetnika</span> koji uče, rastu i zarađuju zajedno.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/register">
              <Button variant="primary" size="xl" className="w-full sm:w-auto">
                Pridruži se besplatno
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button variant="outline" size="xl" className="w-full sm:w-auto">
                <Play className="w-5 h-5 mr-2" />
                Pogledaj kurseve
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700">
              <div className="text-3xl font-bold text-primary-500 mb-1">10K+</div>
              <div className="text-dark-400 text-sm">Članova</div>
            </div>
            <div className="p-4 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700">
              <div className="text-3xl font-bold text-gold-500 mb-1">50+</div>
              <div className="text-dark-400 text-sm">Kurseva</div>
            </div>
            <div className="p-4 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700">
              <div className="text-3xl font-bold text-purple-500 mb-1">100+</div>
              <div className="text-dark-400 text-sm">Izazova</div>
            </div>
            <div className="p-4 bg-dark-800/50 backdrop-blur rounded-xl border border-dark-700">
              <div className="text-3xl font-bold text-green-500 mb-1">5M</div>
              <div className="text-dark-400 text-sm">Zaradjenih €</div>
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-dark-500" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="primary" className="mb-4">Zašto Institut Biznis?</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sve što ti treba za uspeh
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="gradient" hover>
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-primary-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Praktični kursevi</h3>
                <p className="text-dark-400 text-sm">
                  Uči od iskusnih preduzetnika. Svaki kurs je korak-po-korak vodič.
                </p>
              </CardBody>
            </Card>

            <Card variant="gradient" hover>
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-gold-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Zajednica</h3>
                <p className="text-dark-400 text-sm">
                  Poveži se sa 10.000+ ljudi. "Ko daje — dobija" je naše pravilo.
                </p>
              </CardBody>
            </Card>

            <Card variant="gradient" hover>
              <CardBody className="p-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Izazovi</h3>
                <p className="text-dark-400 text-sm">
                  Takmičenja sa nagradama. Dokaži znanje, zaradi novac.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Spreman da promeniš igru?
          </h2>
          <p className="text-dark-400 mb-8">
            Besplatna registracija — nikakav rizik. Za 30 sekundi imaš pristup zajednici.
          </p>
          <Link href="/auth/register">
            <Button variant="primary" size="xl">
              Registruj se besplatno
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-gold-500 flex items-center justify-center font-bold text-sm">IB</div>
            <span className="font-bold">Institut Biznis</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-dark-400">
            <Link href="/courses" className="hover:text-white transition-colors">Kursevi</Link>
            <Link href="/community" className="hover:text-white transition-colors">Zajednica</Link>
            <Link href="/about" className="hover:text-white transition-colors">O nama</Link>
          </div>
          <p className="text-dark-500 text-sm">© 2026 Institut Biznis</p>
        </div>
      </footer>
    </div>
  );
}