'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Crown, Zap, Flame, Trophy, TrendingUp, Clock, 
  CheckCircle, BookOpen, Users, MessageSquare,
  Shield, LogOut, Settings, ChevronRight, Edit,
  Target, Award, Zap as ZapIcon
} from 'lucide-react';
import { 
  ROLES, 
  type UserRole, 
  getVisualConfig,
  RANK_LEVELS,
  ESCALATION_PATHS
} from '@/lib/rbac';
import { useAuth } from '@/context/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';

interface User {
  id: string;
  email: string;
  nickname: string;
  fullName?: string;
  bio?: string;
  industry?: string;
  rankLevel: number;
  xpPoints: number;
  role: string;
  verified: boolean;
  createdAt: string;
}

// Rank icons and colors
const RANK_CONFIG = [
  { level: 1, name: 'Polaznik', icon: '📚', color: 'from-gray-400 to-gray-600', xp: 0 },
  { level: 2, name: 'Aktivni učenik', icon: '📖', color: 'from-blue-400 to-blue-600', xp: 100 },
  { level: 3, name: 'Pripravnik', icon: '🔨', color: 'from-cyan-400 to-cyan-600', xp: 250 },
  { level: 4, name: 'Kandidat', icon: '💼', color: 'from-green-400 to-green-600', xp: 500 },
  { level: 5, name: 'Preduzetnik', icon: '🚀', color: 'from-yellow-400 to-orange-500', xp: 1000 },
  { level: 6, name: 'Izvrsni direktor', icon: '👔', color: 'from-orange-400 to-red-500', xp: 2000 },
  { level: 7, name: 'Vizionar', icon: '💎', color: 'from-purple-400 to-pink-500', xp: 4000 },
];

export default function ProfilePage({ params }: { params: { id?: string } }) {
  const [showWelcome, setShowWelcome] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const { user: currentUser, isAuthenticated, logout, fetchUser } = useAuth();
  const router = useRouter();

  // Fetch user data
  useEffect(() => {
    async function fetchProfileUser() {
      if (!isAuthenticated) return;
      try {
        const token = localStorage.getItem('institut-biznis-token') || sessionStorage.getItem('institut-biznis-token');
        const response = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setProfileUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    }
    fetchProfileUser();
  }, [isAuthenticated, lastRefresh]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLastRefresh(Date.now());
        fetchUser();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    
    // Check if first login
    if (isAuthenticated && currentUser) {
      const hasSeenWelcome = localStorage.getItem('hideWelcomeModal');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
    }
  }, [params, currentUser, isAuthenticated, router]);

  if (!isAuthenticated || !currentUser || !profileUser) {
    return null;
  }

  const user = profileUser;
  const userRankConfig = RANK_CONFIG[user.rankLevel - 1] || RANK_CONFIG[0];
  const nextRankConfig = RANK_CONFIG[user.rankLevel] || null;
  
  // Calculate progress to next rank
  const currentXP = user.xpPoints || 0;
  const xpForCurrentRank = userRankConfig.xp;
  const xpForNextRank = nextRankConfig?.xp || userRankConfig.xp * 2;
  const xpInCurrentRank = currentXP - xpForCurrentRank;
  const xpNeededForNext = xpForNextRank - xpForCurrentRank;
  const progressPercent = nextRankConfig ? Math.min(100, (xpInCurrentRank / xpNeededForNext) * 100) : 100;

  const visual = getVisualConfig((user.role || 'polaznik') as UserRole);
  const membershipDays = user.createdAt 
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 blur-[150px]" />
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] rounded-full bg-primary-500/5 blur-[200px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">IB</div>
            <span className="font-bold">Institut Biznis</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {['founder', 'vision_lead', 'admin', 'community_lead', 'moderator', 'support_lead', 'support_agent', 'project_leader'].includes(user.role) && (
              <Link href="/admin" className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm border border-red-500/30 hover:bg-red-500/30 transition-colors">
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-1.5 bg-dark-700 text-dark-300 rounded-lg text-sm border border-dark-600 hover:bg-dark-600 hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
              Izloguj se
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <Card className="overflow-hidden">
            <div className={`h-32 bg-gradient-to-r ${userRankConfig.color} relative`}>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522202176988-66273c2fd55?w=800')] bg-cover bg-center opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-900 to-transparent" />
              
              {/* Actions */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Link href="/settings" className="p-2 bg-dark-800/50 rounded-lg hover:bg-dark-700 transition-colors">
                  <Settings className="w-4 h-4 text-dark-300" />
                </Link>
              </div>
            </div>
            
            <CardBody className="px-8 pb-8">
              <div className="relative -mt-16 mb-4">
                <Avatar size="3xl" status="online" className="ring-4 ring-dark-900">
                  {user.nickname?.charAt(0).toUpperCase()}
                </Avatar>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-dark-900">
                    <CheckCircle className="w-4 h-4 text-dark-900" />
                  </div>
                )}
              </div>
              
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{user.nickname}</h1>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${visual.colorClass} bg-opacity-20 border ${visual.borderColor}`}>
                      {visual.icon} {visual.name}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${userRankConfig.color} bg-opacity-20 border border-transparent`}>
                      {userRankConfig.icon} {userRankConfig.name}
                    </span>
                  </div>
                  {user.fullName && <p className="text-dark-400 mt-2">{user.fullName}</p>}
                  {user.bio && <p className="text-dark-300 mt-2 max-w-md">{user.bio}</p>}
                </div>
                
                {/* Quick Stats */}
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-2xl font-bold text-yellow-400">{currentXP.toLocaleString()}</p>
                    <p className="text-xs text-dark-400">XP</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-400">{membershipDays}</p>
                    <p className="text-xs text-dark-400">Dana</p>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* XP Progress */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-medium">XP Progress</span>
                </div>
                <div className="text-sm text-dark-400">
                  {currentXP.toLocaleString()} XP
                </div>
              </div>
              
              <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${userRankConfig.color} rounded-full transition-all duration-500`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <div className="flex justify-between mt-2 text-xs text-dark-500">
                <span>{xpForCurrentRank.toLocaleString()} XP</span>
                {nextRankConfig ? (
                  <span className="text-blue-400 font-medium">
                    → {nextRankConfig.name} ({xpForNextRank.toLocaleString()} XP)
                  </span>
                ) : (
                  <span className="text-yellow-400 font-medium">Maksimum dostignut!</span>
                )}
              </div>
            </CardBody>
          </Card>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Quick Navigation */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-primary-400" />
                  Brza navigacija
                </h3>
              </CardHeader>
              <CardBody className="space-y-2">
                <Link href="/courses" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <BookOpen className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Kursevi</p>
                    <p className="text-xs text-dark-400">Pristup edukaciji</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/community" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Users className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Zajednica</p>
                    <p className="text-xs text-dark-400">Poveži se sa drugima</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link href="/challenges" className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl hover:bg-dark-700/50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
                    <Target className="w-5 h-5 text-yellow-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Izazovi</p>
                    <p className="text-xs text-dark-400">Takmičenja i nagrade</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-dark-500 group-hover:translate-x-1 transition-transform" />
                </Link>
              </CardBody>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Aktivnost
                </h3>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-800/50 rounded-xl text-center">
                    <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                    <p className="text-xl font-bold">{membershipDays}</p>
                    <p className="text-xs text-dark-400">Dana članstva</p>
                  </div>
                  
                  <div className="p-4 bg-dark-800/50 rounded-xl text-center">
                    <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-xl font-bold">3</p>
                    <p className="text-xs text-dark-400">Dostignuća</p>
                  </div>
                  
                  <div className="p-4 bg-dark-800/50 rounded-xl text-center">
                    <Trophy className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-xl font-bold">1</p>
                    <p className="text-xs text-dark-400">Pobede</p>
                  </div>
                  
                  <div className="p-4 bg-dark-800/50 rounded-xl text-center">
                    <Clock className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-xl font-bold">24h</p>
                    <p className="text-xs text-dark-400">Aktivno</p>
                  </div>
                </div>
              </CardBody>
            </Card>

          </div>

          {/* Achievements */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-dark-700 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
              <h3 className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-400" />
                Dostignuća
              </h3>
            </div>
            <CardBody>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {[
                  { icon: '🎯', name: 'Prvi korak', earned: true },
                  { icon: '🔥', name: '7 dana', earned: true },
                  { icon: '💬', name: 'Prvi post', earned: true },
                  { icon: '⭐', name: '100+ reakcija', earned: false },
                  { icon: '📚', name: 'Kurs zavrsen', earned: false },
                  { icon: '🏆', name: 'Pobednik', earned: false },
                ].map((achievement) => (
                  <div 
                    key={achievement.name}
                    className={`p-3 rounded-xl text-center transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/10 border border-yellow-500/30 hover:scale-105' 
                        : 'bg-dark-800/50 border border-dark-700 opacity-50'
                    }`}
                  >
                    <span className="text-2xl block mb-1">{achievement.icon}</span>
                    <p className={`text-xs ${achievement.earned ? 'text-yellow-400' : 'text-dark-500'}`}>
                      {achievement.name}
                    </p>
                    {achievement.earned && (
                      <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Rank Ladder */}
          <Card>
            <CardHeader>
              <h3 className="font-bold flex items-center gap-2">
                <Crown className="w-5 h-5 text-gold-400" />
                Rang lestvica
              </h3>
            </CardHeader>
            <CardBody>
              <div className="space-y-3">
                {RANK_CONFIG.map((rank) => (
                  <div 
                    key={rank.level}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      rank.level === user.rankLevel 
                        ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/10 border border-blue-500/30' 
                        : rank.level < user.rankLevel 
                          ? 'bg-dark-800/30 opacity-60'
                          : 'bg-dark-800/50'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rank.color} flex items-center justify-center text-lg`}>
                      {rank.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${rank.level === user.rankLevel ? 'text-blue-400' : ''}`}>
                        {rank.name}
                      </p>
                      <p className="text-xs text-dark-500">{rank.xp.toLocaleString()} XP</p>
                    </div>
                    {rank.level === user.rankLevel && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">Trenutni</span>
                    )}
                    {rank.level < user.rankLevel && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          {/* Role Info */}
          <Card className="bg-gradient-to-br from-dark-800/80 to-dark-900/80 border-primary-500/20">
            <CardBody>
              <div className="flex items-start gap-4">
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${visual.colorClass} flex items-center justify-center text-3xl`}>
                  {visual.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-1">{visual.name}</h3>
                  <p className="text-dark-400 text-sm mb-3">{visual.description}</p>
                  
                  {visual.responsibilities && (
                    <div className="space-y-1">
                      {visual.responsibilities.slice(0, 3).map((resp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-dark-500">
                          <CheckCircle className="w-3 h-3 text-green-400" />
                          {resp}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardBody>
          </Card>

        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass">
        <div className="max-w-4xl mx-auto px-4 py-2 flex items-center justify-around">
          <Link href="/courses" className="flex flex-col items-center gap-1 p-2 text-dark-400 hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Kursevi</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center gap-1 p-2 text-dark-400 hover:text-white transition-colors">
            <Users className="w-5 h-5" />
            <span className="text-xs">Zajednica</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-primary-400">
            <Avatar size="sm">{user.nickname?.charAt(0).toUpperCase()}</Avatar>
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
