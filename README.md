# Institut Biznis - Web Platform

Business University Platform - Education + Networking + Incubation

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (React)
- **Database:** PostgreSQL + Prisma
- **Auth:** NextAuth.js
- **Payments:** Stripe
- **Styling:** TailwindCSS
- **Database:** Supabase/PostgreSQL

## 📁 Project Structure

```
institut-biznis-web/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── page.tsx      # Landing page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
│   ├── components/        # React components
│   │   ├── ui/          # Base UI components
│   │   ├── course/      # Course-related components
│   │   └── channel/     # Chat channel components
│   ├── lib/             # Utilities
│   │   ├── prisma.ts   # Database client
│   │   └── utils.ts     # Helper functions
│   └── styles/          # Global styles
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
├── .env.example         # Environment variables template
├── package.json
├── tailwind.config.js
└── tsconfig.json
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/LicniAsistent/institut-biznis-web.git
cd institut-biznis-web
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your values
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 📝 Environment Variables

See `.env.example` for all required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - Secret for NextAuth
- `STRIPE_SECRET_KEY` - Stripe API key
- `GITHUB_CLIENT_ID` - GitHub OAuth (optional)
- `GITHUB_CLIENT_SECRET` - GitHub OAuth secret

## 🎯 Features

### MVP (Phase 1)
- [ ] User registration/login
- [ ] User profile system
- [ ] Course listing and viewer
- [ ] Chat channels
- [ ] Basic payment integration

### Phase 2
- [ ] XP/Rank system
- [ ] Challenge events
- [ ] Achievement badges
- [ ] Mobile app

## 👥 Team

- **Founder:** Petar Jurković
- **Vision:** Givers Gain, Connections Before Capital

## 📄 License

MIT License - see LICENSE file

## 📞 Contact

- Website: https://institut-biznis.com
- Email: support@institut-biznis.com
