# Admin Panel Setup Guide - Institut Biznis Platform

## 📋 Overview

This guide explains how to set up and use the admin panel for the Institut Biznis platform.

---

## 🚀 Quick Setup

### 1. Database Schema Update

First, update your Prisma schema:

```bash
npx prisma generate
npx prisma db push
```

### 2. Set Up Admin Users

**Option A: Using SQL (Recommended)**
```bash
# Run the SQL commands directly in your database
psql -d your_database -f prisma/setup-admin.sql
```

**Option B: Using TypeScript Script**
```bash
npx ts-node prisma/setup-admin.ts
```

### 3. Start the Development Server

```bash
npm run dev
```

---

## 👤 Setting Users as Founder

### Using SQL Command

Connect to your PostgreSQL database and run:

```sql
-- Set Mladi_Preduzetnik as founder
UPDATE "User" 
SET role = 'founder', "rankLevel" = 11, verified = true
WHERE nickname = 'Mladi_Preduzetnik';

-- Keep Tester023 as regular user
UPDATE "User" 
SET role = 'polaznik', verified = false
WHERE nickname = 'Tester023';
```

### Using API Endpoint

Once logged in as founder, you can update users via the API:

```bash
curl -X POST http://localhost:3000/api/admin/update-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{
    "userId": "USER_ID_HERE",
    "updates": {
      "role": "founder",
      "rankLevel": 11,
      "verified": true
    }
  }'
```

---

## 🔐 Accessing the Admin Panel

1. **Log in** to the platform with an admin/founder account
2. **Navigate** to `/admin` URL
3. **Access** the admin dashboard

### URL Structure
- Main Dashboard: `/admin`
- Users Tab: `/admin?tab=users`
- Verifications: `/admin?tab=verifications`
- Moderation: `/admin?tab=moderation`
- Roles: `/admin?tab=roles`

---

## 👥 User Roles Available

| Role | Level | Description |
|------|-------|-------------|
| `founder` | 11 | Full system control |
| `vision_lead` | 10 | Operative extension of founder |
| `executive_board` | 9 | Key decision makers |
| `admin` | 8 | Technical/system authority |
| `community_lead` | 7 | Community culture |
| `moderator_leader` | 6 | Leads moderators |
| `moderator` | 5 | Monitors channels |
| `support_lead` | 6 | Leads support team |
| `support_agent` | 5 | Helps users |
| `project_leader` | 7 | Project leadership |
| `community_contributor` | 4 | Active community member |
| `polaznik` | 1 | Regular user (default) |

---

## 📡 API Endpoints

### GET /api/admin/users
List all users (founder/admin only)

### GET /api/admin/users/[id]
Get single user details

### PATCH /api/admin/users/[id]
Update user (founder only)

### POST /api/admin/update-user
Update user fields (founder only)

---

## 🔒 Security Features

- **Role validation**: Only founder can assign critical roles
- **Password protection**: Passwords never exposed in API responses
- **Session validation**: All endpoints require authentication
- **Audit logging**: Admin actions are logged

---

## 🛠 Troubleshooting

### "Nemate admin privilegije" error
- Ensure your user has `role = 'founder'` or `role = 'admin'`
- Check that you're logged in

### Users not loading
- Verify Prisma schema is updated
- Check database connection
- Run `npx prisma generate` and `npx prisma db push`

### Cannot change role
- Only founder can change roles
- Cannot modify founder's own role

---

## 📞 Support

For issues, contact the platform administrator or check the console logs for detailed error messages.
