'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { Badge, RankBadge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Zap, ChevronLeft, Clock, CheckCircle, XCircle, AlertTriangle,
  ArrowUp, Star, Crown, Users, MessageSquare, BookOpen
} from 'lucide-react';

export default function RankAccelerationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [reason, setReason] = useState('');

  // User's current stats
  const user = {
    nickname: 'PetarJB',
    currentRank: { level: 3, name: 'Pripravnik', icon: '🔨' },
    targetRank: { level: 4, name: 'Kandidat', icon: '💼' },
    currentXP: 7450,
    xpNeeded: 2550,
    membershipDays: 45,
  };

  // Acceleration criteria
  const criteria = [
    {
      title: '🤝 Doprinos zajednici',
      description: 'Aktivan učesnik koji pomaže drugima',
      examples: [
        'Odgovaraš na pitanja novih članova',
        'Deliš iskustva i savete',
        'Učestvuješ u diskusijama'
      ],
      points: 30,
      userHas: true
    },
    {
      title: '📚 Završeni kursevi',
      description: 'Imaš završene kurseve na platformi',
      examples: [
        'Najmanje 1 završen kurs',
        'Svi zadaci urađeni',
        'Sertifikat dobijen'
      ],
      points: 25,
      userHas: true
    },
    {
      title: '🏆 Osvojeni izazovi',
      description: 'Učestvovao si u izazovima',
      examples: [
        'Najmanje 1 izazov završen',
        'Dokazani rezultati'
      ],
      points: 20,
      userHas: true
    },
    {
      title: '💰 Donacija platformi',
      description: 'Finansijska podrška Institutu Biznis',
      examples: [
        'Donacija od 500+ RSD',
        'Premium članarina'
      ],
      points: 25,
      userHas: false
    },
  ];

  const handleSubmit = () => {
    if (reason.trim().length < 20) {
      alert('Molimo napišite detaljniji razlog (minimum 20 karaktera)');
      return;
    }
    setSubmitted(true);
  };

  const totalPoints = criteria.filter(c => c.userHas).reduce((sum, c) => sum + c.points, 0);
  const meetsThreshold = totalPoints >= 50;

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute top-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-primary-500/10 blur-[100px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gold-500/10 blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center">
          <Link href="/profile" className="flex items-center gap-2 text-dark-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
            <span>Nazad na profil</span>
          </Link>
        </div>
      </nav>

      <main className="pt-20 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-2">⚡ Ubrzanje ranga</h1>
            <p className="text-dark-400 max-w-md mx-auto">
              Prebaci se brže na viši rang! Ispuni kriterijume i zatraži ubrzanje.
            </p>
          </div>

          {/* Current vs Target */}
          <Card variant="gradient" className="mb-8">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                {/* Current */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-dark-700 rounded-xl flex items-center justify-center text-3xl mb-2 mx-auto">
                    {user.currentRank.icon}
                  </div>
                  <p className="text-sm text-dark-400">Trenutni rang</p>
                  <p className="font-bold">{user.currentRank.name}</p>
                </div>
                
                {/* Arrow */}
                <div className="flex items-center gap-2 px-4">
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-gold-500 rounded" />
                  <Zap className="w-6 h-6 text-gold-500" />
                  <div className="w-12 h-1 bg-gradient-to-r from-primary-500 to-gold-500 rounded" />
                </div>
                
                {/* Target */}
                <div className="text-center">
                  <div className="w-16 h-16 bg-gold-500/20 rounded-xl flex items-center justify-center text-3xl mb-2 mx-auto border border-gold-500/50">
                    {user.targetRank.icon}
                  </div>
                  <p className="text-sm text-gold-400">Ciljni rang</p>
                  <p className="font-bold text-gold-400">{user.targetRank.name}</p>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Criteria */}
          <Card variant="default" className="mb-8">
            <CardHeader title="📋 Kriterijumi za ubrzanje" />
            <CardBody className="p-0">
              <div className="divide-y divide-dark-700">
                {criteria.map((criterion, index) => (
                  <div key={index} className={`p-4 flex items-start gap-4 ${criterion.userHas ? 'bg-green-500/5' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      criterion.userHas ? 'bg-green-500/20 text-green-500' : 'bg-dark-700 text-dark-500'
                    }`}>
                      {criterion.userHas ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{criterion.title}</h4>
                        <Badge variant={criterion.userHas ? 'success' : 'default'} size="sm">
                          {criterion.points} bodova
                        </Badge>
                      </div>
                      <p className="text-dark-400 text-sm mb-2">{criterion.description}</p>
                      <ul className="text-xs text-dark-500 space-y-1">
                        {criterion.examples.map((example, i) => (
                          <li key={i} className="flex items-center gap-1">
                            <span className="text-primary-500">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Total Points */}
              <div className="p-4 bg-dark-800/50 border-t border-dark-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-dark-400">Ukupno bodova:</p>
                    <p className="text-2xl font-bold">{totalPoints} / 100</p>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${meetsThreshold ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    {meetsThreshold ? '✓ Ispunjavaš uslove!' : '⚠️ Potrebno još bodova'}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Request Form */}
          <Card variant="default">
            <CardHeader title="📝 Zahtev za ubrzanje" />
            <CardBody>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Zahtev poslat! ✅</h3>
                  <p className="text-dark-400 mb-4">
                    Tvoj zahtev za ubrzanje ranga je uspešno poslat. 
                    Tim će pregledati zahtev u roku od 24h.
                  </p>
                  <Link href="/profile">
                    <Button variant="primary">Vrati se na profil</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-dark-400 mb-2">
                      Zašto zaslužuješ ubrzanje? *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Napiši detaljno zašto misliš da zaslužuješ ubrzanje ranga..."
                      className="w-full h-32 bg-dark-800 border border-dark-700 rounded-lg p-3 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 resize-none"
                    />
                    <p className="text-xs text-dark-500 mt-1">
                      Minimum 20 karaktera. ({reason.length}/20)
                    </p>
                  </div>

                  {!meetsThreshold && (
                    <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-yellow-400 font-medium">Ne ispunjavaš sve kriterijume</p>
                          <p className="text-xs text-dark-400 mt-1">
                            Možeš poslati zahtev, ali će tim ručno pregledati tvoju prijavu.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <Button 
                    onClick={handleSubmit} 
                    variant="gold" 
                    fullWidth
                    disabled={reason.trim().length < 20}
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Pošalji zahtev za ubrzanje
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>

        </div>
      </main>
    </div>
  );
}
