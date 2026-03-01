-- Expand schema for admin-driven card detail flow.
-- Safe and idempotent migration.

begin;

create extension if not exists "pgcrypto";

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  is_active boolean not null default true,
  full_name text,
  last_login timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.card_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  icon text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.card_networks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table if exists public.banks
  add column if not exists logo_url text,
  add column if not exists description text;

alter table if exists public.cards
  add column if not exists created_by uuid references public.admins(id),
  add column if not exists updated_by uuid references public.admins(id),
  add column if not exists card_name text,
  add column if not exists card_image_url text,
  add column if not exists joining_fee text,
  add column if not exists interest_rate text,
  add column if not exists reward_program_name text,
  add column if not exists welcome_bonus text,
  add column if not exists card_type_id uuid references public.card_types(id) on delete set null,
  add column if not exists network_id uuid references public.card_networks(id) on delete set null,
  add column if not exists network text,
  add column if not exists card_orientation text not null default 'horizontal',
  add column if not exists status text not null default 'draft',
  add column if not exists benefits text[] default '{}',
  add column if not exists categories text[] default '{}',
  add column if not exists rewards_details jsonb,
  add column if not exists product_description text,
  add column if not exists product_features text[] default '{}',
  add column if not exists special_perks text[] default '{}',
  add column if not exists eligibility_criteria jsonb,
  add column if not exists pros text[] default '{}',
  add column if not exists cons text[] default '{}',
  add column if not exists custom_fees jsonb;

create index if not exists idx_cards_card_type_id on public.cards(card_type_id);
create index if not exists idx_cards_network_id on public.cards(network_id);
create index if not exists idx_cards_status on public.cards(status);
create index if not exists idx_cards_slug on public.cards(slug);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_admins_updated_at on public.admins;
create trigger trg_admins_updated_at
before update on public.admins
for each row execute function public.set_updated_at();

drop trigger if exists trg_card_types_updated_at on public.card_types;
create trigger trg_card_types_updated_at
before update on public.card_types
for each row execute function public.set_updated_at();

drop trigger if exists trg_card_networks_updated_at on public.card_networks;
create trigger trg_card_networks_updated_at
before update on public.card_networks
for each row execute function public.set_updated_at();

notify pgrst, 'reload schema';

commit;
