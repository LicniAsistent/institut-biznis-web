'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, Input } from '@/components/ui';
import { Avatar } from '@/components/ui/Avatar';
import { 
  Users, Shield, Crown, ChevronDown, ChevronUp, Edit, ArrowUp,
  Settings, BarChart, MessageSquare, UserCheck, AlertTriangle,
  Search, Trophy, Zap, DollarSign, TrendingUp, Activity, BookOpen
} from 'lucide-react';
import { ROLES, RANK_LEVELS } from '@/lib/rbac';
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
      { id: 'executive', label: '🟩 Executive Board', icon: <Users className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'project_leader'] },
      { id: 'overview', label: 'Pregled', icon: <BarChart className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'project_leader'] },
      { id: 'users', label: 'Korisnici', icon: <Users className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
      { id: 'moderation', label: 'Moderacija', icon: <Shield className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'moderator', 'moderator_lead'] },
      { id: 'support', label: 'Podrška', icon: <MessageSquare className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin', 'moderator', 'moderator_lead', 'support_agent', 'support_lead'] },
      { id: 'verification', label: 'Verifikacija', icon: <UserCheck className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
      { id: 'upgrades', label: '⬆️ Upgrades', icon: <ArrowUp className="w-4 h-4" />, roles: ['founder', 'vision_lead', 'admin'] },
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
            <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded border border-yellow-500/30">
              {getRoleName(currentUserRole || '')}
            </span>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* DEBUG INFO - Ukloni kasnije */}
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-xs text-yellow-400">
            <p>Role iz baze: <strong>{currentUserRole || 'NEMA'}</strong></p>
            <p>Auth user role: <strong>{authUser?.role || 'NEMA'}</strong></p>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-dark-400">Dobrodošao, {authUser.nickname}!</p>
          </div>

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

          {activeTab === 'overview' && (
            <div className="space-y-6">
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
            <Card className="p-8 text-center">
              <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Moderacija</h2>
              <p className="text-dark-400">Ovde će se prikazivati prijave i sadržaj za moderaciju.</p>
            </Card>
          )}

          {activeTab === 'support' && (
            <Card className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Podrška</h2>
              <p className="text-dark-400">Ovde će se prikazivati tiketi korisnika.</p>
            </Card>
          )}

          {activeTab === 'verification' && (
            <Card className="p-8 text-center">
              <UserCheck className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Verifikacija</h2>
              <p className="text-dark-400">Ovde će se prikazivati zahtevi za verifikaciju.</p>
            </Card>
          )}
          
          {activeTab === 'upgrades' && (
            <Card className="p-8 text-center">
              <ArrowUp className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Upgrades</h2>
              <p className="text-dark-400">Upgrades panel.</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
