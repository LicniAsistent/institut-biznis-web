'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Settings, Crown, Zap, Edit, CheckCircle, 
  Briefcase, BookOpen, Flame, Users, 
  BarChart3, Star, GraduationCap, Info,
  TrendingUp, Clock, Calendar, MessageSquare, Eye, Heart,
  Trophy, Shield, LogOut
} from 'lucide-react';
import { 
  ROLES, 
  type UserRole, 
  getVisualConfig,
  RANK_LEVELS
} from '@/lib/rbac';
import { useAuth } from '@/context/AuthContext';
import WelcomeModal from '@/components/WelcomeModal';

export default function ProfilePage({ params }: { params: { id?: string } }) {
  const [showRankModal, setShowRankModal] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showRolesModal, setShowRolesModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now());

  const { user: currentUser, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  // Fetch fresh user data
  useEffect(() => {
    async function fetchProfileUser() {
      if (!isAuthenticated) return;
      try {
        const token = localStorage.getItem('institut-biznis-token');
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

  // Refresh when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setLastRefresh(Date.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (!params?.id) {
      setIsOwnProfile(true);
    } else if (currentUser && params.id === currentUser.id) {
      setIsOwnProfile(true);
    } else {
      setIsOwnProfile(false);
    }
    
    // Check if first login - show welcome modal
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

  // Calculate rank based on XP
  const getRankForXP = (xp: number) => {
    if (xp >= 4000) return { name: 'Vizionar', level: 7, icon: '💎' };
    if (xp >= 2000) return { name: 'Izvrsni direktor', level: 6, icon: '👔' };
    if (xp >= 1000) return { name: 'Preduzetnik', level: 5, icon: '🚀' };
    if (xp >= 500) return { name: 'Kandidat', level: 4, icon: '💼' };
    if (xp >= 250) return { name: 'Pripravnik', level: 3, icon: '🔨' };
    if (xp >= 100) return { name: 'Aktivni ucenik', level: 2, icon: '📖' };
    return { name: 'Polaznik', level: 1, icon: '📚' };
  };

  const userRank = getRankForXP(user.xpPoints || 0);

  // Get role visual config
  const primaryRole = (user.role || 'polaznik').toLowerCase();
  const visual = getVisualConfig(primaryRole as UserRole);

  const ranks = [
    { level: 1, name: 'Polaznik', icon: '📚' },
    { level: 2, name: 'Aktivni ucenik', icon: '📖' },
    { level: 3, name: 'Pripravnik', icon: '🔨' },
    { level: 4, name: 'Kandidat', icon: '💼' },
    { level: 5, name: 'Preduzetnik', icon: '🚀' },
    { level: 6, name: 'Izvrsni direktor', icon: '👔' },
    { level: 7, name: 'Vizionar', icon: '💎' },
  ];

  // Calculate membership days from REAL data
  const membershipDays = user.createdAt 
    ? Math.floor((Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Calculate REAL progress for auto-promotion
  const getRealProgress = () => {
    const xp = user.xpPoints || 0;
    const days = membershipDays;
    const rank = userRank.level;
    
    const xpProgress = Math.min(100, (xp / 4000) * 100);
    const daysProgress = Math.min(100, (days / 60) * 100);
    const rankProgress = Math.min(100, (rank / 7) * 100);
    
    return {
      xp,
      xpProgress,
      days,
      daysProgress,
      rank,
      rankProgress,
      overall: Math.round((xpProgress + daysProgress + rankProgress) / 3)
    };
  };

  const realProgress = getRealProgress();

  // Get next rank XP threshold
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000];
  const currentXP = user.xpPoints || 0;
  const nextThreshold = xpThresholds[userRank.level] || 4000;
  const currentThreshold = xpThresholds[userRank.level - 1] || 0;
  const xpProgressPercent = Math.min(100, ((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-24">
      {/* Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onClose={() => setShowWelcome(false)} />
      
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <main className="pt-6 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Profile Header */}
          <div className="flex items-start gap-4">
            <Avatar size="xl" status="online">{user.nickname?.charAt(0) || '?'}</Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{user.nickname}</h1>
                {user.verified && <span className="text-yellow-500">✓</span>}
              </div>
              {/* Role badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${visual.colorClass} bg-opacity-20 border ${visual.borderColor}`}>
                  {visual.icon} {visual.name}
                </span>
              </div>
              {user.fullName && <p className="text-dark-400 text-sm">{user.fullName}</p>}
              {user.bio && <p className="text-dark-300 text-sm mt-1">{user.bio}</p>}
              
              {/* Get role from token directly */}
              {(() => {
                try {
                  const token = localStorage.getItem('institut-biznis-token');
                  if (token) {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const userRole = payload.role || 'polaznik';
                    const hasAdminAccess = ['founder', 'vision_lead', 'admin', 'moderator', 'moderator_lead', 'support_agent', 'support_lead', 'community_lead', 'project_leader'].includes(userRole);
                    
                    return (
                      <>
                        {hasAdminAccess && (
                          <Link href="/admin" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30 hover:bg-red-500/30 transition-colors">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm font-medium">Admin Panel</span>
                          </Link>
                        )}
                        <button 
                          onClick={() => { logout(); router.push('/'); }}
                          className="inline-flex items-center gap-2 mt-3 ml-2 px-4 py-2 bg-dark-700 text-dark-300 rounded-lg border border-dark-600 hover:bg-dark-600 hover:text-white transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm font-medium">Izloguj se</span>
                        </button>
                      </>
                    );
                  }
                } catch (e) {
                  console.error('Error parsing token:', e);
                }
                return (
                  <button 
                    onClick={() => { logout(); router.push('/'); }}
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-dark-700 text-dark-300 rounded-lg border border-dark-600 hover:bg-dark-600 hover:text-white transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-medium">Izloguj se</span>
                  </button>
                );
              })()}
            </div>
          </div>

          {/* Stats Row */}
          <Card>
            <CardBody>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-dark-800/50 rounded-xl text-center">
                  <Crown className="w-5 h-5 text-gold-400 mx-auto mb-2" />
                  <p className="text-xl font-bold">{userRank.name}</p>
                  <p className="text-xs text-dark-400">Rang</p>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-xl text-center">
                  <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
                  <p className="text-xl font-bold">{currentXP.toLocaleString()}</p>
                  <p className="text-xs text-dark-400">XP</p>
                </div>
                <div className="p-3 bg-dark-800/50 rounded-xl text-center">
                  <Flame className="w-5 h-5 text-orange-400 mx-auto mb-2" />
                  <p className="text-xl font-bold">{membershipDays}</p>
                  <p className="text-xs text-dark-400">Dana</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* XP Progress Bar */}
          <Card>
            <CardBody>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-dark-300">XP Progress</span>
                <span className="text-sm text-dark-400">{currentXP.toLocaleString()} XP</span>
              </div>
              <div className="h-3 bg-dark-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-400 rounded-full transition-all duration-500"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-xs text-dark-500">
                <span>{currentThreshold.toLocaleString()} XP</span>
                <span className="text-blue-400 font-medium">{nextThreshold.toLocaleString()} XP</span>
              </div>
            </CardBody>
          </Card>

          {/* Main Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* AKTIVNOST */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">🔥</span>Aktivnost</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">🔥</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{realProgress.days} dana uzastopno</p>
                      <p className="text-xs text-dark-400">Sledeći bedž za 7 dana</p>
                    </div>
                    <span className="text-sm text-dark-400">{realProgress.days}d</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">💬</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Prvi post</p>
                      <p className="text-xs text-dark-400">Napiši prvi post</p>
                    </div>
                    <Clock className="w-4 h-4 text-dark-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">🏆</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Pobednik izazova</p>
                      <p className="text-xs text-dark-400">Učestvuj u izazovima</p>
                    </div>
                    <Clock className="w-4 h-4 text-dark-500" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* POVERENJE */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">⭐</span>Poverenje</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Verifikovan</p>
                      <p className="text-xs text-dark-400">Proveren identitet</p>
                    </div>
                    {user.verified ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Clock className="w-4 h-4 text-dark-500" />}
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">❤️</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">100+ reakcija</p>
                      <p className="text-xs text-dark-400">Sviđanja na postovima</p>
                    </div>
                    <Clock className="w-4 h-4 text-dark-500" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* ULOGE */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">🛡️</span>Uloge</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">{visual.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{visual.name}</p>
                      <p className="text-xs text-dark-400">Čin</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* EDUKACIJA */}
            <Card>
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2"><span className="text-xl">🎓</span>Edukacija</h3>
              </CardHeader>
              <CardBody>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">🚗</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Polaznik kursa</p>
                      <p className="text-xs text-dark-400">Upisan kurs</p>
                    </div>
                    <Clock className="w-4 h-4 text-dark-500" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-dark-800/50 rounded-xl">
                    <span className="text-2xl">✅</span>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Zavrsen kurs</p>
                      <p className="text-xs text-dark-400">Svi kursevi</p>
                    </div>
                    <Clock className="w-4 h-4 text-dark-500" />
                  </div>
                </div>
              </CardBody>
            </Card>

          </div>

          {/* Achievements Section */}
          <Card className="p-6">
            <h3 className="font-bold flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-400" />
              Dostignuća
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Prvi korak', icon: '🎯', earned: true },
                { name: '7 dana uzastopno', icon: '🔥', earned: true },
                { name: 'Prvi post', icon: '💬', earned: true },
                { name: '50+ reakcija', icon: '❤️', earned: false },
                { name: 'Završen kurs', icon: '📚', earned: false },
                { name: 'Pobednik izazova', icon: '🏆', earned: false },
              ].map((achievement) => (
                <div 
                  key={achievement.name}
                  className={`p-3 rounded-xl text-center ${
                    achievement.earned 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' 
                      : 'bg-dark-800/50 border border-dark-700 opacity-50'
                  }`}
                >
                  <span className="text-2xl mb-1 block">{achievement.icon}</span>
                  <p className={`text-xs ${achievement.earned ? 'text-yellow-400' : 'text-dark-500'}`}>
                    {achievement.name}
                  </p>
                  {achievement.earned && (
                    <CheckCircle className="w-4 h-4 text-green-400 mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Auto-Promotion Engine */}
          {isOwnProfile && (
            <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/30">
              <CardHeader>
                <h3 className="font-bold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Auto-Promotion Engine
                </h3>
                <p className="text-sm text-dark-400">Automatsko praćenje aktivnosti i predlozi za uloge</p>
              </CardHeader>
              <CardBody>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">{realProgress.days}</p>
                    <p className="text-xs text-dark-400">Logovanja</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-green-400">{realProgress.xp.toLocaleString()}</p>
                    <p className="text-xs text-dark-400">XP</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-purple-400">{realProgress.rank}/7</p>
                    <p className="text-xs text-dark-400">Rang</p>
                  </div>
                  <div className="bg-dark-800/50 rounded-xl p-3 text-center">
                    <p className="text-2xl font-bold text-yellow-400">{realProgress.overall}%</p>
                    <p className="text-xs text-dark-400">Progres</p>
                  </div>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3">
                  {/* Dana */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">Dana aktivnosti: {realProgress.days}/60</span>
                      <span className="text-dark-400">{realProgress.daysProgress}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${realProgress.daysProgress}%` }} />
                    </div>
                  </div>
                  {/* XP */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">XP: {realProgress.xp.toLocaleString()}/4000</span>
                      <span className="text-dark-400">{realProgress.xpProgress}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${realProgress.xpProgress}%` }} />
                    </div>
                  </div>
                  {/* Rang */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-dark-300">Rang: {realProgress.rank}/7</span>
                      <span className="text-dark-400">{realProgress.rankProgress}%</span>
                    </div>
                    <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${realProgress.rankProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                  <p className="text-sm text-dark-300">
                    💡 Sistem automatski prati vašu aktivnost. Ispunite kriterijume za novi rang!
                  </p>
                </div>
              </CardBody>
            </Card>
          )}

        </div>
      </main>

      {/* Rank Modal */}
      {showRankModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowRankModal(false)}>
          <div className="bg-dark-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-dark-700 flex items-center justify-between">
              <h2 className="font-bold">📊 Rangovi</h2>
              <button onClick={() => setShowRankModal(false)} className="text-dark-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 space-y-3">
              {ranks.map((rank) => (
                <div key={rank.level} className={`p-3 rounded-lg border ${rank.level === userRank.level ? 'bg-blue-500/20 border-blue-500/50' : 'bg-dark-700 border-dark-600'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{rank.icon}</span>
                    <div>
                      <p className="font-bold">{rank.name}</p>
                      <p className="text-xs text-dark-400">Level {rank.level}</p>
                    </div>
                    {rank.level === userRank.level && <span className="ml-auto text-blue-400 text-xs">TRENUTNI</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Roles Modal */}
      {showRolesModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={() => setShowRolesModal(false)}>
          <div className="bg-dark-800 rounded-2xl max-w-sm w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-dark-700 flex items-center justify-between">
              <h2 className="font-bold">🛡️ Uloge</h2>
              <button onClick={() => setShowRolesModal(false)} className="text-dark-400 hover:text-white">✕</button>
            </div>
            <div className="p-4 space-y-3">
              {Object.values(ROLES).sort((a: any, b: any) => b.level - a.level).map((role: any) => {
                const v = getVisualConfig(role.id);
                const hasRole = role.id === primaryRole;
                return (
                  <div key={role.id} className={`p-3 rounded-lg border ${v.borderColor} bg-gradient-to-br ${v.colorClass} bg-opacity-5`}>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{v.icon}</span>
                      <div>
                        <p className="font-bold">{v.name}</p>
                        <p className="text-xs text-dark-400">Nivo: {role.level}</p>
                      </div>
                      {hasRole && <span className="ml-auto text-green-400 text-xs">✓</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
