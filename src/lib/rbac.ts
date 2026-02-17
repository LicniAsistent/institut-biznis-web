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
  level: number; // 10 = highest, 1 = lowest
  permissions: Permission[];
  canAccessChannels: string[];
  canEscalateTo: UserRole[];
  canSeeRoles: UserRole[]; // Koje role može da vidi u sistemu
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

// Proveri da li korisnik ima pristup chat-u
export function canAccessChannel(userRole: UserRole, channelId: string): boolean {
  const channel = CHANNELS[channelId];
  if (!channel) return false;
  return channel.allowedRoles.includes(userRole);
}

// Proveri da li korisnik može da eskalira
export function canEscalate(userRole: UserRole): boolean {
  return ROLES[userRole]?.canEscalateTo.length > 0;
}

// Sledeći nivo eskalacije
export function getNextEscalationLevel(userRole: UserRole): UserRole | null {
  return ROLES[userRole]?.canEscalateTo[0] || null;
}

// Put eskalacije do vrha
export function getEscalationPath(userRole: UserRole): UserRole[] {
  return ROLES[userRole]?.canEscalateTo || [];
}

// Vizuelna konfiguracija za prikaz
export function getVisualConfig(role: UserRole) {
  return VISUAL_HIERARCHY[role] || VISUAL_HIERARCHY.polaznik;
}

// Proveri da li rol može da vidi drugi rol
export function canSeeRole(viewerRole: UserRole, targetRole: UserRole): boolean {
  return ROLES[viewerRole]?.canSeeRoles.includes(targetRole) || false;
}

// ==========================================
// RANK LEVELS - XP bazirani rangovi
// ==========================================
  'modify_rbac_structure',
  'assign_founder_role',
  'remove_founder_role',
];

export const REQUIRES_DOUBLE_CONFIRM: Permission[] = [
  'assign_founder_role',
  'remove_founder_role',
];

// Visual Hierarchy Configuration
export const VISUAL_HIERARCHY = {
  founder: {
    name: 'Founder & CEO',
    icon: '👑',
    color: 'gold',
    colorClass: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    glowEffect: 'animate-pulse',
    shadowClass: 'shadow-yellow-400/50',
    auraColor: 'bg-yellow-500/20',
    description: 'Najviša instanca sistema. Ima potpunu kontrolu nad svim aspektima platforme.',
    responsibilities: [
      'Donosi konačne odluke',
      'Postavlja strateški pravac',
      'Upravlja kritičnim dozvolama',
      'Može dodeliti/ukloniti bilo koju rolu'
    ]
  },
  vision_lead: {
    name: 'Vision Lead (CCO)',
    icon: '💡',
    color: 'yellow',
    colorClass: 'from-yellow-300 to-yellow-500',
    borderColor: 'border-yellow-300',
    glowEffect: 'animate-pulse',
    shadowClass: 'shadow-yellow-300/40',
    auraColor: 'bg-yellow-400/20',
    description: 'Operativni produžetak Foundera. Razvija nove pravce i strateške inicijative.',
    responsibilities: [
      'Filtrira zahteve kada Founder nije prisutan',
      'Razvija nove pravce platforme',
      'Ima uvid u sve ključne tokove',
      'Može eskalirati ka Founder-u'
    ]
  },
  executive_board: {
    name: 'Executive Board',
    icon: '👔',
    color: 'violet',
    colorClass: 'from-violet-500 to-purple-600',
    borderColor: 'border-violet-400',
    glowEffect: '',
    shadowClass: 'shadow-violet-400/30',
    auraColor: 'bg-violet-500/15',
    description: 'Uži krug ključnih ljudi koji sprovode viziju.',
    responsibilities: [
      'Učestvuje u donošenju važnih odluka',
      'Daje savete i analize',
      'Angažuje se u kriznim situacijama',
      'Može pokrenuti projektne inicijative'
    ]
  },
  admin: {
    name: 'Admin',
    icon: '⚡',
    color: 'cyan',
    colorClass: 'from-cyan-400 to-cyan-600',
    borderColor: 'border-cyan-400',
    glowEffect: '',
    shadowClass: 'shadow-cyan-400/40',
    auraColor: 'bg-cyan-500/15',
    description: 'Tehnička i sistemska vlast. Ima punu kontrolu sistema.',
    responsibilities: [
      'Upravlja pravilima i pristupima',
      'Rešava ozbiljne sistemske probleme',
      'Upravlja korisnicima i sadržajem',
      'Održava stabilnost platforme'
    ]
  },
  community_lead: {
    name: 'Community Lead',
    icon: '🌟',
    color: 'purple',
    colorClass: 'from-purple-500 to-purple-700',
    borderColor: 'border-purple-500',
    glowEffect: '',
    shadowClass: 'shadow-purple-500/30',
    auraColor: 'bg-purple-500/15',
    description: 'Brine o atmosferi i kulturi zajednice.',
    responsibilities: [
      'Održava zdravu atmosferu',
      'Sarađuje sa moderatorima',
      'Eskalira ozbiljne konflikte',
      'Predlaže poboljšanja zajednice'
    ]
  },
  moderator: {
    name: 'Moderator',
    icon: '🛡️',
    color: 'red',
    colorClass: 'from-red-400 to-red-600',
    borderColor: 'border-red-400',
    glowEffect: '',
    shadowClass: 'shadow-red-400/30',
    auraColor: 'bg-red-500/15',
    description: 'Prati kanale i zajednicu.',
    responsibilities: [
      'Briše neprimeren sadržaj',
      'Smiruje rasprave',
      'Eskalira ozbiljne probleme',
      'Održava red u kanalima'
    ]
  },
  support_agent: {
    name: 'Support Agent',
    icon: '🎧',
    color: 'blue',
    colorClass: 'from-blue-400 to-blue-600',
    borderColor: 'border-blue-400',
    glowEffect: '',
    shadowClass: 'shadow-blue-400/30',
    auraColor: 'bg-blue-500/15',
    description: 'Pomaže korisnicima sa pitanjima i problemima.',
    responsibilities: [
      'Odgovara na korisnička pitanja',
      'Pomaže pri registraciji i login-u',
      'Eskalira složene probleme',
      'Uvodi nove korisnike'
    ]
  },
  support_lead: {
    name: 'Support Lead',
    icon: '🎤',
    color: 'cyan',
    colorClass: 'from-cyan-300 to-cyan-500',
    borderColor: 'border-cyan-300',
    glowEffect: '',
    shadowClass: 'shadow-cyan-300/30',
    auraColor: 'bg-cyan-400/15',
    description: 'Vodi Support tim.',
    responsibilities: [
      'Koordinira Support agente',
      'Obrađuje eskalirane probleme',
      'Organizuje rad tima',
      'Eskalira ka Admin-u ako je potrebno'
    ]
  },
  moderator_leader: {
    name: 'Mod Lead',
    icon: '⭐',
    color: 'orange',
    colorClass: 'from-orange-400 to-orange-600',
    borderColor: 'border-orange-400',
    glowEffect: '',
    shadowClass: 'shadow-orange-400/30',
    auraColor: 'bg-orange-500/15',
    description: 'Vodi moderatore.',
    responsibilities: [
      'Koordinira moderatore',
      'Obrađuje ozbiljne eskalacije',
      'Organizuje rad tima',
      'Sarađuje sa Community Lead-om'
    ]
  },
  project_leader: {
    name: 'Project Leader',
    icon: '🚀',
    color: 'green',
    colorClass: 'from-green-400 to-green-600',
    borderColor: 'border-green-400',
    glowEffect: '',
    shadowClass: 'shadow-green-400/30',
    auraColor: 'bg-green-500/15',
    description: 'Vodi specifične projekte.',
    responsibilities: [
      'Vodi projektni tim',
      'Otvara projektne chat-ove',
      'Rokovi i izveštaji',
      'Komunicira sa višim nivoima'
    ]
  },
  community_contributor: {
    name: 'Community Contributor',
    icon: '🌱',
    color: 'emerald',
    colorClass: 'from-emerald-400 to-emerald-600',
    borderColor: 'border-emerald-400',
    glowEffect: 'animate-pulse',
    shadowClass: 'shadow-emerald-400/30',
    auraColor: 'bg-emerald-500/15',
    description: 'Aktivni član zajednice sa posebnim doprinosom.',
    responsibilities: [
      'Daje kvalitetne predloge',
      'Pomaže drugim članovima',
      'Učestvuje u diskusijama',
      'Može predlagati poboljšanja'
    ]
  },
  polaznik: {
    name: 'Polaznik',
    icon: '📚',
    color: 'gray',
    colorClass: 'from-gray-400 to-gray-600',
    borderColor: 'border-gray-400',
    glowEffect: '',
    shadowClass: 'shadow-gray-400/20',
    auraColor: 'bg-gray-500/10',
    description: 'Obični korisnik platforme.',
    responsibilities: [
      'Uči i napreduje kroz kurseve',
      'Postavlja pitanja',
      'Učestvuje u zajednici',
      'Gradi svoju reputaciju'
    ]
  },
};

// Role Definition Interface
export interface RoleDefinition {
  id: UserRole;
  name: string;
  icon: string;
  color: string;
  level: number;
  description: string;
  permissions: Permission[];
  isTemporary?: boolean;
  defaultForRank?: number;
  visual?: typeof VISUAL_HIERARCHY[UserRole];
}

// Complete Role Definitions
export const ROLES: Record<UserRole, RoleDefinition> = {
  founder: {
    id: 'founder',
    name: 'Founder & CEO',
    icon: '👑',
    color: 'gold',
    level: 11,
    description: 'Najviša instanca sistema',
    permissions: [
      'view_admin_dashboard', 'manage_users', 'manage_roles', 'manage_roles_critical',
      'view_analytics', 'view_revenue', 'view_revenue_critical', 'manage_content',
      'moderate_content', 'manage_courses', 'access_all_channels', 'create_project_channel',
      'manage_support', 'manage_community', 'escalate_to_eb', 'view_eb_chat',
      'send_eb_message', 'view_role_history', 'modify_rbac_structure',
      'assign_founder_role', 'remove_founder_role',
    ],
    visual: VISUAL_HIERARCHY.founder,
  },
  vision_lead: {
    id: 'vision_lead',
    name: 'Vision Lead (CCO)',
    icon: '💡',
    color: 'yellow',
    level: 10,
    description: 'Operativni produžetak Foundera',
    permissions: [
      'view_admin_dashboard', 'manage_users', 'manage_roles', 'view_analytics',
      'manage_content', 'moderate_content', 'access_all_channels', 'create_project_channel',
      'manage_community', 'escalate_to_eb', 'view_eb_chat', 'send_eb_message',
      'view_role_history',
    ],
    visual: VISUAL_HIERARCHY.vision_lead,
  },
  executive_board: {
    id: 'executive_board',
    name: 'Executive Board',
    icon: '👔',
    color: 'violet',
    level: 9,
    description: 'Uži krug ključnih ljudi',
    permissions: [
      'view_admin_dashboard', 'view_analytics', 'access_all_channels',
      'create_project_channel', 'view_eb_chat', 'send_eb_message',
    ],
    visual: VISUAL_HIERARCHY.executive_board,
  },
  admin: {
    id: 'admin',
    name: 'Admin',
    icon: '⚡',
    color: 'cyan',
    level: 8,
    description: 'Tehnička i sistemska vlast',
    permissions: [
      'view_admin_dashboard', 'manage_users', 'manage_roles', 'view_analytics',
      'manage_content', 'moderate_content', 'manage_courses', 'access_all_channels',
      'manage_support', 'manage_community', 'view_role_history',
    ],
    visual: VISUAL_HIERARCHY.admin,
  },
  community_lead: {
    id: 'community_lead',
    name: 'Community Lead',
    icon: '🌟',
    color: 'purple',
    level: 7,
    description: 'Brine o atmosferi i kulturi',
    permissions: [
      'view_admin_dashboard', 'moderate_content', 'manage_community', 'escalate_to_eb',
    ],
    visual: VISUAL_HIERARCHY.community_lead,
  },
  moderator_leader: {
    id: 'moderator_leader',
    name: 'Mod Lead',
    icon: '⭐',
    color: 'orange',
    level: 6,
    description: 'Vodi moderatore',
    permissions: [
      'view_admin_dashboard', 'moderate_content', 'manage_community',
    ],
    visual: VISUAL_HIERARCHY.moderator_leader,
  },
  moderator: {
    id: 'moderator',
    name: 'Moderator',
    icon: '🛡️',
    color: 'red',
    level: 5,
    description: 'Prati kanale i zajednicu',
    permissions: ['moderate_content', 'manage_community'],
    visual: VISUAL_HIERARCHY.moderator,
  },
  support_lead: {
    id: 'support_lead',
    name: 'Support Lead',
    icon: '🎤',
    color: 'cyan',
    level: 6,
    description: 'Vodi Support tim',
    permissions: [
      'view_admin_dashboard', 'manage_support', 'manage_courses',
    ],
    visual: VISUAL_HIERARCHY.support_lead,
  },
  support_agent: {
    id: 'support_agent',
    name: 'Support Agent',
    icon: '🎧',
    color: 'blue',
    level: 5,
    description: 'Pomaže korisnicima',
    permissions: ['manage_support'],
    visual: VISUAL_HIERARCHY.support_agent,
  },
  project_leader: {
    id: 'project_leader',
    name: 'Project Leader',
    icon: '🚀',
    color: 'green',
    level: 7,
    description: 'Vodi projekat',
    permissions: ['create_project_channel', 'view_eb_chat'],
    isTemporary: true,
    visual: VISUAL_HIERARCHY.project_leader,
  },
  community_contributor: {
    id: 'community_contributor',
    name: 'Community Contributor',
    icon: '🌱',
    color: 'emerald',
    level: 4,
    description: 'Aktivni član zajednice',
    permissions: ['community_contributor_badge', 'propose_improvements'],
    visual: VISUAL_HIERARCHY.community_contributor,
  },
  polaznik: {
    id: 'polaznik',
    name: 'Polaznik',
    icon: '📚',
    color: 'gray',
    level: 1,
    description: 'Obični korisnik',
    permissions: [],
    visual: VISUAL_HIERARCHY.polaznik,
  },
};

// Auto-Promotion Rules
export interface AutoPromotionRule {
  id: string;
  name: string;
  targetRole: UserRole;
  conditions: {
    minDaysActive?: number;
    minQualityPosts?: number;
    minRecommendations?: number;
    maxWarnings?: number;
    minRank?: number;
  };
  description: string;
}

export const AUTO_PROMOTION_RULES: AutoPromotionRule[] = [
  {
    id: 'community_contributor',
    name: 'Community Contributor',
    targetRole: 'community_contributor',
    conditions: {
      minDaysActive: 60,
      minQualityPosts: 15,
      minRecommendations: 5,
      maxWarnings: 0,
      minRank: 3,
    },
    description: 'Aktivan 60 dana, 15 kvalitetnih postova, 5 preporuka, 0 opomena',
  },
  {
    id: 'support_agent',
    name: 'Support Agent',
    targetRole: 'support_agent',
    conditions: {
      minDaysActive: 90,
      minQualityPosts: 30,
      minRecommendations: 10,
      maxWarnings: 0,
      minRank: 4,
    },
    description: 'Aktivan 90 dana, 30 postova, 10 preporuka, rang 4+',
  },
  {
    id: 'moderator',
    name: 'Moderator',
    targetRole: 'moderator',
    conditions: {
      minDaysActive: 120,
      minQualityPosts: 50,
      minRecommendations: 15,
      maxWarnings: 0,
      minRank: 5,
    },
    description: 'Aktivan 120 dana, 50 postova, 15 preporuka, rang 5+',
  },
];

// Founder Safety Mode
export interface FounderSafetyConfig {
  recoveryEmail: string;
  recoveryKey: string;
  emergencyAdmins: string[];
  lastBackup: Date;
  backupLocation: string;
}

export const FOUNDER_SAFETY: FounderSafetyConfig = {
  recoveryEmail: 'petar.jurkovic666@gmail.com',
  recoveryKey: 'IB-SAFETY-2026-KEY',
  emergencyAdmins: ['admin1@ib.com', 'admin2@ib.com'],
  lastBackup: new Date(),
  backupLocation: 'secure-cloud-backup',
};

// Check user eligibility for auto-promotion
export function checkAutoPromotionEligibility(
  userStats: {
    daysActive: number;
    qualityPosts: number;
    recommendations: number;
    warnings: number;
    currentRank: number;
  },
  rule: AutoPromotionRule
): { eligible: boolean; progress: Record<string, number> } {
  const progress: Record<string, number> = {};
  
  let allMet = true;
  
  if (rule.conditions.minDaysActive) {
    progress['daysActive'] = Math.min(100, (userStats.daysActive / rule.conditions.minDaysActive) * 100);
    if (userStats.daysActive < rule.conditions.minDaysActive) allMet = false;
  }
  
  if (rule.conditions.minQualityPosts) {
    progress['qualityPosts'] = Math.min(100, (userStats.qualityPosts / rule.conditions.minQualityPosts) * 100);
    if (userStats.qualityPosts < rule.conditions.minQualityPosts) allMet = false;
  }
  
  if (rule.conditions.minRecommendations) {
    progress['recommendations'] = Math.min(100, (userStats.recommendations / rule.conditions.minRecommendations) * 100);
    if (userStats.recommendations < rule.conditions.minRecommendations) allMet = false;
  }
  
  if (rule.conditions.maxWarnings) {
    progress['warnings'] = userStats.warnings <= rule.conditions.maxWarnings ? 100 : 0;
    if (userStats.warnings > rule.conditions.maxWarnings) allMet = false;
  }
  
  if (rule.conditions.minRank) {
    progress['rank'] = userStats.currentRank >= rule.conditions.minRank ? 100 : (userStats.currentRank / rule.conditions.minRank) * 100;
    if (userStats.currentRank < rule.conditions.minRank) allMet = false;
  }
  
  return { eligible: allMet, progress };
}

// Helper Functions
export function hasPermission(userPermissions: Permission[], required: Permission): boolean {
  return userPermissions.includes(required);
}

export function canAccessEBChat(roles: UserRole[]): boolean {
  const ebRoles: UserRole[] = ['founder', 'vision_lead', 'executive_board', 'project_leader'];
  return roles.some(role => ebRoles.includes(role));
}

export function canManageRoles(role: UserRole): boolean {
  return ['founder', 'admin'].includes(role);
}

export function canModifyCritical(role: UserRole): boolean {
  return role === 'founder';
}

export function getAllPermissions(roles: UserRole[]): Permission[] {
  const permissions = new Set<Permission>();
  roles.forEach(role => {
    ROLES[role]?.permissions.forEach(p => permissions.add(p));
  });
  return Array.from(permissions);
}

export function getVisualConfig(role: UserRole) {
  return VISUAL_HIERARCHY[role] || VISUAL_HIERARCHY.polaznik;
}

// Rank Levels
export const RANK_LEVELS = [
  { level: 1, name: 'Polaznik' },
  { level: 2, name: 'Aktivni učenik' },
  { level: 3, name: 'Pripravnik' },
  { level: 4, name: 'Kandidat' },
  { level: 5, name: 'Preduzetnik' },
  { level: 6, name: 'Izvrsni direktor' },
  { level: 7, name: 'Vizionar' },
];
