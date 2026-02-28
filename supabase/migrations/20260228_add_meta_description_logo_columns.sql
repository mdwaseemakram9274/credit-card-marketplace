-- Admin/API schema compatibility patch.
-- Safe to run multiple times.

begin;

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

alter table if exists public.admins
  add column if not exists full_name text,
  add column if not exists last_login timestamptz;

alter table if exists public.banks
  add column if not exists description text,
  add column if not exists logo_url text;

create table if not exists public.card_types (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

alter table if exists public.card_types
  add column if not exists description text,
  add column if not exists logo_url text;

create table if not exists public.card_networks (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  created_at timestamptz not null default now()
);

alter table if exists public.card_networks
  add column if not exists description text,
  add column if not exists logo_url text;

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

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'banks' and column_name = 'logo'
  ) then
    execute '
      update public.banks
      set logo_url = coalesce(logo_url, logo)
      where logo_url is null and logo is not null
    ';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'banks' and column_name = 'image_url'
  ) then
    execute '
      update public.banks
      set logo_url = coalesce(logo_url, image_url)
      where logo_url is null and image_url is not null
    ';
  end if;
end
$$;

notify pgrst, 'reload schema';

commit;
