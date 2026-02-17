'use client';

import { useState, useRef, useEffect } from 'react';
import { Button, Card, CardBody } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  MessageSquare, X, Send, Minimize2, Loader2, Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickReply {
  label: string;
  query: string;
}

const quickReplies: QuickReply[] = [
  { label: '📚 Kursevi', query: 'Koje kurseve imate?' },
  { label: '💰 Cena', query: 'Koliko košta članstvo?' },
  { label: '🎯 Izazovi', query: 'Kako funkcionišu izazovi?' },
  { label: '🚀 Počni', query: 'Kako da počnem?' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Zdravo! 👋\n\nJa sam AI asistent Institut Biznis platforme.\n\nMogu ti pomoci sa:\n- Informacijama o kursevima\n- Cenama i clanstvom\n- Pitanjima o izazovima\n- Uputstvom za pocetak\n\nSta te zanima?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const getAssistantResponse = (userQuery: string): string => {
    const query = userQuery.toLowerCase();
    
    if (query.includes('kurs') || query.includes('ucenje') || query.includes('sertifikat')) {
      return `Kursevi\n\nTrenutno nudimo kurseve iz:\n- Auto detaljinga (pranje, poliranje)\n- Dostave i logistike\n- Poslovnih osnova\n- Marketinga\n\nSvaki kurs ukljucuje:\n- Video lekcije\n- PDF materijale\n- Sertifikat po zavrsetku\n- Pristup zajednici\n\nPogledaj: /courses`;
    }
    
    if (query.includes('cena') || query.includes('cenu') || query.includes('kosta') || query.includes('novac') || query.includes('pare')) {
      return `Cene\n\nKursevi: 2.999 - 4.999 RSD (jednokratno)\n\nPremium clanstvo: 1.999 RSD/mesec\n- Svi kursevi\n- Pristup izazovima\n- Zajednica\n- Sertifikati\n\nVerifikacija: 10 EUR/godina\n- Plava checkmark\n- Vise poverenja\n- Pristup inkubaciji\n\nPogledaj: /courses`;
    }
    
    if (query.includes('izazov') || query.includes('takmic') || query.includes('nagrada')) {
      return `Izazovi\n\nUcestvuj u nedeljnim izazovima:\n- Prihod - Zaradi X EUR za 7 dana\n- Ucenje - 7 dana uzastopno\n- Milestone - Prvi klijent, prva prodaja\n- Marketing - Pokreni kampanju\n\nNagrade:\n- Novcane nagrade\n- Badges i Sertifikati\n- XP poeni za rang\n\nPogledaj: /challenges`;
    }
    
    if (query.includes('pocni') || query.includes('poceti') || query.includes('registruj') || query.includes('kako')) {
      return `Kako poceti?\n\n1. Registruj se - /auth/register\n2. Izaberi kurs - /courses\n3. Uci i napreduj - gledaj lekcije\n4. Pridruzi se zajednici - /community\n5. Ucestvuj u izazovima - /challenges\n\nPrvih 100 XP dobijas za registraciju!`;
    }
    
    if (query.includes('zajednic') || query.includes('cet') || query.includes('diskord') || query.includes('komunika')) {
      return `Zajednica\n\nPridruzi se nasoj Discord zajednici:\n- Vise od 1000 clanova\n- Dnevne diskusije\n- Mentori i podrska\n- Networking prilike\n\nPogledaj: /community`;
    }
    
    if (query.includes('rang') || query.includes('xp') || query.includes('nivo') || query.includes('poeni')) {
      return `XP i Rang sistem\n\n7 nivoa:\n1. Polaznik - Pocetnik\n2. Aktivni ucenik - Chat pristup\n3. Pripravnik - 5% popust\n4. Kandidat - Bold tekst\n5. Preduzetnik - 10% popust\n6. Izvršni direktor - Besplatni dogadjaji\n7. Vizionar - 20% + VIP\n\nKako zaraditi XP:\n- Zavrsis lekcije (+50 XP)\n- Ucestvuj u izazovima (+100-500 XP)\n- Pomogni drugima u zajednici (+25 XP)\n- Svakodnevni login (+10 XP)`;
    }
    
    if (query.includes('sta je') || query.includes('ko ste') || query.includes('o vas') || query.includes('institut biznis')) {
      return `Institut Biznis\n\nMi smo edukaciona platforma za mlade preduzetnike na Balkanu.\n\nNasa misija: Pomoci mladima da pokrenu i razviju sopstveni biznis.\n\nSta nudimo:\n- Prakticni kursevi\n- Zajednica istomisljenika\n- Izazovi sa nagradama\n- Mentorski program\n- Pomoc pri inkubaciji\n\nVizija: "Problem jednog coveka je resenje za drugog" (Givers Gain)`;
    }
    
    return `Hmm, nisam siguran da sam razumeo pitanje.\n\nMogu ti pomoci sa:\n- Kursevima i cenama\n- Izazovima i nagradama\n- Kako poceti\n- Zajednicom\n- XP i rang sistemom\n\nPitaj drugacije!`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = getAssistantResponse(userMessage.content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 500 + Math.random() * 500);
  };

  const handleQuickReply = (query: string) => {
    setInput(query);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-primary-500 to-green-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110 z-50 animate-pulse"
        aria-label="Otvori chat"
      >
        <MessageSquare className="w-7 h-7 text-white" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all ${isMinimized ? 'w-16 h-16' : 'w-96'}`}>
      <Card 
        variant="gradient" 
        className={`overflow-hidden transition-all ${isMinimized ? 'h-16' : 'h-[500px]'}`}
      >
        {/* Header */}
        <div 
          className="p-4 border-b border-dark-700 flex items-center justify-between cursor-pointer"
          onClick={() => !isMinimized && setIsMinimized(true)}
        >
          <div className="flex items-center gap-3">
            <Avatar status="online">
              <Sparkles className="w-5 h-5 text-primary-400" />
            </Avatar>
            {!isMinimized && (
              <div>
                <h3 className="font-bold text-sm">AI Asistent</h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
              className="p-1 hover:bg-dark-700 rounded"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
              className="p-1 hover:bg-dark-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        {!isMinimized && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[360px]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-md'
                        : 'bg-dark-800 text-white rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    <p className="text-[10px] opacity-50 mt-1">
                      {message.timestamp.toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 p-3 rounded-2xl rounded-bl-md">
                    <Loader2 className="w-5 h-5 animate-spin text-primary-400" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {quickReplies.map((reply, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickReply(reply.query)}
                  className="text-xs px-2 py-1 bg-dark-700 hover:bg-dark-600 rounded-full transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-dark-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pitaj me nesto..."
                  className="flex-1 bg-dark-800 border border-dark-700 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 rounded-full flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
