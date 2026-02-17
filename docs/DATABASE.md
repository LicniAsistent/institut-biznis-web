# 🚀 INSTITUT BIZNIS - Database Setup Guide

## Quick Start (Local Development)

### 1. Install PostgreSQL

**Option A: Download from postgresql.org**
- Download PostgreSQL 15+ from https://www.postgresql.org/download/
- Install with default settings
- Remember your password!

**Option B: Use Docker**
```bash
docker run --name institut-biznis-db \
  -e POSTGRES_PASSWORD=yourpassword \
  -p 5432:5432 \
  -d postgres:15
```

**Option C: Use Existing Installation**
- PostgreSQL is already installed on D: drive
- Port: 5432
- User: postgres
- Password: 555333

### 2. Create Database

**Using psql (command line):**
```bash
psql -U postgres
```

```sql
CREATE DATABASE institut_biznis;
CREATE USER institut_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE institut_biznis TO institut_user;
GRANT ALL ON SCHEMA public TO institut_user;
\q
```

**Or using pgAdmin:**
1. Open pgAdmin
2. Right-click "Databases" → "Create" → "Database"
3. Name: `institut_biznis`
4. Save

### 3. Configure Environment

Copy the example file:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Database
DATABASE_URL="postgresql://postgres:555333@localhost:5432/institut_biznis?schema=public"

# For local Docker
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/institut_biznis?schema=public"
```

### 4. Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Or run migrations (recommended for production)
npx prisma migrate dev --name init
```

### 5. Seed Demo Data (Optional)

```bash
npx prisma db seed
```

---

## 🔧 Production Database (Recommended: Supabase/Neon)

### Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Update `.env`:

```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres"
```

### Neon (Serverless PostgreSQL)

1. Go to https://neon.tech
2. Create new project
3. Get connection string
4. Update `.env`

### Railway

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL plugin
4. Get connection string from Variables

---

## 🔐 Security Best Practices

### DO:
- ✅ Use environment variables for secrets
- ✅ Enable SSL connections in production
- ✅ Use connection pooling for serverless
- ✅ Regular backups

### DON'T:
- ❌ Commit `.env` to git
- ❌ Use default `postgres` user in production
- ❌ Expose database to internet without VPN

---

## 📊 Schema Management

### View Database Schema
```bash
npx prisma studio
```

### Make Schema Changes
1. Edit `prisma/schema.prisma`
2. Run:
```bash
npx prisma migrate dev --name describe_change
```

### Reset Database (Development Only!)
```bash
npx prisma migrate reset --force
```

---

## 🔗 Connection String Format

```
postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]?schema=[SCHEMA]
```

Examples:
```
# Local
postgresql://postgres:555333@localhost:5432/institut_biznis

# Supabase
postgresql://postgres:password@db.xyz.supabase.co:5432/postgres

# Neon
postgresql://user:password@ep-xyz.us-east-1.aws.neon.tech/neondb
```

---

## 📞 Need Help?

- [Prisma Docs](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- Discord: @institut-biznis-support
