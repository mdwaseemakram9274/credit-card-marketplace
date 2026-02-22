create extension if not exists "pgcrypto";

create table if not exists public.banks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.cards (
  id uuid primary key default gen_random_uuid(),
  bank_id uuid not null references public.banks(id) on delete cascade,
  slug text not null,
  title text not null,
  source_url text,
  image_url text,
  annual_fee text,
  description text,
  key_benefits jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (bank_id, slug)
);

create index if not exists idx_cards_bank_id on public.cards(bank_id);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_banks_updated_at on public.banks;
create trigger trg_banks_updated_at
before update on public.banks
for each row execute function public.set_updated_at();

drop trigger if exists trg_cards_updated_at on public.cards;
create trigger trg_cards_updated_at
before update on public.cards
for each row execute function public.set_updated_at();
