# 🚀 INSTITUT BIZNIS - Deployment Guide

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Git installed locally

### Step 1: Push to GitHub

```bash
# In your project directory
cd "$env:USERPROFILE/.openclaw/workspace/institut-biznis-web"

# Initialize git (if not done)
git init
git add .
git commit -m "Initial commit - MVP v1.0"

# Create GitHub repository
# Go to github.com → New Repository
# Name: institut-biznis-web
# Create repository

# Push
git remote add origin https://github.com/YOUR_USERNAME/institut-biznis-web.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (in project directory)
cd "$env:USERPROFILE/.openclaw/workspace/institut-biznis-web"
vercel --prod
```

**OR using web interface:**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import from GitHub
4. Select `institut-biznis-web`
5. Click "Deploy"

### Step 3: Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-super-secret-key-min-32-chars
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Step 4: Custom Domain (Optional)

1. Vercel Dashboard → Settings → Domains
2. Add your domain (e.g., institutbiznis.com)
3. Update DNS records at your registrar

---

## Database Options

### Option 1: Supabase (Recommended for Starters)
1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables

### Option 2: Neon (Serverless PostgreSQL)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Vercel

### Option 3: Railway
1. Go to https://railway.app
2. New Project → Add PostgreSQL
3. Get connection string from Variables

---

## Stripe Setup (Payments)

### 1. Create Stripe Account
- Go to https://stripe.com
- Complete registration
- Get API keys from Developers → API keys

### 2. Configure Webhooks
```
Events to listen:
- checkout.session.completed
- customer.subscription.updated
- customer.subscription.deleted
```

Endpoint: `https://your-domain.com/api/webhooks/stripe`

### 3. Products to Create
| Product | Price ID | Description |
|---------|----------|-------------|
| Premium Monthly | price_xxx | 1,999 RSD/month |
| Course Access | price_xxx | One-time purchase |
| Verification | price_xxx | 10€/year |

---

## Discord Bot Setup (Optional)

### 1. Create Bot
1. Go to https://discord.com/developers/applications
2. New Application → Bot
3. Copy Bot Token
4. Add to Vercel: `DISCORD_BOT_TOKEN`

### 2. Invite Bot
```
OAuth2 URL Generator:
- scopes: bot, applications.commands
- permissions: Send Messages, Read Message History
```

---

## What's Included

### ✅ Done
- Landing page with animations
- Course listing & details
- User profiles with XP/rank system
- Community preview (Discord-style)
- Auth pages (login/register)
- Design system & UI components
- Database schema (Prisma)

### ⏳ Need Setup
- Database connection
- Auth API routes
- Payment integration
- Email notifications

---

## Estimated Costs

| Service | Free Tier | Paid |
|---------|-----------|------|
| Vercel Hosting | 100GB bandwidth | Pay-as-go |
| Supabase DB | 500MB database | $4/month |
| Stripe | Standard fees | 2.9% + $0.30 |
| Discord Bot | Free | Free |

**Estimated monthly: $0-50** (depends on traffic)

---

## Rollback Procedure

```bash
# View deployments
vercel list

# Rollback to previous
vercel rollback deployment-url
```

---

## Monitoring

### Vercel Analytics
- Built-in at vercel.com/dashboard
- Shows: Visits, Bandwidth, Functions

### Error Tracking
- Errors show in Vercel dashboard
- Check: Deployment → Functions → Logs

---

## Need Help?

- 📧 Email: support@institutbiznis.com
- 💬 Discord: Join our server
- 📖 Docs: /docs in the project
