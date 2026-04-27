-- Create a test user with auto-confirmed email
-- Run this in Supabase SQL Editor

-- Insert test user into auth.users
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  role,
  aud
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'test@test.com',
  crypt('test123456', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Test User","role":"pm"}',
  now(),
  now(),
  '',
  'authenticated',
  'authenticated'
);

-- Success message
SELECT 'Test user created! Email: test@test.com, Password: test123456' as message;
