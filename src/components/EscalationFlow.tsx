'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader } from '@/components/ui';
import { 
  AlertTriangle, AlertCircle, ArrowUp, CheckCircle, XCircle, Clock, 
  Shield, Users, MessageSquare, Bell, FileText
} from 'lucide-react';
import { 
  ROLES, type UserRole, type Permission,
  CRITICAL_PERMISSIONS, REQUIRES_DOUBLE_CONFIRM,
  hasPermission, canModifyCritical, getVisualConfig 
} from '@/lib/rbac';

interface EscalationEntry {
  id: string;
  type: EscalationType;
  priority: EscalationPriority;
  fromRole: UserRole;
  toRole: UserRole;
  userId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'resolved';
  timestamp: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

type EscalationType = 
  | 'support_escalation'
  | 'conflict_escalation'
  | 'strategic_escalation'
  | 'content_moderation'
  | 'user_report';

type EscalationPriority = 'low' | 'medium' | 'high' | 'critical';

const ESCALATION_RULES = {
  support_escalation: {
    from: ['support_agent'],
    to: 'support_lead',
    immediate: true,
    priority: 'high' as EscalationPriority,
  },
  conflict_escalation: {
    from: ['moderator'],
    to: 'community_lead',
    immediate: false,
    priority: 'high' as EscalationPriority,
  },
  strategic_escalation: {
    from: ['community_lead', 'admin'],
    to: 'executive_board',
    immediate: false,
    priority: 'medium' as EscalationPriority,
  },
};

interface EscalationFlowProps {
  currentUser: {
    role: UserRole;
    roles: UserRole[];
    permissions: Permission[];
    nickname: string;
  };
}

// Demo escalations
const demoEscalations: EscalationEntry[] = [
  {
    id: '1',
    type: 'support_escalation',
    priority: 'high',
    fromRole: 'support_agent',
    toRole: 'support_lead',
    userId: 'SupportAgent1',
    reason: 'Tehnicki problem sa kursom',
    timestamp: new Date(),
    status: 'pending',
  },
  {
    id: '2',
    type: 'conflict_escalation',
    priority: 'critical',
    fromRole: 'moderator',
    toRole: 'community_lead',
    userId: 'Mod1',
    reason: 'Ozbiljan konflikt u #general',
    timestamp: new Date(),
    status: 'pending',
  },
  {
    id: '3',
    type: 'strategic_escalation',
    priority: 'critical',
    fromRole: 'community_lead',
    toRole: 'executive_board',
    userId: 'CommunityLead',
    reason: 'Potrebna promena pravila zajednice',
    timestamp: new Date(),
    status: 'pending',
  },
];

export function EscalationFlow({ currentUser }: EscalationFlowProps) {
  const [escalations, setEscalations] = useState<EscalationEntry[]>(demoEscalations);
  const [showDoubleConfirm, setShowDoubleConfirm] = useState(false);
  const [pendingConfirm, setPendingConfirm] = useState<{
    type: string;
    description: string;
    target?: string;
  } | null>(null);

  const canEscalate = currentUser.role === 'support_agent' || 
                      currentUser.role === 'moderator' || 
                      currentUser.role === 'community_lead';
  
  const canReceiveEscalation = currentUser.role === 'support_lead' ||
                               currentUser.role === 'community_lead' ||
                               currentUser.role === 'executive_board' ||
                               currentUser.role === 'founder';

  const getPriorityColor = (priority: EscalationPriority) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 border-red-500 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500 text-orange-400';
      case 'medium': return 'bg-yellow-500/20 border-yellow-500 text-yellow-400';
      case 'low': return 'bg-blue-500/20 border-blue-500 text-blue-400';
    }
  };

  const getTypeIcon = (type: EscalationType) => {
    switch (type) {
      case 'support_escalation': return '🎧';
      case 'conflict_escalation': return '🛡️';
      case 'strategic_escalation': return '💡';
      case 'content_moderation': return '📢';
      case 'user_report': return '👤';
    }
  };

  const handleResolve = (id: string, resolution: string) => {
    setEscalations(prev => prev.map(e => 
      e.id === id ? { ...e, status: 'resolved', resolution, resolvedBy: currentUser.nickname } : e
    ));
  };

  const handleDoubleConfirm = (type: string, description: string, target?: string) => {
    setPendingConfirm({ type, description, target });
    setShowDoubleConfirm(true);
  };

  const confirmAction = () => {
    if (pendingConfirm) {
      // Log the critical action
      console.log('Critical action confirmed:', pendingConfirm);
      setShowDoubleConfirm(false);
      setPendingConfirm(null);
      alert(`⚠️ KRITIČNA AKCIJA IZVRŠENA!\n\nTip: ${pendingConfirm.type}\nOpis: ${pendingConfirm.description}\n\nOva akcija je zabeležena u istoriju.`);
    }
  };

  const escalationRules = [
    {
      rule: 'Support Agent → Odmah',
      from: 'support_agent',
      to: 'support_lead',
      icon: '🎧',
      description: 'SVAKA eskalacija ide direktno Support Lead-u',
    },
    {
      rule: 'Moderator → Ozbiljan',
      from: 'moderator',
      to: 'community_lead',
      icon: '🛡️',
      description: 'Ako moderator označi konflikt kao ozbiljan',
    },
    {
      rule: 'Community Lead → Strateško',
      from: 'community_lead',
      to: 'executive_board',
      icon: '💡',
      description: 'Ako Community Lead označi strateško pitanje',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Escalation Rules Info */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-blue-400" />
            Pravila eskalacije
          </h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {escalationRules.map((rule, index) => (
              <div key={index} className="p-4 bg-dark-700 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{rule.icon}</span>
                  <span className="font-bold">{rule.rule}</span>
                </div>
                <p className="text-sm text-dark-400">{rule.description}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Pending Escalations */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Aktivne eskalacije ({escalations.filter(e => e.status === 'pending').length})
          </h3>
        </CardHeader>
        <CardBody>
          {escalations.filter(e => e.status !== 'resolved').length === 0 ? (
            <p className="text-dark-400 text-center py-4">Nema aktivnih eskalacija</p>
          ) : (
            <div className="space-y-4">
              {escalations.filter(e => e.status !== 'resolved').map((escalation) => (
                <div 
                  key={escalation.id}
                  className={`p-4 rounded-xl border ${getPriorityColor(escalation.priority)}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(escalation.type)}</span>
                      <div>
                        <p className="font-bold">{escalation.reason}</p>
                        <p className="text-sm opacity-70">
                          {escalation.userId} → {ROLES[escalation.toRole].icon} {ROLES[escalation.toRole].name}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${getPriorityColor(escalation.priority)}`}>
                      {escalation.priority}
                    </span>
                  </div>
                  
                  <p className="text-sm mb-3">{escalation.reason}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs opacity-60">
                      <Clock className="w-4 h-4" />
                      {escalation.timestamp.toLocaleString()}
                    </div>
                    
                    {canReceiveEscalation && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleResolve(escalation.id, 'Rešeno')}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />Reši
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => handleResolve(escalation.id, 'Odbijeno')}
                        >
                          <XCircle className="w-4 h-4 mr-1" />Odbij
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Critical Permissions Protection */}
      <Card>
        <CardHeader>
          <h3 className="font-bold flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-400" />
            Kritične dozvole
          </h3>
        </CardHeader>
        <CardBody>
          <p className="text-dark-400 mb-4">
            Sledeće dozvole zahtevaju posebnu zaštitu i ne mogu biti izmenjene bez Founder-a:
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {CRITICAL_PERMISSIONS.map((perm) => (
              <div 
                key={perm}
                className={`p-3 rounded-xl border ${
                  REQUIRES_DOUBLE_CONFIRM.includes(perm as Permission)
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-orange-500/10 border-orange-500/30'
                }`}
              >
                <div className="flex items-center gap-2">
                  {REQUIRES_DOUBLE_CONFIRM.includes(perm as Permission) ? (
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-orange-400" />
                  )}
                  <span className="font-medium text-sm">{perm}</span>
                </div>
                {REQUIRES_DOUBLE_CONFIRM.includes(perm as Permission) && (
                  <p className="text-xs text-red-400 mt-1">⚠️ Zahteva dvostruku potvrdu</p>
                )}
              </div>
            ))}
          </div>

          {canModifyCritical(currentUser.role) && (
            <div className="mt-4 p-4 bg-gold-500/10 border border-gold-500/30 rounded-xl">
              <p className="font-bold text-gold-400 mb-2">🔐 Founder privilegije</p>
              <p className="text-sm text-dark-400 mb-3">
                Možeš dodeljivati i uklanjati kritične dozvole. Svaka akcija će biti zabeležena.
              </p>
              <Button 
                variant="gold" 
                size="sm"
                onClick={() => handleDoubleConfirm(
                  'modify_rbac',
                  'Izmena RBAC strukture',
                  'Sistemske postavke'
                )}
              >
                <Shield className="w-4 h-4 mr-2" />Izmeni strukturu
              </Button>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Double Confirmation Modal */}
      {showDoubleConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-2xl max-w-md w-full p-6 border-2 border-red-500/50">
            <div className="text-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-400">⚠️ KRITIČNA AKCIJA</h2>
              <p className="text-dark-400 mt-2">
                Ova akcija zahteva dvostruku potvrdu jer utiče na sistemsku bezbednost.
              </p>
            </div>

            <div className="bg-dark-700 rounded-xl p-4 mb-6">
              <p className="text-sm text-dark-400 mb-2">Tip akcije:</p>
              <p className="font-bold">{pendingConfirm?.type}</p>
              {pendingConfirm?.target && (
                <>
                  <p className="text-sm text-dark-400 mb-2 mt-3">Cilj:</p>
                  <p className="font-bold">{pendingConfirm.target}</p>
                </>
              )}
              <p className="text-sm text-dark-400 mb-2 mt-3">Opis:</p>
              <p>{pendingConfirm?.description}</p>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => {
                  setShowDoubleConfirm(false);
                  setPendingConfirm(null);
                }}
              >
                Otkaži
              </Button>
              <Button 
                variant="danger" 
                fullWidth
                onClick={confirmAction}
              >
                <Shield className="w-4 h-4 mr-2" />Potvrdi
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EscalationFlow;
