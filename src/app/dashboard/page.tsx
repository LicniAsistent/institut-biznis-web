'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { Badge, RankBadge } from '@/components/ui/Badge';
import { XPProgress } from '@/components/ui/Progress';
import { Avatar } from '@/components/ui/Avatar';
import { 
  BookOpen, Trophy, Target, MessageSquare, Users, Zap,
  ChevronRight, Play, Clock, Flame, Star, Calendar,
  TrendingUp, Award, Video, DollarSign
} from 'lucide-react';

export default function DashboardPage() {
  const user = {
    nickname: 'PetarJB',
    level: 3,
    xp: 7450,
    xpToNextLevel: 10000,
    xpFromLevel: 5000,
    rank: { name: 'Pripravnik', level: 3, icon: '🔨', color: 'green', description: 'Počinje da radi prve korake u praksi' },
    streak: 7,
    subscriptionStatus: 'active',
    
    // Today's activity
    todayXP: 45,
    todayGoal: 100,
    
    // Continue learning
    continueLearning: [
      { id: 1, title: 'Auto Perionica - Osnove', progress: 75, nextLesson: 'Tehnika pranja dva vedra', thumbnail: '🚗' },
      { id: 2, title: 'Dostava - Kako početi', progress: 30, nextLesson: 'Pronalaženje klijenata', thumbnail: '🚲' },
    ],
    
    // Upcoming challenges
    challenges: [
      { id: 1, title: 'Zaradi 100€ za 7 dana', daysLeft: 3, participants: 45, prize: '200€ + Sertifikat' },
      { id: 2, title: '7 dana uzastopno', daysLeft: 1, participants: 128, prize: '500 XP + Badge' },
    ],
    
    // Community activity
    unreadMessages: 5,
    newAchievements: 1,
    
    // Stats
    stats: {
      totalXP: 7450,
      coursesCompleted: 1,
      challengesWon: 2,
      messagesSent: 89,
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.02)_1px,transparent_1px)] bg-[size:80px_80px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-green-600 flex items-center justify-center font-bold text-xl">IB</div>
            <span className="text-xl font-bold">Institut Biznis</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/profile"><Button variant="ghost" size="sm">Profil</Button></Link>
            <Link href="/community"><Button variant="ghost" size="sm">Zajednica</Button></Link>
            <Avatar size="sm" status="online">{user.nickname.charAt(0)}</Avatar>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Dobrodošao nazad, {user.nickname}! 👋
            </h1>
            <p className="text-dark-400">
              Nastavi svoje putovanje ka uspehu
            </p>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-primary-500">{user.todayXP}/{user.todayGoal} XP</div>
                <div className="text-dark-400 text-sm">Danas</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-gold-500">{user.streak} 🔥</div>
                <div className="text-dark-400 text-sm">Dana uzastopno</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-green-500">{user.stats.coursesCompleted}</div>
                <div className="text-dark-400 text-sm">Kurseva</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-purple-500">{user.unreadMessages}</div>
                <div className="text-dark-400 text-sm">Poruka</div>
              </CardBody>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Continue Learning */}
              <Card variant="default">
                <CardHeader title="📚 Nastavi sa učenjem" icon={<BookOpen className="w-5 h-5" />} />
                <CardBody className="p-0">
                  <div className="divide-y divide-dark-700">
                    {user.continueLearning.map((course) => (
                      <div key={course.id} className="p-4 flex items-center gap-4 hover:bg-dark-700/50 transition-colors">
                        <div className="w-14 h-14 rounded-xl bg-primary-500/20 flex items-center justify-center text-2xl">
                          {course.thumbnail}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{course.title}</h3>
                          <p className="text-dark-400 text-sm mb-2">Sledeća: {course.nextLesson}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${course.progress}%` }} />
                            </div>
                            <span className="text-sm text-dark-400">{course.progress}%</span>
                          </div>
                        </div>
                        <Button variant="primary" size="sm">
                          <Play className="w-4 h-4 mr-2" />
                          Nastavi
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Active Challenges */}
              <Card variant="gradient">
                <CardHeader title="🎯 Aktivni izazovi" icon={<Trophy className="w-5 h-5" />} />
                <CardBody className="p-0">
                  <div className="divide-y divide-dark-700">
                    {user.challenges.map((challenge) => (
                      <div key={challenge.id} className="p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center text-2xl">🏆</div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{challenge.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-dark-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {challenge.daysLeft} dana
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {challenge.participants} učesnika
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-gold-400 font-semibold">{challenge.prize}</div>
                          <Button variant="outline" size="sm">Vidi detalje</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-4">
                <Link href="/courses">
                  <Card variant="interactive" hover className="p-6 text-center">
                    <BookOpen className="w-10 h-10 text-primary-500 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Svi kursevi</h3>
                    <p className="text-dark-400 text-sm">Pregledaj ponudu</p>
                  </Card>
                </Link>
                <Link href="/community">
                  <Card variant="interactive" hover className="p-6 text-center">
                    <MessageSquare className="w-10 h-10 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-bold mb-1">Zajednica</h3>
                    <p className="text-dark-400 text-sm">Pridruži se diskusiji</p>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Right Column - Sidebar */}
            <div className="space-y-6">
              
              {/* XP & Rank */}
              <Card variant="gradient">
                <CardBody className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <RankBadge rank={user.rank} size="lg" />
                    <div>
                      <h3 className="font-bold">{user.rank.icon} {user.rank.name}</h3>
                      <p className="text-dark-400 text-sm">{user.rank.description}</p>
                    </div>
                  </div>
                  <XPProgress 
                    currentXP={user.xp - user.xpFromLevel}
                    levelXP={user.xpToNextLevel - user.xpFromLevel}
                    level={user.level}
                    nextLevelXP={user.xpToNextLevel}
                  />
                  <p className="text-center text-dark-400 text-sm mt-3">
                    {user.xpToNextLevel - user.xp} XP do sledećeg nivoa
                  </p>
                </CardBody>
              </Card>

              {/* Daily Goal */}
              <Card variant="default">
                <CardHeader title="🎯 Dnevni cilj" icon={<Target className="w-5 h-5" />} />
                <CardBody>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-primary-500">{user.todayXP} XP</div>
                    <p className="text-dark-400">od {user.todayGoal} XP danas</p>
                  </div>
                  <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary-500 to-green-400 rounded-full"
                      style={{ width: `${(user.todayXP / user.todayGoal) * 100}%` }}
                    />
                  </div>
                  <p className="text-center text-dark-400 text-sm mt-3">
                    {user.todayGoal - user.todayXP} XP do cilja!
                  </p>
                </CardBody>
              </Card>

              {/* Subscription */}
              {user.subscriptionStatus === 'active' ? (
                <Card variant="gradient" className="border-gold-500/30">
                  <CardBody className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6 text-gold-500" />
                      <h3 className="font-bold text-gold-400">Premium Aktivan</h3>
                    </div>
                    <p className="text-dark-400 text-sm mb-4">
                      Uživaj u svim pogodnostima Premium članstva!
                    </p>
                    <Button variant="gold" fullWidth>Upravljaj pretplatom</Button>
                  </CardBody>
                </Card>
              ) : (
                <Card variant="default">
                  <CardBody className="p-6 text-center">
                    <p className="text-dark-400 mb-4">Unapredi svoje članstvo!</p>
                    <Button variant="gold" fullWidth>
                      <Zap className="w-4 h-4 mr-2" />
                      Uzmi Premium
                    </Button>
                  </CardBody>
                </Card>
              )}

              {/* Recent Achievements */}
              <Card variant="default">
                <CardHeader title="🏆 Nova dostignuća" icon={<Award className="w-5 h-5" />} />
                <CardBody>
                  {user.newAchievements > 0 ? (
                    <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <p className="font-semibold">Novi badge!</p>
                        <p className="text-dark-400 text-sm">7 dana uzastopno</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-dark-400 text-center">Nema novih dostignuća</p>
                  )}
                </CardBody>
              </Card>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
