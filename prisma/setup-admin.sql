-- Database Setup SQL Commands for Institut Biznis Platform
-- Run these commands in your PostgreSQL database

-- 1. Find and update Mladi_Preduzetnik as founder
UPDATE "User" 
SET 
    role = 'founder',
    "rankLevel" = 11,
    verified = true,
    "updatedAt" = NOW()
WHERE nickname = 'Mladi_Preduzetnik';

-- 2. Verify Tester023 is a regular user
UPDATE "User" 
SET 
    role = 'polaznik',
    verified = false,
    "updatedAt" = NOW()
WHERE nickname = 'Tester023';

-- 3. Create demo founder if needed (run only if table is empty)
INSERT INTO "User" (
    id, 
    email, 
    nickname, 
    "fullName", 
    role, 
    "rankLevel", 
    "xpPoints", 
    verified, 
    bio, 
    "createdAt", 
    "updatedAt"
)
SELECT 
    'demo_founder_' || gen_random_uuid()::text,
    'petar.jurkovic666@gmail.com',
    'PetarJB',
    'Petar Jurković',
    'founder',
    11,
    100000,
    true,
    'Founder & CEO of Institut Biznis',
    NOW(),
    NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM "User" WHERE email = 'petar.jurkovic666@gmail.com'
);

-- 4. Verify the updates
SELECT 
    id,
    email,
    nickname,
    role,
    "rankLevel",
    verified,
    "createdAt"
FROM "User"
WHERE nickname IN ('Mladi_Preduzetnik', 'Tester023', 'PetarJB')
ORDER BY role DESC;
