create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.banks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  slug text unique,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.card_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.card_networks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  card_name text not null,
  bank_id uuid not null references public.banks(id) on delete restrict,
  card_image_url text,
  joining_fee text,
  annual_fee text,
  interest_rate text,
  reward_program_name text,
  welcome_bonus text,
  card_type_id uuid references public.card_types(id) on delete set null,
  network_id uuid references public.card_networks(id) on delete set null,
  status text not null default 'draft',
  benefits text[] default '{}',
  categories text[] default '{}',
  rewards_details jsonb,
  product_description text,
  product_features text[] default '{}',
  special_perks text[] default '{}',
  eligibility_criteria jsonb,
  pros text[] default '{}',
  cons text[] default '{}',
  custom_fees jsonb,
  created_by uuid references public.admins(id),
  updated_by uuid references public.admins(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_cards_bank_id on public.cards(bank_id);
create index if not exists idx_cards_status on public.cards(status);
create index if not exists idx_cards_slug on public.cards(slug);

insert into public.card_types (name)
values ('Entry-Level'), ('Mid-Tier'), ('Premium')
on conflict (name) do nothing;

insert into public.card_networks (name)
values ('Visa'), ('Mastercard'), ('RuPay'), ('American Express')
on conflict (name) do nothing;
