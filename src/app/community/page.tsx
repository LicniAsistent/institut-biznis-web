'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Hash, Users, Search, Bell, Send, Plus, Settings,
  BookOpen, ChevronRight, X,
  Book, Wrench, Crown, Info, Sparkles,
  MessageCircle, HelpCircle, Star, Lock,
  Zap, ArrowRight, CheckCircle
} from 'lucide-react';

interface Message {
  id: number;
  user: { name: string; status: string; role?: string };
  content: string;
  time: string;
  reactions?: { emoji: string; count: number }[];
}

interface QAMessage {
  id: number;
  user: string;
  content: string;
  time: string;
  role?: string;
  pinned?: boolean;
}

export default function CommunityPage() {
  const pathname = usePathname();
  const [activeChannel, setActiveChannel] = useState('welcome');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCourseChannels, setShowCourseChannels] = useState(false);
  const [activeSegment, setActiveSegment] = useState<'left' | 'middle' | 'right'>('left');

  const user = {
    nickname: 'PetarJB',
    fullName: 'Petar Jurković',
    level: 3,
    rank: 'Pripravnik',
    rankIcon: '🔨',
    purchasedCourses: ['auto-perionica'],
    hasPremiumAccess: true, // Kupio kurs + pristup zajednici
  };

  // FREE channels - dostupni svim ulogovanim korisnicima
  const freeChannels = [
    {
      category: '📢 Dobrodošnica',
      channels: [
        { id: 'welcome', name: 'dobrodosnica', description: 'Predstavi se zajednici!', rule: 'Samo predstavljanje', members: 1247, online: 234, isFree: true },
        { id: 'pravila', name: 'pravila', description: 'Pravila ponasanja', rule: 'Citanje obavezno', members: 1247, online: 234, isFree: true },
        { id: 'predstavi-se', name: 'predstavi-se', description: 'Detaljnije predstavljanje', rule: 'Opisi sebe', members: 892, online: 156, isFree: true },
      ],
    },
    {
      category: '🎯 Rezultati',
      channels: [
        { id: 'dostignuca', name: 'dostignuca', description: 'Podeli svoje uspehe!', rule: 'Samo pozitivne vesti', members: 345, online: 56, isFree: true },
        { id: 'motivacija', name: 'motivacija', description: 'Motivacija i inspiracija', rule: 'Samo pozitivno', members: 445, online: 67, isFree: true },
      ],
    },
    {
      category: '❓ Q&A',
      channels: [
        { id: 'pitanja', name: 'pitanja', description: 'Postavi pitanje', rule: 'Samo pitanja', members: 456, online: 78, isFree: true },
      ],
    },
  ];

  // PREMIUM channels - samo za premium korisnike
  const premiumChannels = [
    {
      category: '💬 Opšta diskusija',
      channels: [
        { id: 'general', name: 'opsta-diskusija', description: 'Razgovor o svemu', rule: 'Sve ima granice', members: 567, online: 89, isFree: false },
        { id: 'hobi', name: 'hobi-i-slobodno', description: 'Sve osim biznisa', rule: 'Off-topic', members: 334, online: 45, isFree: false },
      ],
    },
    {
      category: '💼 Biznis',
      channels: [
        { id: 'biznis-idea', name: 'ideje-i-startup', description: 'Biznis ideje i feedback', rule: 'Konstruktivna kritika', members: 234, online: 34, isFree: false },
        { id: 'marketing', name: 'marketing', description: 'Marketing i promocija', rule: 'Bez spam-a', members: 189, online: 28, isFree: false },
        { id: 'finansije', name: 'finansije', description: 'Finansije i investicije', rule: 'Samo info', members: 156, online: 23, isFree: false },
        { id: 'izazovi', name: 'izazovi', description: 'Trenutni izazovi', rule: 'Aktivan', members: 178, online: 45, isFree: false },
      ],
    },
    {
      category: '🎓 Učenje',
      channels: [
        { id: 'resenja', name: 'resenja', description: 'Resenja problema', rule: 'Deli iskustvo', members: 234, online: 34, isFree: false },
      ],
    },
  ];

  // Q&A 3-Segment Channel Data
  const qaSegments = {
    left: {
      name: 'KURS & PRAKSA',
      icon: <Book className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
      textColor: 'text-blue-400',
      description: 'Pitanja o lekcijama, modulima, primerima iz prakse, alatima, vežbama, savetima za biznis',
      questions: [
        { id: 1, user: 'Marko M.', content: 'Koji pritisak koristite za pranje felna?', time: '10:23', role: 'Polaznik', pinned: true },
        { id: 2, user: 'Ana K.', content: 'Koliko dugo treba da se suši sealant pre nano coatinga?', time: '09:45', role: 'Polaznik' },
      ]
    },
    middle: {
      name: 'PLATFORMA & FUNKCIJE',
      icon: <Wrench className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      borderColor: 'border-green-500/30',
      textColor: 'text-green-400',
      description: 'Tehnička pitanja, podešavanja naloga, problemi sa logovanjem, kako koristiti alate u aplikaciji',
      questions: [
        { id: 1, user: 'Sara M.', content: 'Ne mogu da pronađem gde se skida sertifikat', time: '11:00', role: 'Polaznik', pinned: true },
        { id: 2, user: 'Nikola J.', content: 'Kako da promenim profilnu sliku?', time: '10:15', role: 'Polaznik' },
      ]
    },
    right: {
      name: 'TIM & RAZVOJ',
      icon: <Crown className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/30',
      textColor: 'text-yellow-400',
      description: 'Pitanja za administratore, urednike kurseva, sugestije za buduće kurseve, prijave za saradnju',
      questions: [
        { id: 1, user: 'Zika B.', content: 'Da li planirate kurs za poliranje farova?', time: '12:00', role: 'Pripravnik', pinned: true },
      ]
    }
  };

  // Course channels - samo za one koji su kupili kurs
  const courseChannels: Record<string, any[]> = {
    'auto-perionica': [
      {
        category: '🚗 Auto-Perionica Kurs',
        channels: [
          { id: 'auto-uvod', name: 'uvod-u-perionicu', description: 'Uvod i osnove', rule: 'Prvo pogledaj video', members: 156, online: 34, isCourse: true },
          { id: 'auto-oprema', name: 'oprema-i-alati', description: 'Sve o opremi', rule: 'Preporuke za kupovinu', members: 134, online: 28, isCourse: true },
          { id: 'auto-praksa', name: 'praksa-i-saveti', description: 'Prakticni saveti', rule: 'Podeli iskustvo', members: 167, online: 38, isCourse: true },
        ],
      },
    ],
  };

  const userCourseChannels = user.purchasedCourses.flatMap(courseId => 
    courseChannels[courseId] || []
  );

  const regularMessages: Record<string, Message[]> = {
    'welcome': [
      { id: 1, user: { name: 'Marko M.', status: 'online' }, content: 'Zdravo svima! Ja sam Marko, radim u dostavi 6 meseci!', time: '10:23' },
      { id: 2, user: { name: 'Jelena P.', status: 'online' }, content: 'Dobrodosli Marko! Odlican cilj.', time: '10:25' },
    ],
    'dostignuca': [
      { id: 1, user: { name: 'Zika B.', status: 'online' }, content: 'USPESNO! Upravo zaradio 50€ od prvog klijenta!', time: '11:30' },
    ],
  };

  const isQASegment = activeChannel === 'pitanja';
  const currentSegment = isQASegment ? qaSegments[activeSegment] : null;
  const currentMessages: Message[] = isQASegment 
    ? []
    : (regularMessages[activeChannel] || []);
  const currentQAQuestions: QAMessage[] = isQASegment 
    ? (currentSegment?.questions || [])
    : [];

  const isCourseChannel = (channelId: string) => {
    return user.purchasedCourses.some((courseId: string) => 
      courseChannels[courseId]?.some((cat: any) => 
        cat.channels?.some((ch: any) => ch.id === channelId)
      )
    );
  };

  const isPremiumChannel = (channelId: string) => {
    return premiumChannels.some(category => 
      category.channels.some(ch => ch.id === channelId)
    );
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert('Poruka poslata: ' + messageInput);
      setMessageInput('');
    }
  };

  const handlePremiumClick = (channelName: string) => {
    alert(`Ovaj kanal je PREMIUM!\n\nDa bi pristupio #${channelName}, potrebno je da:\n\n1. Kupiš kurs ILI\n2. Kupiš pristup zajednici (3999 RSD/mesec)\n\nKontaktiraj nas za više informacija!`);
  };

  return (
    <div className="min-h-screen bg-dark-900 text-white flex pb-20">
      
      {/* Left Sidebar - Channels */}
      <div className="w-72 bg-dark-800 border-r border-dark-700 flex flex-col h-screen fixed left-0 top-0">
        
        {/* Header with Kursevi Button */}
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/" className="flex items-center gap-3 flex-1 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center font-bold shadow-lg shadow-blue-500/30">IB</div>
              <div>
                <h1 className="font-bold">Institut Biznis</h1>
                <p className="text-xs text-dark-500">1,247 clanova</p>
              </div>
            </Link>
          </div>
          
          {/* KURSEVI Button */}
          <Link 
            href="/courses"
            className="flex items-center gap-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-lg shadow-purple-500/20"
          >
            <BookOpen className="w-5 h-5" />
            <span>Kursevi</span>
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input 
              type="text" 
              placeholder="Pretrazi kanale..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>

        {/* Course Channels Toggle */}
        {userCourseChannels.length > 0 && (
          <div className="px-2 mb-2">
            <button
              onClick={() => setShowCourseChannels(!showCourseChannels)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              <span className="font-bold text-sm">Moji Kursevi</span>
              <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${showCourseChannels ? 'rotate-90' : ''}`} />
            </button>
          </div>
        )}

        {/* Course Channels */}
        {showCourseChannels && userCourseChannels.map((category: any, idx: number) => (
          <div key={`course-${idx}`} className="mb-4 px-2">
            <h3 className="text-xs font-bold text-purple-400 uppercase px-2 mb-2">{category.category}</h3>
            {category.channels.map((channel: any) => (
              <button
                key={channel.id}
                onClick={() => setActiveChannel(channel.id)}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                  activeChannel === channel.id 
                    ? 'bg-purple-500/20 text-purple-400' 
                    : 'text-dark-400 hover:bg-dark-700 hover:text-white'
                }`}
              >
                <Hash className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1 text-sm">{channel.name}</span>
                <span className="text-xs text-dark-500">{channel.online}</span>
              </button>
            ))}
          </div>
        ))}

        {/* FREE Channels */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="mb-4">
            <h3 className="text-xs font-bold text-green-400 uppercase px-2 mb-2">📢 Besplatno</h3>
            {freeChannels.map((category, idx) => (
              <div key={idx} className="mb-3">
                {category.channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                      activeChannel === channel.id 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'text-dark-400 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    <Hash className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate flex-1 text-sm">{channel.name}</span>
                    {channel.id === 'dostignuca' && (
                      <span className="text-xs bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">FREE</span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* PREMIUM Channels */}
          <div className="mb-4">
            <h3 className="text-xs font-bold text-gold-400 uppercase px-2 mb-2">💎 Premium</h3>
            {premiumChannels.map((category, idx) => (
              <div key={idx} className="mb-3">
                {category.channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => user.hasPremiumAccess ? setActiveChannel(channel.id) : handlePremiumClick(channel.name)}
                    className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                      activeChannel === channel.id && user.hasPremiumAccess
                        ? 'bg-gold-500/20 text-gold-400' 
                        : !user.hasPremiumAccess
                          ? 'text-dark-500 hover:bg-dark-700/50 cursor-not-allowed opacity-60'
                          : 'text-dark-400 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    <Hash className={`w-4 h-4 flex-shrink-0 ${!user.hasPremiumAccess ? 'opacity-50' : ''}`} />
                    <span className="truncate flex-1 text-sm">{channel.name}</span>
                    {!user.hasPremiumAccess && <Lock className="w-3 h-3 text-gold-400" />}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* User Profile */}
        <div className="p-3 bg-dark-900/50 border-t border-dark-700">
          <div className="flex items-center gap-3">
            <Avatar size="md" status="online">{user.nickname.charAt(0)}</Avatar>
            <Link href="/profile" className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{user.nickname}</p>
              <p className="text-xs text-dark-500">{user.rankIcon} {user.rank}</p>
            </Link>
            {user.hasPremiumAccess && (
              <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3 h-3" /> PREMIUM
              </span>
            )}
            <Button variant="ghost" size="sm"><Settings className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 ml-72 flex flex-col h-screen">
        
        {/* Header */}
        <div className="h-16 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Hash className={`w-6 h-6 ${isCourseChannel(activeChannel) ? 'text-purple-400' : isPremiumChannel(activeChannel) && !user.hasPremiumAccess ? 'text-dark-500' : 'text-primary-400'}`} />
            <div>
              <h2 className="font-bold flex items-center gap-2">
                {activeChannel}
                {isCourseChannel(activeChannel) && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">KURS</span>
                )}
                {isPremiumChannel(activeChannel) && !user.hasPremiumAccess && (
                  <span className="text-xs bg-gold-500/20 text-gold-400 px-2 py-0.5 rounded-full">PREMIUM</span>
                )}
                {activeChannel === 'dostignuca' && (
                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">BESPLATNO</span>
                )}
              </h2>
              <p className="text-xs text-dark-500">{
                freeChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.description ||
                premiumChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.description ||
                userCourseChannels.flatMap(c => c.channels || []).find(c => c.id === activeChannel)?.description || ''
              }</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-dark-400 text-sm mr-4">
              <Users className="w-4 h-4" />
              <span>{freeChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.members || 
                    premiumChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.members ||
                    userCourseChannels.flatMap(c => c.channels || []).find(c => c.id === activeChannel)?.members || 0}</span>
            </div>
            <Button variant="ghost" size="sm"><Search className="w-4 h-4" /></Button>
            <Button variant="ghost" size="sm"><Bell className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Premium Lock Banner */}
        {isPremiumChannel(activeChannel) && !user.hasPremiumAccess ? (
          <div className="bg-gradient-to-r from-gold-500/20 to-yellow-600/20 border-b border-gold-500/30 px-4 py-6">
            <div className="text-center">
              <Lock className="w-12 h-12 text-gold-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gold-400 mb-2">Ovaj kanal je PREMIUM</h3>
              <p className="text-dark-300 mb-4">Pristup ovom kanalu imaju samo korisnici koji su:</p>
              <div className="flex justify-center gap-4 mb-4">
                <div className="bg-dark-800/50 rounded-lg p-3">
                  <span className="text-lg">🎓</span>
                  <p className="text-xs text-dark-400">Kupili kurs</p>
                </div>
                <div className="bg-dark-800/50 rounded-lg p-3">
                  <span className="text-lg">💎</span>
                  <p className="text-xs text-dark-400">Kupili pristup zajednici</p>
                </div>
              </div>
              <Link href="/courses">
                <Button variant="gold" className="shadow-lg shadow-gold-500/20">
                  <Zap className="w-4 h-4 mr-2" />
                  Nadogradi Sada
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Regular Channel Banner */
          <div className={`border-b border-dark-700 px-4 py-3 ${isCourseChannel(activeChannel) ? 'bg-purple-500/10' : 'bg-dark-800/50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-dark-400">
                  <Info className={`w-4 h-4 ${isCourseChannel(activeChannel) ? 'text-purple-400' : 'text-primary-400'}`} />
                  <span><strong>Pravilo:</strong> {
                    freeChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.rule ||
                    premiumChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.rule ||
                    userCourseChannels.flatMap(c => c.channels || []).find(c => c.id === activeChannel)?.rule || ''
                  }</span>
                </div>
              </div>
              {activeChannel === 'dostignuca' && (
                <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Besplatno za sve
                </span>
              )}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Welcome banner */}
          <div className="text-center py-8">
            {isPremiumChannel(activeChannel) && !user.hasPremiumAccess ? (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-gold-500 to-yellow-600">
                <Lock className="w-8 h-8 text-white" />
              </div>
            ) : isQASegment ? (
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>
            ) : (
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${isCourseChannel(activeChannel) ? 'bg-gradient-to-br from-purple-500 to-blue-600' : 'bg-gradient-to-br from-primary-500 to-blue-600'}`}>
                <Hash className="w-8 h-8 text-white" />
              </div>
            )}
            <h2 className="text-2xl font-bold mb-2">#{activeChannel}</h2>
            <p className="text-dark-400 mb-4">{
              freeChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.description ||
              premiumChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.description ||
              userCourseChannels.flatMap(c => c.channels || []).find(c => c.id === activeChannel)?.description || ''
            }</p>
            
            {isQASegment && currentSegment && (
              <div className={`inline-flex items-center gap-2 ${currentSegment.bgColor} ${currentSegment.textColor} px-4 py-2 rounded-full text-sm border ${currentSegment.borderColor}`}>
                <Sparkles className="w-4 h-4" />
                {currentSegment.description}
              </div>
            )}
            
            {!isQASegment && !isPremiumChannel(activeChannel) && (
              <div className="inline-flex items-center gap-2 bg-primary-500/20 text-primary-400 px-4 py-2 rounded-full text-sm">
                <Sparkles className="w-4 h-4" />{
                  freeChannels.flatMap(c => c.channels).find(c => c.id === activeChannel)?.rule || ''
                }</div>
            )}
          </div>

          {/* Q&A Questions List */}
          {isQASegment && currentQAQuestions.map((msg: QAMessage, index: number) => (
            <div key={`${msg.id}-${index}`} className={`flex gap-3 hover:bg-dark-800/30 p-3 rounded-lg transition-colors border-l-2 ${activeSegment === 'left' ? 'border-blue-500' : activeSegment === 'middle' ? 'border-green-500' : 'border-yellow-500'}`}>
              <Avatar size="md" status={msg.user.includes('Petar') ? 'online' : 'offline'}>{msg.user.charAt(0)}</Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{msg.user}</span>
                  {msg.role && (
                    <span className="text-xs bg-dark-700 text-dark-300 px-2 py-0.5 rounded-full">{msg.role}</span>
                  )}
                  <span className="text-xs text-dark-500">{msg.time}</span>
                  {msg.pinned && (
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>
                <p className="text-dark-300">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Regular Messages */}
          {!isQASegment && currentMessages.map((msg: Message) => (
            <div key={msg.id} className="flex gap-3 hover:bg-dark-800/30 p-2 rounded-lg transition-colors">
              <Avatar size="md" status={msg.user.status as any}>{msg.user.name.charAt(0)}</Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold">{msg.user.name}</span>
                  <span className="text-xs text-dark-500">{msg.time}</span>
                </div>
                <p className="text-dark-300">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 bg-dark-800 border-t border-dark-700">
          <div className="flex gap-2">
            <Button variant="ghost" size="sm"><Plus className="w-5 h-5" /></Button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={isPremiumChannel(activeChannel) && !user.hasPremiumAccess ? 'Pristup ograničen' : `Pisi u #${activeChannel}`}
                disabled={isPremiumChannel(activeChannel) && !user.hasPremiumAccess}
                className={`w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white placeholder:text-dark-500 focus:outline-none focus:border-primary-500 ${isPremiumChannel(activeChannel) && !user.hasPremiumAccess ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              variant="primary" 
              size="sm"
              disabled={isPremiumChannel(activeChannel) && !user.hasPremiumAccess}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Info & AI */}
      <div className="w-80 bg-dark-800 border-l border-dark-700 flex flex-col h-screen fixed right-0 top-0 overflow-y-auto">
        
        {/* AI Assistant */}
        <div className="p-4 border-b border-dark-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">AI Asistent</h3>
              <p className="text-xs text-green-400">Online</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="p-4 border-b border-dark-700">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-400" />
            Brzi pristup
          </h3>
          <div className="space-y-2">
            <Link href="/courses" className="flex items-center gap-2 p-2 rounded-lg bg-dark-900 hover:bg-dark-700 transition-colors">
              <BookOpen className="w-4 h-4 text-purple-400" />
              <span className="text-sm">Moji kursevi</span>
            </Link>
            <Link href="/profile" className="flex items-center gap-2 p-2 rounded-lg bg-dark-900 hover:bg-dark-700 transition-colors">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm">Moj profil</span>
            </Link>
          </div>
        </div>

        {/* Premium CTA */}
        {!user.hasPremiumAccess && (
          <div className="p-4 border-b border-dark-700 bg-gradient-to-br from-gold-500/10 to-yellow-600/10">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-sm text-gold-400 mb-2">Postani PREMIUM</h3>
              <p className="text-xs text-dark-400 mb-3">Pristup svim kanalima, specijalnim grupama i ekskluzivnom sadržaju.</p>
              <Link href="/courses">
                <Button variant="gold" size="sm" fullWidth className="shadow-lg shadow-gold-500/20">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Saznaj Više
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* How It Works */}
        <div className="p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            Kako funkcionise?
          </h3>
          
          <div className="space-y-3">
            <div className="bg-dark-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-bold text-blue-400">1</div>
                <span className="font-bold text-sm">Zavrsi kurs</span>
              </div>
              <p className="text-xs text-dark-400">Gledaj video lekcije i zavrsi zadatke</p>
            </div>

            <div className="bg-dark-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-xs font-bold text-green-400">2</div>
                <span className="font-bold text-sm">Pridruzi se kanalu</span>
              </div>
              <p className="text-xs text-dark-400">Postavljaj pitanja i dobij pomoc</p>
            </div>

            <div className="bg-dark-900 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-gold-500/20 flex items-center justify-center text-xs font-bold text-gold-400">3</div>
                <span className="font-bold text-sm">Pocni da zarađuješ</span>
              </div>
              <p className="text-xs text-dark-400">Primeni znanje i podeli uspeh</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 border-t border-dark-700 mt-auto bg-dark-900/50">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-lg font-bold text-primary-400">1,247</div>
              <div className="text-xs text-dark-500">Clanova</div>
            </div>
            <div className="bg-dark-800 rounded-lg p-2">
              <div className="text-lg font-bold text-green-400">89%</div>
              <div className="text-xs text-dark-500">Zaposleni</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
