'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarGroup } from '@/components/ui/Avatar';
import { 
  Trophy, Target, Clock, Users, DollarSign, Star,
  ChevronRight, Play, Calendar, Flame, Award,
  Lock, Zap, CheckCircle, ExternalLink, Bell
} from 'lucide-react';

export default function ChallengesPage() {
  const [activeTab, setActiveTab] = useState('active');

  const challenges = {
    active: [
      {
        id: 1,
        title: 'Zaradi 100€ za 7 dana',
        description: 'Zaradi svojih prvih 100€ u bilo kom biznisu i dokumentuj put.',
        category: 'revenue',
        startDate: '2026-02-07',
        endDate: '2026-02-14',
        daysLeft: 3,
        participants: 45,
        prize: '200€ + Premium sertifikat',
        xpReward: 1000,
        difficulty: 'medium',
        status: 'active',
        myProgress: 75,
        topPerformers: [
          { name: 'Marko M.', progress: 100, avatar: null },
          { name: 'Jelena P.', progress: 100, avatar: null },
          { name: 'Nikola J.', progress: 85, avatar: null },
        ],
        rules: [
          'Dokumentuj svaki korak',
          'Minimum 3 objave o napretku',
          'Priloži dokaz o prihodu',
          'Deli u kanalu #izazovi'
        ]
      },
      {
        id: 2,
        title: '7 dana uzastopno učenje',
        description: 'Uči bar 30 minuta svaki dan, 7 dana zaredom.',
        category: 'learning',
        startDate: '2026-02-08',
        endDate: '2026-02-15',
        daysLeft: 1,
        participants: 128,
        prize: '500 XP + Badge "Maratonac"',
        xpReward: 500,
        difficulty: 'hard',
        status: 'active',
        myProgress: 6,
        topPerformers: [
          { name: 'Ana K.', progress: 7, avatar: null },
          { name: 'Sara M.', progress: 7, avatar: null },
          { name: 'PetarJB', progress: 6, avatar: null },
        ],
        rules: [
          'Minimum 30 min učenja dnevno',
          'Gledaj video ili čitaj materijal',
          'Nedostaje ti samo 1 dan!'
        ]
      },
      {
        id: 3,
        title: 'Prvi klijent',
        description: 'Pronađi svog prvog klijenta i završi posao.',
        category: 'milestone',
        startDate: '2026-02-10',
        endDate: '2026-02-24',
        daysLeft: 14,
        participants: 34,
        prize: 'Sertifikat + 300 XP',
        xpReward: 300,
        difficulty: 'medium',
        status: 'active',
        myProgress: 0,
        topPerformers: [
          { name: 'Zika B.', progress: 100, avatar: null },
          { name: 'Milan R.', progress: 50, avatar: null },
        ],
        rules: [
          'Prvi plaćeni klijent',
          'Deli iskustvo u zajednici',
          'Priloži pre/posle slike ako je primenjivo'
        ]
      }
    ],
    upcoming: [
      {
        id: 4,
        title: 'Marketing Master',
        description: 'Pokreni marketing kampanju i dobij prve lead-ove.',
        category: 'marketing',
        startDate: '2026-02-20',
        prize: 'Premium kurs marketinga',
        xpReward: 800,
        difficulty: 'hard',
        participants: 0,
        rules: [
          'Kreiraj 3 reklame',
          'Minimum 100 reach',
          'Minimum 5 lead-ova'
        ]
      },
      {
        id: 5,
        title: 'E-commerce Launch',
        description: 'Otvori online prodavnicu i napravi prvu prodaju.',
        category: 'business',
        startDate: '2026-03-01',
        prize: '100€ budžet za oglašavanje',
        xpReward: 600,
        difficulty: 'hard',
        participants: 0,
        rules: [
          'Otvori Shop ili sajt',
          'Najmanje 10 proizvoda',
          'Prva prodaja'
        ]
      }
    ],
    completed: [
      {
        id: 6,
        title: 'Auto Detailing Osnove',
        description: 'Završi ceo kurs za 14 dana.',
        category: 'learning',
        completedDate: '2026-01-30',
        prize: 'Sertifikat + 200 XP',
        xpReward: 200,
        status: 'winner'
      },
      {
        id: 7,
        title: 'Januar Challenge',
        description: 'Najviše aktivnosti u januaru.',
        category: 'community',
        completedDate: '2026-01-31',
        prize: 'VIP status za mart',
        xpReward: 300,
        status: 'participant'
      }
    ]
  };

  const categories = {
    revenue: { name: 'Prihod', icon: '💰', color: 'green' },
    learning: { name: 'Učenje', icon: '📚', color: 'blue' },
    milestone: { name: 'Milerstone', icon: '🎯', color: 'purple' },
    marketing: { name: 'Marketing', icon: '📈', color: 'orange' },
    business: { name: 'Biznis', icon: '💼', color: 'cyan' },
    community: { name: 'Zajednica', icon: '👥', color: 'pink' },
  };

  const difficultyColors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red',
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-gold-500/10 blur-[100px]" />
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
            <Link href="/dashboard"><Button variant="ghost" size="sm">Dashboard</Button></Link>
            <Link href="/profile"><Button variant="ghost" size="sm">Profil</Button></Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <Badge variant="gold" className="mb-4">🎯 IZAZOVI</Badge>
            <h1 className="text-4xl font-bold mb-2">
              Takmiči se i osvajaj!
            </h1>
            <p className="text-xl text-dark-400">
              Dokaži svoje znanje, zaradi nagrade i gradi reputaciju
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-primary-500">{challenges.active.length}</div>
                <div className="text-dark-400 text-sm">Aktivnih</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-gold-500">{challenges.upcoming.length}</div>
                <div className="text-dark-400 text-sm">Uskoro</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-green-500">2</div>
                <div className="text-dark-400 text-sm">Osvojeno</div>
              </CardBody>
            </Card>
            <Card variant="default" className="text-center">
              <CardBody className="p-4">
                <div className="text-3xl font-bold text-purple-500">500€+</div>
                <div className="text-dark-400 text-sm">Ukupno nagrade</div>
              </CardBody>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-dark-700">
            {['active', 'upcoming', 'completed'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-primary-400 border-b-2 border-primary-400'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                {tab === 'active' && '🎯 Aktivni'}
                {tab === 'upcoming' && '📅 Uskoro'}
                {tab === 'completed' && '🏆 Završeni'}
              </button>
            ))}
          </div>

          {/* Challenges Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {challenges[activeTab as keyof typeof challenges].map((challenge: any) => (
              <Card key={challenge.id} variant="gradient" className="overflow-hidden">
                <CardBody className="p-0">
                  {/* Header */}
                  <div className="p-6 border-b border-dark-700">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold-500/20 to-orange-500/20 flex items-center justify-center text-2xl">
                          {categories[challenge.category as keyof typeof categories]?.icon || '🎯'}
                        </div>
                        <div>
                          <Badge 
                            variant={difficultyColors[challenge.difficulty as keyof typeof difficultyColors] as any}
                            size="sm"
                          >
                            {challenge.difficulty.toUpperCase()}
                          </Badge>
                          <h3 className="font-bold text-xl mt-1">{challenge.title}</h3>
                        </div>
                      </div>
                      {challenge.status === 'winner' && (
                        <Badge variant="gold">🏆 Pobednik</Badge>
                      )}
                    </div>
                    <p className="text-dark-400">{challenge.description}</p>
                  </div>

                  {/* Progress (for active) */}
                  {activeTab === 'active' && challenge.myProgress !== undefined && (
                    <div className="px-6 py-4 bg-dark-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-dark-400">Tvoj napredak</span>
                        <span className="font-semibold">{challenge.myProgress}%</span>
                      </div>
                      <div className="h-3 bg-dark-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary-500 to-green-400 rounded-full"
                          style={{ width: `${challenge.myProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {challenge.daysLeft !== undefined && (
                        <div className="flex items-center gap-2 text-dark-400">
                          <Clock className="w-5 h-5" />
                          <span>{challenge.daysLeft} dana</span>
                        </div>
                      )}
                      {challenge.startDate && (
                        <div className="flex items-center gap-2 text-dark-400">
                          <Calendar className="w-5 h-5" />
                          <span>Počinje: {new Date(challenge.startDate).toLocaleDateString('sr-RS')}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-dark-400">
                        <Users className="w-5 h-5" />
                        <span>{challenge.participants} učesnika</span>
                      </div>
                      <div className="flex items-center gap-2 text-gold-400">
                        <Trophy className="w-5 h-5" />
                        <span className="font-semibold">{challenge.prize}</span>
                      </div>
                    </div>

                    {/* Rules */}
                    {challenge.rules && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Pravila:</h4>
                        <ul className="space-y-1">
                          {challenge.rules.slice(0, 3).map((rule: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-dark-400">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                              <span>{rule}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Top Performers */}
                    {challenge.topPerformers && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 text-sm text-dark-400">Vodeći:</h4>
                        <div className="flex items-center gap-2">
                          {challenge.topPerformers.slice(0, 3).map((performer: any, i: number) => (
                            <div key={i} className="relative" title={performer.name}>
                              <Avatar size="sm" status="online">
                                {performer.name.charAt(0)}
                              </Avatar>
                              {i < 2 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 rounded-full text-[8px] flex items-center justify-center">
                                  {i + 1}
                                </span>
                              )}
                            </div>
                          ))}
                          {challenge.topPerformers.length > 3 && (
                            <span className="text-sm text-dark-400">+{challenge.topPerformers.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3">
                      {activeTab === 'active' ? (
                        <Button variant="primary" fullWidth>
                          Nastavi izazov
                        </Button>
                      ) : activeTab === 'upcoming' ? (
                        <Button variant="outline" fullWidth>
                          <Bell className="w-4 h-4 mr-2" />
                          Podseti me
                        </Button>
                      ) : (
                        <Button variant="ghost" fullWidth>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Pogledaj rezultate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card variant="default" className="mt-8">
            <CardBody className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gold-500/20 flex items-center justify-center text-2xl">💡</div>
                <div>
                  <h3 className="font-bold mb-2">Kako funkcionišu izazovi?</h3>
                  <ul className="space-y-2 text-dark-400">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">1.</span>
                      <span>Prijavi se za izazov klikom na dugme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">2.</span>
                      <span>Prati pravila i završavaj zadatke</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">3.</span>
                      <span>Dokumentuj napredak u kanalu #izazovi</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-500">4.</span>
                      <span>Osvoji nagrade i gradi reputaciju!</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardBody>
          </Card>

        </div>
      </main>
    </div>
  );
}
