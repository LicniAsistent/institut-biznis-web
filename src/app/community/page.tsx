'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Hash, Lock, Users, MessageSquare, Plus, Settings, 
  ChevronRight, Search, Bell, Zap, Trophy, BookOpen,
  MessageCircle, SmilePlus, Pin, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// Channel types
interface Channel {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'GENERAL' | 'COURSE' | 'COMMUNITY' | 'SUPPORT' | 'PROJECT';
  accessLevel: 'FREE' | 'LOCKED' | 'COURSE' | 'MEMBERSHIP';
  isJoined: boolean;
  messageCount: number;
  participantCount: number;
  color?: string;
  icon?: string;
  children?: Channel[];
}

// Demo channels
const DEMO_CHANNELS: Channel[] = [
  {
    id: '1',
    name: '💬 Opšta diskusija',
    slug: 'opsta-diskusija',
    description: 'Razgovor o svemu što te zanima',
    type: 'GENERAL',
    accessLevel: 'FREE',
    isJoined: true,
    messageCount: 1234,
    participantCount: 456,
    color: '#3B82F6'
  },
  {
    id: '2',
    name: '🚀 Preduzetništvo',
    slug: 'preduzetnistvo',
    description: 'Saveti za pokretanje biznisa',
    type: 'COMMUNITY',
    accessLevel: 'FREE',
    isJoined: true,
    messageCount: 567,
    participantCount: 234,
    color: '#10B981'
  },
  {
    id: '3',
    name: '📚 Kurs: Auto Detailing',
    slug: 'kurs-auto-detailing',
    description: 'Sve o auto detailing biznisu',
    type: 'COURSE',
    accessLevel: 'COURSE',
    isJoined: false,
    messageCount: 89,
    participantCount: 45,
    color: '#F59E0B',
    children: [
      { id: '3-1', name: 'Pitanja', slug: 'kurs-auto-detailing/pitanja', type: 'COURSE', accessLevel: 'COURSE', isJoined: false, messageCount: 34, participantCount: 45 },
      { id: '3-2', name: 'Domaći zadaci', slug: 'kurs-auto-detailing/zadaci', type: 'COURSE', accessLevel: 'COURSE', isJoined: false, messageCount: 12, participantCount: 45 },
      { id: '3-3', name: 'Projekat', slug: 'kurs-auto-detailing/projekat', type: 'COURSE', accessLevel: 'COURSE', isJoined: false, messageCount: 8, participantCount: 45 }
    ]
  },
  {
    id: '4',
    name: '🎯 Izazovi',
    slug: 'izazovi',
    description: 'Takmičenja i nagrade',
    type: 'COMMUNITY',
    accessLevel: 'FREE',
    isJoined: true,
    messageCount: 234,
    participantCount: 189,
    color: '#8B5CF6'
  },
  {
    id: '5',
    name: '🔒 Premium prostor',
    slug: 'premium',
    description: 'Samo za članove',
    type: 'COMMUNITY',
    accessLevel: 'LOCKED',
    isJoined: false,
    messageCount: 567,
    participantCount: 89,
    color: '#F59E0B'
  },
  {
    id: '6',
    name: '🎧 Support',
    slug: 'support',
    description: 'Pomoć i pitanja',
    type: 'SUPPORT',
    accessLevel: 'FREE',
    isJoined: true,
    messageCount: 45,
    participantCount: 234,
    color: '#EF4444'
  }
];

export default function CommunityPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [channels, setChannels] = useState<Channel[]>(DEMO_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRules, setShowRules] = useState(false);
  const [dontShowRulesAgain, setDontShowRulesAgain] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!isLoading && user) {
      const hasSeenRules = localStorage.getItem('communityRulesSeen');
      if (!hasSeenRules) {
        setShowRules(true);
      }
    }
  }, [isLoading, user]);

  const handleJoinChannel = (channelId: string) => {
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return { ...ch, isJoined: true };
      }
      if (ch.children) {
        ch.children = ch.children.map(child => 
          child.id === channelId ? { ...child, isJoined: true } : child
        );
      }
      return ch;
    }));
  };

  const handleCloseRules = () => {
    if (dontShowRulesAgain) {
      localStorage.setItem('communityRulesSeen', 'true');
    }
    setShowRules(false);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Učitavanje...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">IB</div>
              <span className="font-bold">Institut Biznis</span>
            </Link>
            <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">Zajednica</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
              <input
                type="text"
                placeholder="Pretraži kanale..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-dark-800 border border-dark-700 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-blue-500 w-48"
              />
            </div>
            
            <button className="relative p-2 hover:bg-dark-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-dark-400" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            
            <Avatar size="sm">{user?.nickname?.charAt(0)}</Avatar>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-24 px-4">
        <div className="max-w-6xl mx-auto">
          
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Dobrodošao u zajednicu! 👋</h1>
            <p className="text-dark-400">Ovde se povezujemo, učimo i rastemo zajedno.</p>
          </div>

          {/* Channel Categories */}
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Free Channels */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-400" />
                Besplatni kanali
              </h2>
              <div className="space-y-2">
                {channels
                  .filter(ch => ch.accessLevel === 'FREE')
                  .map(channel => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel}
                      onJoin={handleJoinChannel}
                      selected={selectedChannel?.id === channel.id}
                      onSelect={setSelectedChannel}
                    />
                  ))}
              </div>
            </div>

            {/* Course Channels */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                Kursevi
              </h2>
              <div className="space-y-2">
                {channels
                  .filter(ch => ch.type === 'COURSE')
                  .map(channel => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel}
                      onJoin={handleJoinChannel}
                      selected={selectedChannel?.id === channel.id}
                      onSelect={setSelectedChannel}
                    />
                  ))}
              </div>
            </div>

            {/* Locked/Premium */}
            <div className="space-y-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Lock className="w-5 h-5 text-orange-400" />
                Premium
              </h2>
              <div className="space-y-2">
                {channels
                  .filter(ch => ch.accessLevel === 'LOCKED')
                  .map(channel => (
                    <ChannelCard 
                      key={channel.id} 
                      channel={channel}
                      onJoin={handleJoinChannel}
                      selected={selectedChannel?.id === channel.id}
                      onSelect={setSelectedChannel}
                    />
                  ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-around">
          <Link href="/courses" className="flex flex-col items-center gap-1 p-2 text-dark-400 hover:text-white transition-colors">
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Kursevi</span>
          </Link>
          <Link href="/community" className="flex flex-col items-center gap-1 p-2 text-primary-400">
            <Users className="w-5 h-5" />
            <span className="text-xs">Zajednica</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-dark-400 hover:text-white transition-colors">
            <Avatar size="sm">{user?.nickname?.charAt(0)}</Avatar>
            <span className="text-xs">Profil</span>
          </Link>
        </div>
      </div>

      {/* Community Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-2xl max-w-lg w-full overflow-hidden">
            <div className="p-6 border-b border-dark-700">
              <h2 className="text-xl font-bold mb-2">📋 Pravila zajednice</h2>
              <p className="text-dark-400">Da bi zajednica bila kvalitetna, molimo te da se pridržavaš ovih pravila:</p>
            </div>
            
            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              <div>
                <h3 className="font-bold text-green-400 mb-2">✅ Šta je dozvoljeno</h3>
                <ul className="text-sm text-dark-300 space-y-1 list-disc list-inside">
                  <li>Pitanja i diskusija na temu preduzetništva</li>
                  <li>Pomoć drugim članovima</li>
                  <li>Deljenje iskustava i saveta</li>
                  <li>Konkstruktivna kritika</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-red-400 mb-2">❌ Šta nije dozvoljeno</h3>
                <ul className="text-sm text-dark-300 space-y-1 list-disc list-inside">
                  <li>Spam i samopromocija bez dodatne vrednosti</li>
                  <li>Uvredljiv govor i diskriminacija</li>
                  <li>Off-topic poruke u specijalizovanim kanalima</li>
                  <li>Traženje ličnih podataka</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-blue-400 mb-2">💡 Svrhа kanala</h3>
                <p className="text-sm text-dark-300">
                  Svaki kanal ima svoju specifičnu svrhu. Molimo te da poštuješ temu kanala i ne zatrpavaš ga nebitnim sadržajem.
                </p>
              </div>
            </div>
            
            <div className="p-4 border-t border-dark-700 bg-dark-800/50">
              <label className="flex items-center gap-2 cursor-pointer mb-4">
                <input 
                  type="checkbox"
                  checked={dontShowRulesAgain}
                  onChange={(e) => setDontShowRulesAgain(e.target.checked)}
                  className="w-4 h-4 rounded border-dark-600 bg-dark-700 text-blue-500"
                />
                <span className="text-sm text-dark-400">Ne prikazuj više</span>
              </label>
              <Button onClick={handleCloseRules} fullWidth>
                Razumem
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Channel Card Component
function ChannelCard({ 
  channel, 
  onJoin, 
  selected,
  onSelect 
}: { 
  channel: Channel; 
  onJoin: (id: string) => void;
  selected: boolean;
  onSelect: (channel: Channel) => void;
}) {
  const isLocked = channel.accessLevel === 'LOCKED';
  const isCourse = channel.accessLevel === 'COURSE';
  
  return (
    <div 
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        selected 
          ? 'bg-blue-500/10 border-blue-500/30' 
          : 'bg-dark-800/50 border-dark-700 hover:bg-dark-800'
      }`}
      onClick={() => onSelect(channel)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
            style={{ backgroundColor: `${channel.color}20` }}
          >
            {channel.icon || <Hash className="w-5 h-5" style={{ color: channel.color }} />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium">{channel.name}</h3>
              {isLocked && <Lock className="w-4 h-4 text-orange-400" />}
              {isCourse && <BookOpen className="w-4 h-4 text-yellow-400" />}
            </div>
            {channel.description && (
              <p className="text-xs text-dark-400">{channel.description}</p>
            )}
            <div className="flex items-center gap-3 mt-1 text-xs text-dark-500">
              <span className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                {channel.messageCount}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {channel.participantCount}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {!channel.isJoined && !isLocked && (
            <Button 
              size="sm"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onJoin(channel.id);
              }}
            >
              Pridruži se
            </Button>
          )}
          {isLocked && (
            <span className="text-xs px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
              Zaključano
            </span>
          )}
          {channel.children && channel.children.length > 0 && (
            <ChevronRight className="w-4 h-4 text-dark-500" />
          )}
        </div>
      </div>
      
      {/* Sub-channels */}
      {channel.children && channel.children.length > 0 && selected && (
        <div className="mt-3 pl-13 space-y-2">
          {channel.children.map(child => (
            <div 
              key={child.id}
              className="flex items-center justify-between p-2 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-dark-500" />
                <span className="text-sm">{child.name}</span>
              </div>
              {!child.isJoined && (
                <Button size="xs" variant="ghost">
                  Pridruži se
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
