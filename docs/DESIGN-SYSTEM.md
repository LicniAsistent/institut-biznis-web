# 🎨 INSTITUT BIZNIS — DESIGN SYSTEM

**Created:** 2026-02-13  
**Based On:** User research, The Real World, Discord, Coursera, Udemy

---

## 🎯 DESIGN PRINCIPLES

### 1. Consumer Psychology (What Works)

#### Trust & Credibility
- Professional imagery
- Real results/testimonials
- Transparent pricing
- Clear value proposition

#### Engagement Triggers
- Progress indicators (XP, levels)
- Achievement badges (visible)
- Community validation (member count)
- Fear of missing out (limited spots)

#### Conversion Optimization
- Clear CTAs (Call-to-Action)
- Social proof (testimonials, numbers)
- Risk reversal (money-back, guarantees)
- Scarcity (limited enrollment)

#### Retention Hooks
- Daily login rewards
- Streak counters
- Progress bars
- Unlockable content
- Community status

---

## 🎨 COLOR SYSTEM

### Primary Brand Colors

```css
/* Green - Growth, Success, Money */
--color-primary-50: #f0fdf4;
--color-primary-100: #dcfce7;
--color-primary-200: #bbf7d0;
--color-primary-300: #86efac;
--color-primary-400: #4ade80;
--color-primary-500: #22c55e;  /* Main brand color */
--color-primary-600: #16a34a;
--color-primary-700: #15803d;
--color-primary-800: #166534;
--color-primary-900: #14532d;
--color-primary-950: #052e16;
```

### Secondary Colors

```css
/* Dark Blue - Professional, Trust */
--color-secondary-50: #eff6ff;
--color-secondary-100: #dbeafe;
--color-secondary-500: #3b82f6;
--color-secondary-600: #2563eb;
--color-secondary-700: #1d4ed8;
--color-secondary-800: #1e40fa;
--color-secondary-900: #1e3a8a;

/* Gold - Achievement, VIP */
--color-gold-500: #f59e0b;
--color-gold-600: #d97706;

/* Red - Urgent, Notification */
--color-red-500: #ef4444;
--color-red-600: #dc2626;

/* Purple - Premium */
--color-purple-500: #a855f7;
```

### Neutral Colors

```css
/* Dark Theme */
--color-dark-900: #0f172a;  /* Background */
--color-dark-800: #1e293b;  /* Cards */
--color-dark-700: #334155;  /* Borders */
--color-dark-600: #475569;  /* Muted text */
--color-dark-500: #64748b;
--color-dark-400: #94a3b8;
--color-dark-300: #cbd5e1;
--color-dark-200: #e2e8f0;
--color-dark-100: #f1f5f9;
--color-dark-50: #f8fafc;
```

---

## 📐 TYPOGRAPHY

### Font Family
```css
/* Primary: Inter or Plus Jakarta Sans */
font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;

/* Headings */
font-weight: 700;

/* Body */
font-weight: 400;
```

### Font Sizes (Scale)
```css
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

---

## 🎭 SPACING SYSTEM

### Base: 4px
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🌙 DARK THEME (Primary)

### Background Layers
```css
/* Dark theme - The Real World inspired */
body {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: #f8fafc;
}

/* Cards */
.card {
  background: linear-gradient(145deg, #1e293b, #0f172a);
  border: 1px solid #334155;
}
```

### Accent Highlights
```css
/* Green glow for success */
.success-glow {
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}

/* Gold glow for achievements */
.gold-glow {
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
}
```

---

## 🎯 BORDER RADIUS

```css
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.5rem;      /* 8px */
--radius-lg: 0.75rem;     /* 12px */
--radius-xl: 1rem;        /* 16px */
--radius-2xl: 1.5rem;     /* 24px */
--radius-full: 9999px;     /* Circle */
```

---

## 📱 RESPONSIVE BREAKPOINTS

```css
--breakpoint-xs: 320px;
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
--breakpoint-2xl: 1536px;
```

---

## 🎨 SHADOWS

```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);
--shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.25);

/* Glow shadows */
--shadow-green: 0 0 20px rgba(34, 197, 94, 0.4);
--shadow-gold: 0 0 20px rgba(245, 158, 11, 0.4);
--shadow-purple: 0 0 20px rgba(168, 85, 247, 0.4);
```

---

## 🔤 COMPONENT NAMING

### BEM-like Convention
```css
/* Block */
.card { }

/* Element */
.card__header { }
.card__body { }
.card__footer { }

/* Modifier */
.card--featured { }
.card__title--large { }
```

---

## 📦 COMPONENT LIBRARY

### Core Components
```
components/ui/
├── Button/
│   ├── Button.tsx
│   ├── Button.stories.tsx
│   └── variants.ts
├── Card/
│   ├── Card.tsx
│   ├── CardHeader.tsx
│   └── CardBody.tsx
├── Avatar/
│   ├── Avatar.tsx
│   ├── AvatarGroup.tsx
│   └── Badge.tsx
├── Badge/
│   ├── Badge.tsx
│   └── RankBadge.tsx
├── Progress/
│   ├── ProgressBar.tsx
│   ├── CircularProgress.tsx
│   └── XPProgress.tsx
├── Modal/
│   ├── Modal.tsx
│   └── ConfirmationModal.tsx
├── Input/
│   ├── Input.tsx
│   ├── Textarea.tsx
│   └── Select.tsx
├── Tab/
│   ├── Tab.tsx
│   └── Tabs.tsx
├── Dropdown/
│   ├── Dropdown.tsx
│   └── Menu.tsx
├── Toast/
│   ├── Toast.tsx
│   └── Toaster.tsx
├── Skeleton/
│   ├── Skeleton.tsx
│   └── SkeletonText.tsx
└── Loading/
    ├── Spinner.tsx
    └── PageLoader.tsx
```

### Layout Components
```
components/layout/
├── Navbar/
│   ├── Navbar.tsx
│   ├── NavbarMobile.tsx
│   └── UserMenu.tsx
├── Sidebar/
│   ├── Sidebar.tsx
│   ├── ChannelList.tsx
│   └── CategorySection.tsx
├── Header/
│   ├── PageHeader.tsx
│   └── SectionHeader.tsx
├── Footer/
│   ├── Footer.tsx
│   └── FooterLinks.tsx
└── Container/
    ├── Container.tsx
    └── Section.tsx
```

### Feature Components
```
components/features/
├── Profile/
│   ├── UserProfile.tsx
│   ├── ProfileHeader.tsx
│   ├── ProfileStats.tsx
│   ├── ProfileXP.tsx
│   ├── ProfileAchievements.tsx
│   └── ProfileSettings.tsx
├── Course/
│   ├── CourseCard.tsx
│   ├── CourseList.tsx
│   ├── CoursePlayer.tsx
│   ├── LessonProgress.tsx
│   └── Certificate.tsx
├── Channel/
│   ├── ChannelList.tsx
│   ├── ChannelMessage.tsx
│   ├── ChannelInput.tsx
│   └── ChannelHeader.tsx
├── Challenge/
│   ├── ChallengeCard.tsx
│   ├── ChallengeList.tsx
│   ├── TeamDisplay.tsx
│   └── Leaderboard.tsx
└── Achievement/
    ├── AchievementBadge.tsx
    ├── AchievementGrid.tsx
    └── AchievementToast.tsx
```

---

## 🎯 KEY USER FLOWS

### 1. Onboarding Flow
```
Landing Page → Sign Up → Email Verification → 
Profile Setup → Select Interests → 
Browse Courses → Purchase Course → Start Learning
```

### 2. Learning Flow
```
Dashboard → My Courses → Course Player → 
Complete Lesson → Earn XP → 
Check Progress → Unlock Next → Celebrate
```

### 3. Community Flow
```
Channels → Select Channel → View Messages → 
Post Message → Get Reactions → 
Build Reputation → Earn Badges
```

### 4. Challenge Flow
```
Challenges → View Active → Join Team → 
Submit Plan → Wait for Results → 
Win/Feedback → Celebrate/Learn
```

---

## 🔄 ANIMATION GUIDELINES

### Transitions (Fast)
```css
/* Hover states - 150ms */
transition: all 150ms ease;

/* Modal/Overlay - 200ms */
transition: all 200ms ease;

/* Page transitions - 300ms */
transition: all 300ms ease;
```

### Key Animations
```css
/* Success celebration */
@keyframes success-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* XP Gain */
@keyframes xp-gain {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-20px); opacity: 0; }
}

/* Loading skeleton */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Achievement unlock */
@keyframes unlock-glow {
  0%, 100% { box-shadow: 0 0 0 rgba(245, 158, 11, 0); }
  50% { box-shadow: 0 0 30px rgba(245, 158, 11, 0.8); }
}
```

---

## 📱 MOBILE CONSIDERATIONS

### Touch Targets
```css
/* Minimum touch target: 44x44px */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Spacing between targets */
.touch-gap {
  gap: 16px;
}
```

### Bottom Navigation (Mobile)
```css
/* Mobile bottom nav - fixed */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--color-dark-800);
  border-top: 1px solid var(--color-dark-700);
}
```

### Swipe Gestures
- Swipe left/right for channel navigation
- Swipe down to refresh
- Pull to load more

---

## 🎨 DARK MODE IMPLEMENTATION

### CSS Variables (Auto-switch)
```css
:root {
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --border-color: #334155;
}

@media (prefers-color-scheme: light) {
  :root {
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --text-primary: #0f172a;
    --text-secondary: #64748b;
    --border-color: #e2e8f0;
  }
}
```

---

## 📊 ICONOGRAPHY

### Icon Library: Lucide React
```bash
npm install lucide-react
```

### Usage
```tsx
import { Home, User, BookOpen, MessageSquare, Trophy, Settings } from 'lucide-react';

<Home size={24} className="text-green-500" />
```

### Custom Icons
```css
/* Rank Icons */
.rank-icon {
  /* Custom SVG or icon font */
}

/* Achievement Icons */
.achievement-icon {
  /* Custom design */
}
```

---

## 🎯 WRITING STYLE

### Headings
- Clear, benefit-driven
- Under 60 characters
- Action-oriented verbs

### Body Copy
- Short paragraphs (2-3 sentences)
- Bullet points for lists
- Emojis for visual interest (sparingly)
- Bold for key terms

### CTAs
- Action verbs: "Kreni", "Saznaj više", "Prijavi se"
- Benefits: "Zaradi", "Nauči", "Poveži se"
- Urgency: "Sada", "Još danas"

---

## 🔍 ACCESSIBILITY

### Color Contrast (WCAG 2.1 AA)
```css
/* Minimum contrast ratio: 4.5:1 */
.text-primary { color: #f8fafc; }
.bg-dark { background: #0f172a; }

/* Focus indicators */
*:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

### Screen Readers
```tsx
/* Skip links */
<Link href="#main" className="sr-only focus:not-sr-only">
  Preskoči na glavni sadržaj
</Link>

/* ARIA labels */
<button aria-label="Prijavi se" />
<input aria-required="true" />
```

---

## 📈 ANALYTICS EVENTS

### Track These Events
```javascript
// Page views
analytics.track('page_view', { page: 'landing' });

// User actions
analytics.track('sign_up', { method: 'email' });
analytics.track('course_start', { course_id: 'auto-101' });
analytics.track('purchase', { amount: 4999 });
analytics.track('xp_earned', { amount: 100, source: 'lesson' });

// Engagement
analytics.track('message_sent', { channel: 'general' });
analytics.track('challenge_joined', { challenge_id: 'biznis-1' });
analytics.track('achievement_unlocked', { achievement: 'first-win' });
```

---

**Document Status:** Ready for Implementation  
**Next:** Create Tailwind config and component library
