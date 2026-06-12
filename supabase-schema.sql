-- Run this in your Supabase SQL Editor

create table sections (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text not null,
  slug text not null unique,
  image_url text,
  "order" int not null default 0,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  section_id uuid references sections(id) on delete set null,
  name_ar text not null,
  name_en text not null,
  description_ar text,
  description_en text,
  price numeric(10,2) not null default 0,
  stock int not null default 0,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz default now()
);

-- Allow anyone to read sections and active products
alter table sections enable row level security;
alter table products enable row level security;

create policy "Public read sections" on sections for select using (true);
create policy "Public read active products" on products for select using (is_active = true);

-- Authenticated users (admins) can do everything
create policy "Admin all sections" on sections for all using (auth.role() = 'authenticated');
create policy "Admin all products" on products for all using (auth.role() = 'authenticated');
