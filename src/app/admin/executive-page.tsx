'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Crown, Shield, Users, Plus, X, Send,
  MessageSquare, Headphones, ShieldAlert, Zap,
  ChevronDown, Search, MoreHorizontal, Lock, BookOpen, User
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminUser {
  id: string;
  nickname: string;
  role: string;
  avatar?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('executive');
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Mock data for Executive Board members
  const executiveMembers = [
    { id: '1', nickname: 'Mladi_Preduzetnik', role: 'founder', online: true },
    { id: '2', nickname: 'VisionLead', role: 'vision_lead', online: true },
    { id: '3', nickname: 'AdminPetar', role: 'admin', online: false },
  ];

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: '1', user: 'Mladi_Preduzetnik', message: 'Pozdrav ekipa!', time: '10:30', role: 'founder' },
    { id: '2', user: 'VisionLead', message: 'Zdravo! Spreman za sastanak.', time: '10:31', role: 'vision_lead' },
  ]);

  // Check access
  const canAccess = user?.role === 'founder' || 
                    user?.role === 'vision_lead' || 
                    user?.role === 'admin';

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    setChatMessages(prev => [...prev, {
      id: Date.now().toString(),
      user: user?.nickname || 'Unknown',
      message,
      time: new Date().toLocaleTimeString('sr-RS', { hour: '2-digit', minute: '2-digit' }),
      role: user?.role || 'polaznik'
    }]);
    setMessage('');
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { color: string; icon: string }> = {
      founder: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: '👑' },
      vision_lead: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: '💡' },
      admin: { color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30', icon: '⚡' },
      moderator: { color: 'bg-red-500/20 text-red-400 border-red-500/30', icon: '🛡️' },
      support: { color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '🎧' },
      community_lead: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: '🌟' },
    };
    return badges[role] || { color: 'bg-gray-500/20 text-gray-400 border-gray-500/30', icon: '📋' };
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Pristup odbijen</h1>
          <p className="text-dark-400 mb-4">
            Nemate dozvolu za pristup admin panelu. Kontaktirajte administratora.
          </p>
          <Link href="/">
            <Button variant="primary">Nazad</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white pb-24">
      {/* Header */}
      <div className="bg-dark-800/50 border-b border-dark-700">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-400" />
                Admin Panel
              </h1>
              <p className="text-dark-400 text-sm">Upravljanje platformom</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadge(user.role).color} border`}>
              {getRoleBadge(user.role).icon} {user.role}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('executive')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'executive' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}
          >
            🟩 Executive Board
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'support' 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}
          >
            🎧 Support
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'moderation' 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}
          >
            🛡️ Moderacija
          </button>
          <button
            onClick={() => setActiveTab('upgrades')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              activeTab === 'upgrades' 
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
            }`}
          >
            ⬆️ Upgrades
          </button>
        </div>

        {/* EXECUTIVE BOARD */}
        {activeTab === 'executive' && (
          <div className="space-y-6">
            {/* Green Table */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/30 p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-green-400 mb-1">
                    🟩 Zeleni Sto
                  </h2>
                  <p className="text-dark-400 text-sm">
                    Ovde se donose bitne odluke
                  </p>
                </div>

                {/* Add Member Button */}
                <div className="flex justify-center mb-6">
                  <Button 
                    onClick={() => setShowAddMember(!showAddMember)}
                    variant="outline"
                    className="border-green-500/50 text-green-400 hover:bg-green-500/20"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj Člana
                  </Button>
                </div>

                {/* Add Member Modal */}
                {showAddMember && (
                  <Card className="mb-6 p-4">
                    <div className="flex gap-2 mb-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                        <input
                          type="text"
                          placeholder="Pretraži korisnike..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-dark-700 border border-dark-600 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-green-500"
                        />
                      </div>
                      <Button variant="outline" onClick={() => setShowAddMember(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Users list would go here */}
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      <p className="text-dark-400 text-sm text-center py-2">
                        Unesite nickname za pretragu...
                      </p>
                    </div>
                  </Card>
                )}

                {/* Table / Oval */}
                <div className="relative max-w-2xl mx-auto">
                  {/* Oval table design */}
                  <div className="bg-gradient-to-br from-green-700/30 to-emerald-700/20 border-2 border-green-500/30 rounded-full py-8 px-12">
                    <div className="flex flex-wrap justify-center gap-4">
                      {executiveMembers.map((member) => (
                        <div key={member.id} className="flex flex-col items-center">
                          <div className="relative">
                            <Avatar size="lg" status={member.online ? 'online' : 'offline'}>
                              {member.nickname.charAt(0)}
                            </Avatar>
                            <span className="absolute -bottom-1 -right-1 text-lg">
                              {getRoleBadge(member.role).icon}
                            </span>
                          </div>
                          <p className="text-sm font-medium mt-1">{member.nickname}</p>
                          <p className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(member.role).color}`}>
                            {member.role}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Chat for Executive Board */}
            <Card className="overflow-hidden">
              <div className="p-4 border-b border-dark-700">
                <h3 className="font-bold flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-green-400" />
                  Chat - Executive Board
                </h3>
              </div>
              
              {/* Messages */}
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-3">
                    <Avatar size="sm">{msg.user.charAt(0)}</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{msg.user}</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${getRoleBadge(msg.role).color}`}>
                          {getRoleBadge(msg.role).icon}
                        </span>
                        <span className="text-xs text-dark-500">{msg.time}</span>
                      </div>
                      <p className="text-dark-300 text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-dark-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Napiši poruku..."
                    className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <Card className="p-8 text-center">
            <Headphones className="w-16 h-16 text-blue-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Support Chat</h2>
            <p className="text-dark-400">Ovde dolaze tiketi od korisnika.</p>
          </Card>
        )}

        {/* MODERATION TAB */}
        {activeTab === 'moderation' && (
          <Card className="p-8 text-center">
            <ShieldAlert className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Moderacija</h2>
            <p className="text-dark-400">Prijave i sadržaj za moderaciju.</p>
          </Card>
        )}

        {/* UPGRADES TAB */}
        {activeTab === 'upgrades' && (
          <Card className="p-8 text-center">
            <Zap className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Upgrades</h2>
            <p className="text-dark-400">Promena rangova i rola korisnicima.</p>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
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
            <User className="w-5 h-5 text-dark-400" />
            <span className="text-xs text-dark-400">Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
