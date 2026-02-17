// ==========================================
// INSTITUT BIZNIS - ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM
// Linear Hierarchy with Escalation Flow
// ==========================================

// User Role Types - Ordered by Hierarchy (highest to lowest)
export type UserRole = 
  | 'founder'
  | 'vision_lead'
  | 'executive_board'
  | 'admin'
  | 'community_lead'
  | 'moderator'
  | 'support_lead'
  | 'support_agent'
  | 'project_leader'
  | 'polaznik';

// Permission Types
export type Permission =
  | 'access_all_channels'
  | 'access_green_table'
  | 'manage_roles'
  | 'manage_roles_critical'
  | 'view_analytics'
  | 'view_all_chats'
  | 'moderate_content'
  | 'manage_support'
  | 'manage_community'
  | 'manage_projects'
  | 'create_project_channel'
  | 'send_message'
  | 'escalate'
  | 'view_escalation'
  | 'resolve_escalation'
  | 'create_group_chat'
  | 'manage_system'
  | 'manage_strategy'
  | 'manage_vision'
  | 'manage_policy';

// ==========================================
// VISUAL HIERARCHY - Kako se role prikazuje na profilu
// ==========================================
export const VISUAL_HIERARCHY: Record<UserRole, {
  name: string;
  icon: string;
  color: string;
  colorClass: string;
  borderColor: string;
  glowEffect: string;
  description: string;
  responsibilities: string[];
  hasChat: boolean;
  chatName: string;
  escalationTo: UserRole | null;
}> = {
  founder: {
    name: 'Founder & CEO',
    icon: '👑',
    color: 'gold',
    colorClass: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    glowEffect: 'animate-pulse',
    description: 'Vrhovni autoritet i vlasnik sistema.',
    responsibilities: [
      'Dodeljuje i oduzima sve role',
      'Ima pristup svim chatovima i analitikama',
      'Donosi konačne odluke',
      'Menja pravila i strukturu sistema',
      'Ima pristup Zelenom stolu'
    ],
    hasChat: true,
    chatName: 'Founder Channel',
    escalationTo: null,
  },
  vision_lead: {
    name: 'Vision Lead (CCO)',
    icon: '💡',
    color: 'blue',
    colorClass: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    glowEffect: 'animate-pulse',
    description: 'Operativni produžetak Foundera.',
    responsibilities: [
      'Pristup svim chatovima',
      'Filtrira zahteve ka Founderu',
      'Procenjuje eskalacije',
      'Predlaže strateške pravce',
      'Ne može menjati sistemske dozvole bez Foundera'
    ],
    hasChat: true,
    chatName: 'Vision Lead Channel',
    escalationTo: 'founder',
  },
  executive_board: {
    name: 'Executive Board',
    icon: '🏛',
    color: 'violet',
    colorClass: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-400',
    glowEffect: '',
    description: 'Uži krug poverenja.',
    responsibilities: [
      'Učestvuje u donošenju važnih odluka',
      'Pristup strateškim analizama',
      'Ima Executive Board chat',
      'Chat sa Project Leaderima',
      'Ne može menjati sistemske role'
    ],
    hasChat: true,
    chatName: 'Executive Board',
    escalationTo: 'vision_lead',
  },
  admin: {
    name: 'Admin',
    icon: '⚡',
    color: 'cyan',
    colorClass: 'from-cyan-400 to-cyan-600',
    borderColor: 'border-cyan-400',
    glowEffect: '',
    description: 'Tehnička i sistemska vlast.',
    responsibilities: [
      'Upravljanje rolama (osim Foundera)',
      'Upravljanje dozvolama',
      'Rešavanje ozbiljnih sistemskih problema',
      'Ima Admin chat (sa Founderom i Vision Leadom)',
      'Ne odlučuje o strategiji, viziji, politici'
    ],
    hasChat: true,
    chatName: 'Admin',
    escalationTo: 'vision_lead',
  },
  community_lead: {
    name: 'Community Lead',
    icon: '🌿',
    color: 'green',
    colorClass: 'from-green-500 to-emerald-600',
    borderColor: 'border-green-400',
    glowEffect: '',
    description: 'Kultura i atmosfera zajednice.',
    responsibilities: [
      'Saradnja sa Moderatorima',
      'Predlaže unapređenja zajednice',
      'Ima Community Lead chat',
      'Eskalira ka EB/Vision Lead',
      'Pristup Zelenom stolu ako Founder dozvoli'
    ],
    hasChat: true,
    chatName: 'Community Lead',
    escalationTo: 'executive_board',
  },
  moderator: {
    name: 'Moderator',
    icon: '🛡',
    color: 'orange',
    colorClass: 'from-orange-400 to-red-500',
    borderColor: 'border-orange-400',
    glowEffect: '',
    description: 'Redar zajednice.',
    responsibilities: [
      'Briše neprimeren sadržaj',
      'Smiruje rasprave',
      'Ima Moderator chat',
      'Eskalira ka Community Leadu',
      'Ne donosi strateške odluke'
    ],
    hasChat: true,
    chatName: 'Moderators',
    escalationTo: 'community_lead',
  },
  support_lead: {
    name: 'Support Lead',
    icon: '🎧',
    color: 'purple',
    colorClass: 'from-purple-400 to-pink-500',
    borderColor: 'border-purple-400',
    glowEffect: '',
    description: 'Vođa support tima.',
    responsibilities: [
      'Koordinira Support agente',
      'Eskalira Adminu',
      'Ima pristup Support chat-u',
      'Donosi odluke u korisničkim problemima',
      'Upravlja radom tima'
    ],
    hasChat: true,
    chatName: 'Support Team',
    escalationTo: 'admin',
  },
  support_agent: {
    name: 'Support Agent',
    icon: '🎤',
    color: 'blue',
    colorClass: 'from-blue-400 to-cyan-500',
    borderColor: 'border-blue-400',
    glowEffect: '',
    description: 'Prva linija pomoći.',
    responsibilities: [
      'Komunicira sa polaznicima',
      'Daje savete',
      'Prosleđuje probleme Support Leadu',
      'Ima pristup Support chat-u',
      'Ne vidi hijerarhijske diskusije'
    ],
    hasChat: true,
    chatName: 'Support',
    escalationTo: 'support_lead',
  },
  project_leader: {
    name: 'Project Leader',
    icon: '🚀',
    color: 'teal',
    colorClass: 'from-teal-400 to-cyan-500',
    borderColor: 'border-teal-400',
    glowEffect: '',
    description: 'Vođa konkretnog projekta.',
    responsibilities: [
      'Otvara projekat chat (Projekat – Naziv)',
      'Ubacuje ljude od poverenja',
      'Ima chat sa ostalim Project Leaderima',
      'Izveštava više nivoe',
      'Odgovoran za rokove i rezultate'
    ],
    hasChat: true,
    chatName: 'Project Leaders',
    escalationTo: 'executive_board',
  },
  polaznik: {
    name: 'Polaznik',
    icon: '📚',
    color: 'gray',
    colorClass: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    glowEffect: '',
    description: 'Član zajednice.',
    responsibilities: [
      'Može kontaktirati bilo kog člana pojedinačno',
      'Učestvuje u kanalima',
      'Nema pravo kreiranja grupnih chatova',
      'Može eskalirati problemske situacije'
    ],
    hasChat: false,
    chatName: null,
    escalationTo: 'support_agent',
  },
};

// ==========================================
// CHANNELS - Ko ima pristup kom chat-u
// ==========================================
export const CHANNELS: Record<string, {
  name: string;
  allowedRoles: UserRole[];
  requiresEscalation?: boolean;
  greenTableAccess?: boolean;
}> = {
  founder_channel: {
    name: 'Founder Channel',
    allowedRoles: ['founder'],
  },
  vision_lead_channel: {
    name: 'Vision Lead Channel',
    allowedRoles: ['founder', 'vision_lead'],
  },
  executive_board: {
    name: 'Executive Board',
    allowedRoles: ['founder', 'vision_lead', 'executive_board'],
  },
  admin_channel: {
    name: 'Admin',
    allowedRoles: ['founder', 'vision_lead', 'admin'],
  },
  green_table: {
    name: '🟩 Zeleni Sto',
    allowedRoles: ['founder', 'vision_lead'],
    greenTableAccess: true,
    requiresEscalation: true,
  },
  community_lead_channel: {
    name: 'Community Lead',
    allowedRoles: ['founder', 'vision_lead', 'community_lead'],
  },
  moderators_channel: {
    name: 'Moderators',
    allowedRoles: ['founder', 'vision_lead', 'community_lead', 'moderator'],
  },
  support_channel: {
    name: 'Support Team',
    allowedRoles: ['founder', 'vision_lead', 'admin', 'support_lead', 'support_agent'],
  },
  project_leaders_channel: {
    name: 'Project Leaders',
    allowedRoles: ['founder', 'vision_lead', 'executive_board', 'project_leader'],
  },
  project_general: {
    name: 'Projekat - [Naziv]',
    allowedRoles: ['founder', 'vision_lead', 'project_leader'],
    requiresEscalation: false,
  },
  general: {
    name: 'General',
    allowedRoles: ['founder', 'vision_lead', 'admin', 'community_lead', 'moderator', 'support_lead', 'support_agent', 'project_leader', 'polaznik'],
  },
};

// ==========================================
// ESCALATION PATH - Kako eskalacija ide kroz sistem
// ==========================================
export const ESCALATION_PATHS: Record<UserRole, {
  nextLevel: UserRole;
  path: UserRole[];
  description: string;
}> = {
  polaznik: {
    nextLevel: 'support_agent',
    path: ['polaznik', 'support_agent', 'support_lead', 'admin', 'vision_lead', 'founder'],
    description: 'Polaznik → Support Agent → Support Lead → Admin → Vision Lead → Founder',
  },
  support_agent: {
    nextLevel: 'support_lead',
    path: ['support_agent', 'support_lead', 'admin', 'vision_lead', 'founder'],
    description: 'Support Agent → Support Lead → Admin → Vision Lead → Founder',
  },
  support_lead: {
    nextLevel: 'admin',
    path: ['support_lead', 'admin', 'vision_lead', 'founder'],
    description: 'Support Lead → Admin → Vision Lead → Founder',
  },
  moderator: {
    nextLevel: 'community_lead',
    path: ['moderator', 'community_lead', 'executive_board', 'vision_lead', 'founder'],
    description: 'Moderator → Community Lead → Executive Board → Vision Lead → Founder',
  },
  community_lead: {
    nextLevel: 'executive_board',
    path: ['community_lead', 'executive_board', 'vision_lead', 'founder'],
    description: 'Community Lead → Executive Board → Vision Lead → Founder',
  },
  project_leader: {
    nextLevel: 'executive_board',
    path: ['project_leader', 'executive_board', 'vision_lead', 'founder'],
    description: 'Project Leader → Executive Board → Vision Lead → Founder',
  },
  admin: {
    nextLevel: 'vision_lead',
    path: ['admin', 'vision_lead', 'founder'],
    description: 'Admin → Vision Lead → Founder',
  },
  executive_board: {
    nextLevel: 'vision_lead',
    path: ['executive_board', 'vision_lead', 'founder'],
    description: 'Executive Board → Vision Lead → Founder',
  },
  vision_lead: {
    nextLevel: 'founder',
    path: ['vision_lead', 'founder'],
    description: 'Vision Lead → Founder',
  },
  founder: {
    nextLevel: null,
    path: ['founder'],
    description: 'Najviši nivo',
  },
};

// ==========================================
// ROLE DEFINITIONS - Detaljne dozvole za svaku rolu
// ==========================================
export const ROLES: Record<UserRole, {
  id: UserRole;
  name: string;
  icon: string;
  color: string;
  level: number;
  permissions: Permission[];
  canAccessChannels: string[];
  canEscalateTo: UserRole[];
  canSeeRoles: UserRole[];
  description: string;
}> = {
  founder: {
    id: 'founder',
    name: 'Founder & CEO',
    icon: '👑',
    color: 'gold',
    level: 10,
    permissions: ['access_all_channels', 'access_green_table', 'manage_roles', 'manage_roles_critical', 'view_analytics', 'view_all_chats', 'moderate_content', 'manage_support', 'manage_community', 'manage_projects', 'create_project_channel', 'send_message', 'escalate', 'view_escalation', 'resolve_escalation', 'create_group_chat', 'manage_system', 'manage_strategy', 'manage_vision', 'manage_policy'],
    canAccessChannels: Object.keys(CHANNELS),
    canEscalateTo: [],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'admin', 'community_lead', 'moderator', 'support_lead', 'support_agent', 'project_leader', 'polaznik'],
    description: 'Vrhovni autoritet sistema',
  },
  vision_lead: {
    id: 'vision_lead',
    name: 'Vision Lead (CCO)',
    icon: '💡',
    color: 'blue',
    level: 9,
    permissions: ['access_all_channels', 'access_green_table', 'view_analytics', 'view_all_chats', 'moderate_content', 'manage_community', 'create_project_channel', 'send_message', 'escalate', 'view_escalation', 'resolve_escalation'],
    canAccessChannels: ['vision_lead_channel', 'executive_board', 'admin_channel', 'green_table', 'community_lead_channel', 'moderators_channel', 'support_channel', 'project_leaders_channel', 'general'],
    canEscalateTo: ['founder'],
    canSeeRoles: ['vision_lead', 'executive_board', 'admin', 'community_lead', 'moderator', 'support_lead', 'support_agent', 'project_leader', 'polaznik'],
    description: 'Operativni produžetak Foundera',
  },
  executive_board: {
    id: 'executive_board',
    name: 'Executive Board',
    icon: '🏛',
    color: 'violet',
    level: 8,
    permissions: ['view_analytics', 'access_all_channels', 'create_project_channel', 'send_message', 'view_escalation'],
    canAccessChannels: ['executive_board', 'project_leaders_channel', 'general'],
    canEscalateTo: ['vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'admin', 'project_leader', 'polaznik'],
    description: 'Uži krug poverenja za strateške odluke',
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    icon: '⚡',
    color: 'cyan',
    level: 7,
    permissions: ['access_all_channels', 'manage_roles', 'view_analytics', 'view_all_chats', 'moderate_content', 'manage_support', 'manage_community', 'manage_projects', 'send_message', 'escalate', 'view_escalation', 'resolve_escalation', 'create_group_chat'],
    canAccessChannels: ['admin_channel', 'executive_board', 'support_channel', 'moderators_channel', 'community_lead_channel', 'general'],
    canEscalateTo: ['vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'admin', 'community_lead', 'moderator', 'support_lead', 'support_agent', 'polaznik'],
    description: 'Tehnička i sistemska vlast',
  },
  community_lead: {
    id: 'community_lead',
    name: 'Community Lead',
    icon: '🌿',
    color: 'green',
    level: 6,
    permissions: ['moderate_content', 'manage_community', 'send_message', 'escalate', 'view_escalation'],
    canAccessChannels: ['community_lead_channel', 'moderators_channel', 'general'],
    canEscalateTo: ['executive_board', 'vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'admin', 'community_lead', 'moderator', 'polaznik'],
    description: 'Brine o kulturi i atmosferi zajednice',
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    icon: '🛡',
    color: 'orange',
    level: 5,
    permissions: ['moderate_content', 'send_message', 'escalate', 'view_escalation'],
    canAccessChannels: ['moderators_channel', 'general'],
    canEscalateTo: ['community_lead', 'executive_board', 'vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'admin', 'community_lead', 'moderator', 'polaznik'],
    description: 'Redar zajednice',
  },
  support_lead: {
    id: 'support_lead',
    name: 'Support Lead',
    icon: '🎧',
    color: 'purple',
    level: 5,
    permissions: ['manage_support', 'send_message', 'escalate', 'view_escalation', 'resolve_escalation'],
    canAccessChannels: ['support_channel', 'general'],
    canEscalateTo: ['admin', 'vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'admin', 'support_lead', 'support_agent', 'polaznik'],
    description: 'Vođa support tima',
  },
  support_agent: {
    id: 'support_agent',
    name: 'Support Agent',
    icon: '🎤',
    color: 'blue',
    level: 4,
    permissions: ['send_message', 'escalate', 'view_escalation'],
    canAccessChannels: ['support_channel', 'general'],
    canEscalateTo: ['support_lead', 'admin', 'vision_lead', 'founder'],
    canSeeRoles: ['support_lead', 'support_agent', 'polaznik'],
    description: 'Prva linija pomoći korisnicima',
  },
  project_leader: {
    id: 'project_leader',
    name: 'Project Leader',
    icon: '🚀',
    color: 'teal',
    level: 4,
    permissions: ['create_project_channel', 'send_message', 'escalate', 'view_escalation'],
    canAccessChannels: ['project_leaders_channel', 'project_general', 'general'],
    canEscalateTo: ['executive_board', 'vision_lead', 'founder'],
    canSeeRoles: ['founder', 'vision_lead', 'executive_board', 'project_leader', 'polaznik'],
    description: 'Vođa konkretnog projekta',
  },
  polaznik: {
    id: 'polaznik',
    name: 'Polaznik',
    icon: '📚',
    color: 'gray',
    level: 1,
    permissions: ['send_message'],
    canAccessChannels: ['general'],
    canEscalateTo: ['support_agent', 'support_lead', 'admin', 'vision_lead', 'founder'],
    canSeeRoles: ['support_agent', 'support_lead', 'admin', 'moderator', 'community_lead', 'executive_board', 'vision_lead', 'founder', 'polaznik'],
    description: 'Član zajednice koji uči i napreduje',
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

export function canAccessChannel(userRole: UserRole, channelId: string): boolean {
  const channel = CHANNELS[channelId];
  if (!channel) return false;
  return channel.allowedRoles.includes(userRole);
}

export function canEscalate(userRole: UserRole): boolean {
  return ROLES[userRole]?.canEscalateTo.length > 0;
}

export function getNextEscalationLevel(userRole: UserRole): UserRole | null {
  return ROLES[userRole]?.canEscalateTo[0] || null;
}

export function getEscalationPath(userRole: UserRole): UserRole[] {
  return ROLES[userRole]?.canEscalateTo || [];
}

export function getVisualConfig(role: UserRole) {
  return VISUAL_HIERARCHY[role] || VISUAL_HIERARCHY.polaznik;
}

export function canSeeRole(viewerRole: UserRole, targetRole: UserRole): boolean {
  return ROLES[viewerRole]?.canSeeRoles.includes(targetRole) || false;
}

// ==========================================
// CRITICAL PERMISSIONS
// ==========================================
export const CRITICAL_PERMISSIONS: Permission[] = [
  'manage_roles_critical',
  'modify_rbac_structure',
  'assign_founder_role',
  'remove_founder_role',
];

export const REQUIRES_DOUBLE_CONFIRM: Permission[] = [
  'assign_founder_role',
  'remove_founder_role',
];

// ==========================================
// RANK LEVELS
// ==========================================
export const RANK_LEVELS = [
  { level: 1, name: 'Polaznik', xp: 0 },
  { level: 2, name: 'Aktivni učenik', xp: 100 },
  { level: 3, name: 'Pripravnik', xp: 250 },
  { level: 4, name: 'Kandidat', xp: 500 },
  { level: 5, name: 'Preduzetnik', xp: 1000 },
  { level: 6, name: 'Izvrsni direktor', xp: 2000 },
  { level: 7, name: 'Vizionar', xp: 4000 },
];
