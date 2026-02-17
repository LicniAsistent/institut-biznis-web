// ==========================================
// ROLE-BASED ACCESS CONTROL (RBAC) SYSTEM v3
// With Auto-Promotion, Visual Hierarchy & Founder Safety
// ==========================================

// User Role Types
export type UserRole = 
  | 'founder'
  | 'vision_lead'
  | 'executive_board'
  | 'admin'
  | 'community_lead'
  | 'moderator'
  | 'moderator_leader'
  | 'support_agent'
  | 'support_lead'
  | 'project_leader'
  | 'polaznik'
  | 'community_contributor'; // New auto-promotion role

// Permission Types
export type Permission =
  | 'view_admin_dashboard'
  | 'manage_users'
  | 'manage_roles'
  | 'manage_roles_critical'
  | 'view_analytics'
  | 'view_revenue'
  | 'view_revenue_critical'
  | 'manage_content'
  | 'moderate_content'
  | 'manage_courses'
  | 'access_all_channels'
  | 'create_project_channel'
  | 'manage_support'
  | 'manage_community'
  | 'escalate_to_eb'
  | 'view_eb_chat'
  | 'send_eb_message'
  | 'view_role_history'
  | 'modify_rbac_structure'
  | 'assign_founder_role'
  | 'remove_founder_role'
  | 'community_contributor_badge'
  | 'propose_improvements';

// Critical Permissions
export const CRITICAL_PERMISSIONS: Permission[] = [
  'manage_roles_critical',
  'view_revenue_critical',
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
