'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button, Card } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Crown, Zap, Flame, BookOpen, Users, User,
  Settings, Trophy, Medal, Target, TrendingUp,
  ChevronRight, CheckCircle, Clock, Edit
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { RANK_LEVELS, getVisualConfig } from '@/lib/rbac';

export default function ProfilePage() {
  const [showWelcome, setShowWelcome] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profileUser, setProfileUser] = useState<any>(null);

  const { user: currentUser, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();

  // Check if first login
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const hasSeenWelcome = localStorage.getItem('hideWelcomeModal');
      if (!hasSeenWelcome) {
        setShowWelcome(true);
      }
      
      // Check if viewing own profile
      if (!params?.id) {
        setIsOwnProfile(true);
        setProfileUser(currentUser);
      }
    }
  }, [isAuthenticated, currentUser, params]);

  const handleCloseWelcome = () => {
    setShowWelcome(false);
  };

  // Get rank info
  const getRankInfo = (level: number) => {
    return RANK_LEVELS.find(r => r.level === level) || RANK_LEVELS[0];
  };

  const rankInfo = getRankInfo(profileUser?.rankLevel || 1);
  const visual = getVisualConfig((profileUser?.role || 'polaznik') as any);

  // XP thresholds
  const xpThresholds = [0, 100, 250, 500, 1000, 2000, 4000];
  const currentXP = profileUser?.xpPoints || 0;
  const nextThreshold = xpThresholds[rankInfo.level] || 4000;
  const currentThreshold = xpThresholds[rankInfo.level - 1] || 0;
  const xpProgress = Math.min(100, ((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100);

  // Calculate days active
  const membershipDays = profileUser?.createdAt 
    ? Math.floor((Date.now() - new Date(profileUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 1;

  // Mock achievements (from image)
  const achievements = [
    { id: 1, name: 'Prvi korak', icon: '🎯', earned: true },
    { id: 2, name: '7 dana uzastopno', icon: '🔥', earned: true },
    { id: 3, name: 'Prvi post', icon: '💬', earned: true },
    { id: 4, name: '50+ reakcija', icon: '❤️', earned: false },
    { id: 5, name: 'Završen kurs', icon: '📚', earned: false },
    { id: 6, name: 'Pobednik izazova', icon: '🏆', earned: false },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-24">
      {/* Welcome Modal */}
      {showWelcome && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowWelcome(false)} />
          <div className="relative w-full max-w-lg mx-4">
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="h-32 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-600 relative">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
              <div className="pt-10 p-6 text-center">
                <h2 className="text-xl font-bold mb-2">Dobrodošao! 👋</h2>
                <p className="text-dark-400 text-sm mb-4">
                  Zajednica istomišljenika te čeka. Spreman za put uspeha?
                </p>
                <button
                  onClick={() => setShowWelcome(false)}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-bold"
                >
                  Započni put Uspeha
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-dark-800/50 border-b border-dark-700">
        <div className="max-w-2xl mx-auto pt-8 pb-4 px-4">
          <div className="flex items-start gap-4">
            {/* Avatar with status */}
            <div className="relative">
              <Avatar size="xl" status="online">
                {profileUser?.nickname?.charAt(0) || '?'}
              </Avatar>
              {profileUser?.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center border-2 border-dark-800">
                  <span className="text-xs">✓</span>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold">{profileUser?.nickname}</h1>
              </div>
              
              {/* Role badge */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${visual.colorClass} bg-opacity-20 border ${visual.borderColor}`}>
                  {visual.icon} {visual.name}
                </span>
              </div>

              {/* Bio */}
              {profileUser?.bio && (
                <p className="text-dark-400 text-sm">{profileUser.bio}</p>
              )}
            </div>

            {/* Edit button if own profile */}
            {isOwnProfile && (
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 mt-4">
            <Link href="/courses" className="flex-1">
              <Button variant="outline" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                Kursevi
              </Button>
            </Link>
            <Link href="/community" className="flex-1">
              <Button variant="outline" className="w-full">
                <Users className="w-4 h-4 mr-2" />
                Zajednica
              </Button>
            </Link>
            {(currentUser?.role === 'founder' || currentUser?.role === 'admin' || currentUser?.role === 'vision_lead') && (
              <Link href="/admin">
                <Button variant="outline">
                  <Crown className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 text-center">
            <Zap className="w-5 h-5 text-yellow-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{currentXP.toLocaleString()}</p>
            <p className="text-xs text-dark-400">XP</p>
          </Card>
          <Card className="p-3 text-center">
            <Crown className="w-5 h-5 text-gold-400 mx-auto mb-1" />
            <p className="text-lg font-bold">{rankInfo.name}</p>
            <p className="text-xs text-dark-400">Rang</p>
          </Card>
          <Card className="p-3 text-center">
            <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
            <p className="text-xl font-bold">{membershipDays}</p>
            <p className="text-xs text-dark-400">Dana</p>
          </Card>
        </div>
      </div>

      {/* XP Progress */}
      <div className="max-w-2xl mx-auto px-4 py-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-dark-400">XP Progress</span>
          <span className="text-dark-400">{currentXP.toLocaleString()} / {nextThreshold.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
      </div>

      {/* Achievements Section */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            Dostignuća
          </h2>
          <span className="text-sm text-dark-400">
            {achievements.filter(a => a.earned).length}/{achievements.length}
          </span>
        </div>
        
        <Card className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
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
      </div>

      {/* Role & Permissions Info */}
      <div className="max-w-2xl mx-auto px-4 py-4">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-3">
          <Medal className="w-5 h-5 text-blue-400" />
          Šta otključava ovaj rang?
        </h2>
        <Card className="p-4">
          <div className="space-y-2 text-sm">
            <p className="text-dark-400">
              {rankInfo.level >= 5 ? '✅ Pristup biznis izazovima' : '🔒 Biznis izazovi'}
            </p>
            <p className="text-dark-400">
              {rankInfo.level >= 4 ? '✅ Support chat pristup' : '🔒 Support chat'}
            </p>
            <p className="text-dark-400">
              {rankInfo.level >= 7 ? '✅ Mentor programa' : '🔒 Mentor program'}
            </p>
          </div>
        </Card>
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-800/95 backdrop-blur-lg border-t border-dark-700">
        <div className="flex items-center justify-around py-2 max-w-2xl mx-auto">
          <Link href="/courses" className="flex flex-col items-center gap-1 p-2">
            <BookOpen className="w-5 h-5 text-dark-400" />
            <span className="text-xs text-dark-400">Kursevi</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center gap-1 p-2">
            <Users className="w-5 h-5 text-dark-400" />
            <span className="text-xs text-dark-400">Zajednica</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2">
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-xs text-white">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
