'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Users, Shield, Crown, ChevronDown, ChevronUp, Edit, ArrowUp,
  Settings, BarChart, MessageSquare, UserCheck, AlertTriangle,
  Search, Trophy, Zap, TrendingUp, Activity, BookOpen,
  Briefcase, ArrowRight, ArrowUpCircle
} from 'lucide-react';
import { 
  ROLES, RANK_LEVELS, getVisualConfig, ESCALATION_PATHS, CHANNELS, type UserRole
} from '@/lib/rbac';
import { useAuth } from '@/context/AuthContext';

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

const XP_FOR_RANK = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 1000,
  6: 2000,
  7: 4000,
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [editingUser, setEditingUser] = useState<{id: string, type: 'cin' | 'rang'} | null>(null);
  const [newValue, setNewValue] = useState('');

  const { user: authUser, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem('institut-biznis-token');
        const response = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users || []);
          setCurrentUserRole(data.currentUserRole || '');
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    }
    
    if (isAuthenticated) {
      fetchUsers();
    }
  }, [isAuthenticated]);

  const getRankName = (level: number) => {
    return RANK_LEVELS.find(r => r.level === level)?.name || 'Polaznik';
  };

  const getRoleName = (roleId: string) => {
    return ROLES[roleId as keyof typeof ROLES]?.name || roleId;
  };

  const handleUpdate = async (userId: string, type: 'cin' | 'rang') => {
    try {
      const token = localStorage.getItem('institut-biznis-token');
      
      const updateData: any = {};
      if (type === 'cin') {
        updateData.role = newValue;
      } else {
        updateData.rankLevel = parseInt(newValue);
        updateData.xpPoints = XP_FOR_RANK[updateData.rankLevel as keyof typeof XP_FOR_RANK] || 0;
      }

      const response = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId, ...updateData })
      });
      
      if (response.ok) {
        const usersResponse = await fetch('/api/admin/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (usersResponse.ok) {
          const data = await usersResponse.json();
          setUsers(data.users || []);
        }
        setEditingUser(null);
        setNewValue('');
      }
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const filteredUsers = users.filter(user => 
    user.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTabsForRole = () => {
    const tabs = [
      { id: 'hierarchy', label: '📊 Hijerarhija', icon: <ArrowUpCircle className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'executive_board'] },
      { id: 'executive', label: '🟩 Zeleni Sto', icon: <Users className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'executive_board', 'admin', 'community_lead'] },
      { id: 'users', label: '👥 Korisnici', icon: <Users className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
      { id: 'analytics', label: '📈 Analitika', icon: <TrendingUp className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'executive_board'] },
      { id: 'projects', label: '💼 Projekti', icon: <Briefcase className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'executive_board', 'project_leader'] },
      { id: 'moderation', label: '🛡️ Moderacija', icon: <Shield className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'community_lead', 'moderator'] },
      { id: 'support', label: '🎧 Podrška', icon: <MessageSquare className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'support_lead', 'support_agent'] },
      { id: 'verification', label: '✅ Verifikacija', icon: <UserCheck className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
      { id: 'upgrades', label: '⬆️ Rangovi', icon: <ArrowUp className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
    ];
    return tabs.filter(tab => tab.roles.includes(currentUserRole));
  };

  // SVI ulogovani korisnici mogu da pristupe admin panelu
  const hasAdminAccess = true; // Svi ulogovani korisnici mogu pristupiti

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Učitavanje...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      <div className="fixed inset-0 z-[-1] overflow-hidden">
        <div className="absolute top-[-30%] left-[-20%] w-[60vw] h-[60vw] rounded-full bg-blue-500/10 blur-[150px]" />
        <div className="absolute bottom-[-30%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-500/10 blur-[150px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center font-bold text-sm">IB</div>
              <span className="font-bold">Institut Biznis</span>
            </Link>
            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">ADMIN</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-dark-400">{authUser.nickname}</span>
            {(() => {
              const visual = getVisualConfig(currentUserRole as UserRole);
              return (
                <span className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r ${visual.colorClass} bg-opacity-20 border ${visual.borderColor}`}>
                  {visual.icon} {visual.name}
                </span>
              );
            })()}
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* User Access Info */}
          {(() => {
            const userVisual = getVisualConfig(currentUserRole as UserRole);
            const escalation = ESCALATION_PATHS[currentUserRole as UserRole];
            return (
              <div className="mb-6 p-4 bg-dark-800/50 rounded-xl border border-dark-700">
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${userVisual.colorClass} flex items-center justify-center text-xl`}>
                    {userVisual.icon}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{userVisual.name}</h1>
                    <p className="text-sm text-dark-400">{userVisual.description}</p>
                  </div>
                </div>
                {escalation.nextLevel && (
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowUp className="w-4 h-4 text-orange-400" />
                    <span className="text-dark-400">Eskalira ka:</span>
                    <span className="font-medium">
                      {ROLES[escalation.nextLevel].icon} {ROLES[escalation.nextLevel].name}
                    </span>
                  </div>
                )}
              </div>
            );
          })()}

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {getTabsForRole().map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-dark-800 text-dark-400 hover:bg-dark-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'executive' && (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-green-900/50 to-emerald-900/30 p-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-green-400 mb-1">🟩 Zeleni Sto</h2>
                    <p className="text-dark-400 text-sm">Ovde se donose bitne odluke</p>
                  </div>
                  <div className="flex justify-center mb-6">
                    <Button variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/20">
                      <Users className="w-4 h-4 mr-2" />Dodaj Člana
                    </Button>
                  </div>
                  <div className="relative max-w-2xl mx-auto">
                    <div className="bg-gradient-to-br from-green-700/30 to-emerald-700/20 border-2 border-green-500/30 rounded-full py-8 px-12">
                      <div className="flex flex-wrap justify-center gap-4">
                        {[
                          { nickname: 'Mladi_Preduzetnik', role: 'founder', online: true },
                          { nickname: 'VisionLead', role: 'vision_lead', online: true },
                          { nickname: 'Admin', role: 'admin', online: false },
                        ].map((member) => (
                          <div key={member.nickname} className="flex flex-col items-center">
                            <div className="relative">
                              <Avatar size="lg" status={member.online ? 'online' : 'offline'}>
                                {member.nickname.charAt(0)}
                              </Avatar>
                              <span className="absolute -bottom-1 -right-1 text-lg">
                                {member.role === 'founder' ? '👑' : member.role === 'vision_lead' ? '💡' : '⚡'}
                              </span>
                            </div>
                            <p className="text-sm font-medium mt-1">{member.nickname}</p>
                            <p className={`text-xs px-2 py-0.5 rounded ${member.role === 'founder' ? 'bg-yellow-500/20 text-yellow-400' : member.role === 'vision_lead' ? 'bg-blue-500/20 text-blue-400' : 'bg-cyan-500/20 text-cyan-400'}`}>{member.role}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-dark-700">
                  <h3 className="font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-green-400" />Chat - Executive Board
                  </h3>
                </div>
                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  <div className="flex gap-3">
                    <Avatar size="sm">P</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Mladi_Preduzetnik</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">👑</span>
                        <span className="text-xs text-dark-500">10:30</span>
                      </div>
                      <p className="text-dark-300 text-sm">Pozdrav ekipa! Spreman za sastanak.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-dark-700">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Napiši poruku..." className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
                    <Button><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === "hierarchy" && (
            <div className="space-y-6">
              {/* Hierarhija Vizualizacija */}
              <Card className="p-6 bg-gradient-to-br from-dark-800 to-dark-900">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ArrowUpCircle className="w-5 h-5 text-yellow-400" />
                  📌 Hierarhija Sistema
                </h3>
                
                <div className="relative">
                  {/* Linije koje povezuju */}
                  <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-gradient-to-b from-yellow-400 via-blue-400 to-green-400 opacity-30" />
                  
                  <div className="space-y-2">
                    {[
                      { role: 'founder', name: '👑 Founder', color: 'yellow' },
                      { role: 'vision_lead', name: '💡 Vision Lead', color: 'blue' },
                      { role: 'executive_board', name: '🏛 Executive Board', color: 'violet' },
                      { role: 'admin', name: '⚡ Admin', color: 'cyan' },
                      { role: 'community_lead', name: '🌿 Community Lead', color: 'green' },
                      { role: 'moderator', name: '🛡 Moderator', color: 'orange' },
                      { role: 'support_agent', name: '🎤 Support Agent', color: 'blue' },
                    ].map((item, index) => {
                      const visual = getVisualConfig(item.role as UserRole);
                      const escalation = ESCALATION_PATHS[item.role as UserRole];
                      
                      return (
                        <div key={item.role} className="relative flex items-center gap-4 p-3 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors">
                          <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${visual.colorClass} flex items-center justify-center text-2xl z-10`}>
                            {visual.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-bold">{visual.name}</p>
                            <p className="text-xs text-dark-400">{visual.description}</p>
                            {index < 6 && (
                              <p className="text-xs text-dark-500 mt-1">
                                → {escalation.nextLevel ? ROLES[escalation.nextLevel].icon + ' ' + ROLES[escalation.nextLevel].name : 'Kraj'}
                              </p>
                            )}
                          </div>
                          <ArrowRight className="w-5 h-5 text-dark-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>

              {/* Eskalacioni Put */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-orange-400" />
                  📊 Eskalacioni Tokovi
                </h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dark-700/50 rounded-xl">
                    <p className="text-sm font-bold mb-2">🎧 Support</p>
                    <p className="text-xs text-dark-400">Polaznik → Support Agent → Support Lead → Admin → Vision Lead → Founder</p>
                  </div>
                  <div className="p-4 bg-dark-700/50 rounded-xl">
                    <p className="text-sm font-bold mb-2">🛡 Moderacija</p>
                    <p className="text-xs text-dark-400">Moderator → Community Lead → Executive Board → Vision Lead → Founder</p>
                  </div>
                  <div className="p-4 bg-dark-700/50 rounded-xl">
                    <p className="text-sm font-bold mb-2">🚀 Project Leader</p>
                    <p className="text-xs text-dark-400">Project Leader → Executive Board → Vision Lead → Founder</p>
                  </div>
                  <div className="p-4 bg-dark-700/50 rounded-xl">
                    <p className="text-sm font-bold mb-2">🌿 Community Lead</p>
                    <p className="text-xs text-dark-400">Community Lead → Executive Board → Vision Lead → Founder</p>
                  </div>
                </div>
              </Card>

              {/* Kanali */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-blue-400" />
                  📁 Kanali
                </h3>
                
                <div className="grid md:grid-cols-3 gap-3">
                  {Object.entries(CHANNELS).map(([key, channel]) => {
                    const canAccess = channel.allowedRoles.includes(currentUserRole);
                    return (
                      <div 
                        key={key}
                        className={`p-3 rounded-lg border ${canAccess ? 'bg-green-500/10 border-green-500/30' : 'bg-dark-700/50 border-dark-600 opacity-50'}`}
                      >
                        <p className={`text-sm font-medium ${canAccess ? 'text-green-400' : 'text-dark-400'}`}>
                          {channel.name}
                        </p>
                        <p className="text-xs text-dark-500 mt-1">
                          {canAccess ? '✓ Dostupan' : '✗ Nije dostupan'}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Statistike */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.length}</p>
                      <p className="text-xs text-dark-400">Korisnika</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg"><UserCheck className="w-5 h-5 text-green-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.verified).length}</p>
                      <p className="text-xs text-dark-400">Verifikovano</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg"><BookOpen className="w-5 h-5 text-purple-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">0</p>
                      <p className="text-xs text-dark-400">Kurseva</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg"><Crown className="w-5 h-5 text-yellow-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.rankLevel >= 5).length}</p>
                      <p className="text-xs text-dark-400">Preduzetnika</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-400" />
                  Trenutno aktivni
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <p className="text-3xl font-bold text-green-400">12</p>
                    <p className="text-xs text-dark-400">Online</p>
                  </div>
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <p className="text-3xl font-bold text-blue-400">5</p>
                    <p className="text-xs text-dark-400">Uče danas</p>
                  </div>
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <p className="text-3xl font-bold text-yellow-400">3</p>
                    <p className="text-xs text-dark-400">Na kursu</p>
                  </div>
                  <div className="text-center p-4 bg-dark-800 rounded-lg">
                    <p className="text-3xl font-bold text-purple-400">8</p>
                    <p className="text-xs text-dark-400">U zajednici</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Top članovi
                </h2>
                <div className="space-y-3">
                  {users.sort((a, b) => b.xpPoints - a.xpPoints).slice(0, 5).map((user, i) => (
                    <div key={user.id} className="flex items-center gap-3 p-3 bg-dark-800 rounded-lg">
                      <span className="text-lg font-bold w-6">{i + 1}.</span>
                      <Avatar size="sm">{user.nickname.charAt(0)}</Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.nickname}</p>
                        <p className="text-xs text-dark-400">{getRankName(user.rankLevel)}</p>
                      </div>
                      <span className="text-yellow-400">{user.xpPoints.toLocaleString()} XP</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                <input
                  type="text"
                  placeholder="Pretraži korisnike..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500"
                />
              </div>

              {loading ? (
                <p className="text-dark-400">Učitavanje...</p>
              ) : filteredUsers.length === 0 ? (
                <p className="text-dark-400">Nema korisnika.</p>
              ) : (
                <div className="space-y-2">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="overflow-hidden">
                      <div 
                        className="p-3 flex items-center gap-3 cursor-pointer hover:bg-dark-800/50"
                        onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                      >
                        <Avatar size="md">{user.nickname?.charAt(0) || '?'}</Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-bold truncate">{user.nickname}</p>
                            {user.verified && <span className="text-yellow-500 text-xs">✓</span>}
                            {user.role !== 'polaznik' && (
                              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                                {getRoleName(user.role)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-dark-400 truncate">{user.email}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm font-medium">{getRankName(user.rankLevel)}</p>
                          <p className="text-xs text-yellow-400">{user.xpPoints?.toLocaleString() || 0} XP</p>
                        </div>
                        {expandedUser === user.id ? 
                          <ChevronUp className="w-4 h-4 text-dark-400" /> : 
                          <ChevronDown className="w-4 h-4 text-dark-400" />
                        }
                      </div>

                      {expandedUser === user.id && (
                        <div className="p-4 border-t border-dark-700 bg-dark-800/30">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-dark-500">Čin</p>
                              <p className="font-medium text-sm">{getRoleName(user.role)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-500">Rang</p>
                              <p className="font-medium text-sm">{user.rankLevel} - {getRankName(user.rankLevel)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-500">XP</p>
                              <p className="font-medium text-sm">{user.xpPoints?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                              <p className="text-xs text-dark-500">Kreiran</p>
                              <p className="font-medium text-sm">{new Date(user.createdAt).toLocaleDateString('sr-RS')}</p>
                            </div>
                          </div>

                          {editingUser?.id === user.id ? (
                            <div className="flex gap-2">
                              <select 
                                value={newValue}
                                onChange={(e) => setNewValue(e.target.value)}
                                className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2"
                              >
                                {editingUser.type === 'cin' ? (
                                  <>
                                    <option value="">Izaberi čin...</option>
                                    {Object.values(ROLES).sort((a, b) => b.level - a.level).map((role) => (
                                      <option key={role.id} value={role.id}>{role.icon} {role.name}</option>
                                    ))}
                                  </>
                                ) : (
                                  <>
                                    <option value="">Izaberi rang...</option>
                                    {RANK_LEVELS.map((rank) => (
                                      <option key={rank.level} value={rank.level}>{rank.level} - {rank.name}</option>
                                    ))}
                                  </>
                                )}
                              </select>
                              <Button onClick={() => handleUpdate(user.id, editingUser.type)} variant="primary" size="sm">Sačuvaj</Button>
                              <Button onClick={() => { setEditingUser(null); setNewValue(''); }} variant="outline" size="sm">Odustani</Button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button 
                                onClick={(e) => { e.stopPropagation(); setEditingUser({id: user.id, type: 'cin'}); setNewValue(user.role); }} 
                                variant="success" 
                                size="sm"
                              >
                                <Edit className="w-4 h-4 mr-2" /> Izmeni Čin
                              </Button>
                              <Button 
                                onClick={(e) => { e.stopPropagation(); setEditingUser({id: user.id, type: 'rang'}); setNewValue(user.rankLevel.toString()); }} 
                                variant="success" 
                                size="sm"
                              >
                                <ArrowUp className="w-4 h-4 mr-2" /> Izmeni Rang
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'moderation' && (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-gradient-to-r from-yellow-900/30 to-orange-900/30">
                  <h3 className="font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-yellow-400" />
                    Moderatori - Chat
                  </h3>
                  <p className="text-xs text-dark-400 mt-1">Escalation: Polaznik → Moderator → Community Lead → Executive Board</p>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  <div className="flex gap-3">
                    <Avatar size="sm">M</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Moderator1</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">Moderator</span>
                        <span className="text-xs text-dark-500">10:30</span>
                      </div>
                      <p className="text-dark-300 text-sm">Primećen neprimeren sadržaj u #general kanalu. Rasprava eskalirana.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar size="sm">C</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">CommunityLead</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Community Lead</span>
                        <span className="text-xs text-dark-500">10:32</span>
                      </div>
                      <p className="text-dark-300 text-sm">Razrešeno. Poslao upozorenje korisniku.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-dark-700">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Napiši poruku..." className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-500" />
                    <Button><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>

              {/* Reported Content */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  Prijave i sadržaj za moderaciju
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium">Korisnik: Marko123</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Prijavljen</span>
                    </div>
                    <p className="text-dark-300 text-sm mb-3">Neprimeren komentar u #zajednica kanalu</p>
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">Odobri</Button>
                      <Button variant="danger" size="sm">Odbij</Button>
                      <Button variant="outline" size="sm">Eskaliraj</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'support' && (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-gradient-to-r from-blue-900/30 to-cyan-900/30">
                  <h3 className="font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    Support Tim - Chat
                  </h3>
                  <p className="text-xs text-dark-400 mt-1">Escalation: Polaznik → Support Agent → Support Lead → Admin</p>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  <div className="flex gap-3">
                    <Avatar size="sm">A</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">SupportAgent</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Agent</span>
                        <span className="text-xs text-dark-500">10:25</span>
                      </div>
                      <p className="text-dark-300 text-sm">Novi tiket od korisnika: Ne mogu da pristupim kursu.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Avatar size="sm">L</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">SupportLead</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400">Lead</span>
                        <span className="text-xs text-dark-500">10:28</span>
                      </div>
                      <p className="text-dark-300 text-sm">Rešen. Korisnik dobio pristup.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-dark-700">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Napiši poruku..." className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500" />
                    <Button><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>

              {/* Tickets */}
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  Tiketi korisnika
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Problem sa loginom</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">Hitno</span>
                      </div>
                      <span className="text-xs text-dark-400">Pre 5 min</span>
                    </div>
                    <p className="text-dark-300 text-sm mb-3">Korisnik ne može da se prijavi posle registracije</p>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm">Preuzmi</Button>
                      <Button variant="outline" size="sm">Eskaliraj</Button>
                    </div>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Pitanje o kursu</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">Obično</span>
                      </div>
                      <span className="text-xs text-dark-400">Pre 1h</span>
                    </div>
                    <p className="text-dark-300 text-sm mb-3">Korisnik pita kada izlazi novi modul</p>
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">Odgovori</Button>
                      <Button variant="outline" size="sm">Zatvori</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-green-400" />
                  Zahtevi za verifikaciju
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar size="md">J</Avatar>
                      <div>
                        <p className="font-medium">JovanPreduzetnik</p>
                        <p className="text-xs text-dark-400">jovan@email.com</p>
                      </div>
                    </div>
                    <p className="text-dark-300 text-sm mb-3">Verifikacija za biznis nalog - Auto detailing biznis</p>
                    <div className="flex gap-2">
                      <Button variant="success" size="sm">Odobri</Button>
                      <Button variant="danger" size="sm">Odbij</Button>
                      <Button variant="outline" size="sm">Zatraži dokaz</Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          {activeTab === 'upgrades' && (
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border-purple-500/20">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <ArrowUp className="w-5 h-5 text-purple-400" />
                  Upgrades - Rangovi i Privilegije
                </h3>
                <p className="text-dark-400 text-sm mb-4">Samo Founder, Vision Lead i Admin mogu menjati rangove.</p>
                
                {/* Rank Info */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-medium mb-2">📚 Polaznik (0 XP)</h4>
                    <ul className="text-xs text-dark-400 space-y-1">
                      <li>• Pristup zajednici</li>
                      <li>• Osnovni profili</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-medium mb-2">📖 Aktivni Učenik (100 XP)</h4>
                    <ul className="text-xs text-dark-400 space-y-1">
                      <li>• Sve iz prethodnog</li>
                      <li>• Pristup besplatnim kursevima</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-medium mb-2">🚀 Preduzetnik (1000 XP)</h4>
                    <ul className="text-xs text-dark-400 space-y-1">
                      <li>• Sve iz prethodnog</li>
                      <li>• Pristup svim kursevima</li>
                      <li>• XP za svaki post</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg">
                    <h4 className="font-medium mb-2">💎 Vizionar (4000 XP)</h4>
                    <ul className="text-xs text-dark-400 space-y-1">
                      <li>• Sve iz prethodnog</li>
                      <li>• Verified bedž</li>
                      <li>• Pristup inkubaciji</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Users with rank change */}
              <Card className="p-6">
                <h3 className="font-bold mb-4">Upravljanje rangovima</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Pretraži korisnika..."
                    className="w-full bg-dark-800 border border-dark-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="space-y-2">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-dark-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Avatar size="sm">{user.nickname.charAt(0)}</Avatar>
                        <div>
                          <p className="font-medium text-sm">{user.nickname}</p>
                          <p className="text-xs text-dark-400">{getRankName(user.rankLevel)} - {user.xpPoints} XP</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <ArrowUp className="w-4 h-4 mr-1" /> Promeni rang
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <Card className="overflow-hidden">
                <div className="p-4 border-b border-dark-700 bg-gradient-to-r from-green-900/30 to-emerald-900/30">
                  <h3 className="font-bold flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-400" />
                    Project Leaderi - Chat
                  </h3>
                  <p className="text-xs text-dark-400 mt-1">Strateško planiranje i međusobna pomoć</p>
                </div>
                <div className="h-80 overflow-y-auto p-4 space-y-3">
                  <div className="flex gap-3">
                    <Avatar size="sm">P</Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">ProjectLead1</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">PL</span>
                        <span className="text-xs text-dark-500">10:00</span>
                      </div>
                      <p className="text-dark-300 text-sm">Projekt A napreduje. Potrebna pomoć sa backendom.</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 border-t border-dark-700">
                  <div className="flex gap-2">
                    <input type="text" placeholder="Napiši poruku..." className="flex-1 bg-dark-700 border border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:border-green-500" />
                    <Button><MessageSquare className="w-4 h-4" /></Button>
                  </div>
                </div>
              </Card>

              {/* Projects */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    Projekti
                  </h3>
                  <Button variant="primary" size="sm">
                    <Users className="w-4 h-4 mr-1" /> Novi Projekat
                  </Button>
                </div>
                <div className="space-y-3">
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Projekt A - Web Aplikacija</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400">Aktivan</span>
                    </div>
                    <p className="text-dark-400 text-sm mb-2">Tim od 4 osobe radi na web aplikaciji za zajednicu</p>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">P</Avatar>
                      <Avatar size="sm">J</Avatar>
                      <Avatar size="sm">M</Avatar>
                      <span className="text-xs text-dark-500">+1 više</span>
                    </div>
                  </div>
                  <div className="p-4 bg-dark-800 rounded-lg border border-dark-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Projekt B - Mobile App</span>
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400">U planiranju</span>
                    </div>
                    <p className="text-dark-400 text-sm mb-2">Mobilna aplikacija za iOS i Android</p>
                    <div className="flex items-center gap-2">
                      <Avatar size="sm">S</Avatar>
                      <span className="text-xs text-dark-500">Potrebno 3 više članova</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg"><Users className="w-5 h-5 text-blue-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.length}</p>
                      <p className="text-xs text-dark-400">Ukupno korisnika</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/20 rounded-lg"><TrendingUp className="w-5 h-5 text-green-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">+{Math.floor(users.length * 0.1)}</p>
                      <p className="text-xs text-dark-400">Novih ovaj mesec</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/20 rounded-lg"><Zap className="w-5 h-5 text-yellow-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.reduce((acc, u) => acc + u.xpPoints, 0).toLocaleString()}</p>
                      <p className="text-xs text-dark-400">Ukupno XP</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-lg"><Crown className="w-5 h-5 text-purple-400" /></div>
                    <div>
                      <p className="text-2xl font-bold">{users.filter(u => u.rankLevel >= 5).length}</p>
                      <p className="text-xs text-dark-400">Preduzetnika</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Card className="p-6">
                <h3 className="font-bold mb-4">Analitika po rangovima</h3>
                <div className="space-y-3">
                  {[
                    { name: 'Vizionar', count: users.filter(u => u.rankLevel === 7).length, color: 'bg-purple-500' },
                    { name: 'Izvrsni Direktor', count: users.filter(u => u.rankLevel === 6).length, color: 'bg-blue-500' },
                    { name: 'Preduzetnik', count: users.filter(u => u.rankLevel === 5).length, color: 'bg-green-500' },
                    { name: 'Kandidat', count: users.filter(u => u.rankLevel === 4).length, color: 'bg-yellow-500' },
                    { name: 'Pripravnik', count: users.filter(u => u.rankLevel === 3).length, color: 'bg-orange-500' },
                  ].map((rank) => (
                    <div key={rank.name} className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${rank.color}`} />
                      <span className="flex-1 text-sm">{rank.name}</span>
                      <span className="font-bold">{rank.count}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
