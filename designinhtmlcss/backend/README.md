# Backend API (Phase 1)

Express + Supabase backend for admin auth and credit card CRUD.

## 1) Setup

```bash
cd backend
npm install
cp .env.example .env
```

Fill `.env`:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`
- `PORT` (optional, default `4000`)
- `JWT_EXPIRES_IN` (optional, default `1d`)
- `CORS_ORIGIN` (optional, default `*`)

## 2) Database

Run SQL from `../supabase/schema.sql` in Supabase SQL Editor.

Then add at least one admin row:

```sql
insert into public.admins (email, password_hash, role)
values ('admin@example.com', '$2a$10$replace_with_bcrypt_hash', 'admin');
```

To generate hash quickly:

```bash
node -e "import bcrypt from 'bcryptjs'; bcrypt.hash('YourPassword123!', 10).then(console.log)"
```

## 3) Run API

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:4000/health
```

## 4) Endpoints

- `POST /api/auth/login`
- `GET /api/meta/banks`
- `GET /api/meta/card-types`
- `GET /api/meta/card-networks`
- `GET /api/cards`
- `GET /api/cards/:idOrSlug`
- `POST /api/cards` (auth)
- `PUT /api/cards/:id` (auth)
- `DELETE /api/cards/:id` (auth)
