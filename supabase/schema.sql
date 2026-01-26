-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Categories Table
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  image_url text,
  show_on_home boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Products Table
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  price numeric(10, 2) not null,
  sku text unique,
  stock integer default 0,
  images text[] default array[]::text[],
  category_id uuid references public.categories(id) on delete set null,
  featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Banners Table
create table public.banners (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  active boolean default true,
  sort_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.banners enable row level security;

-- Create Policies
-- Allow public read access
create policy "Public can view products" on public.products for select using (true);
create policy "Public can view categories" on public.categories for select using (true);
create policy "Public can view active banners" on public.banners for select using (true);

-- Allow authenticated users (Admins) to manage everything
-- Note: You might want to restrict this to a specific "role" claim later, but for now assuming authenticated = admin or we check app metadata
-- Ideally, we check for a specific email or role. For simplicity, we'll allow all ALREADY AUTHENTICATED users to edit (since registration should be disabled/protected).
-- IMPORTANT: Update this policy to restrict to your specific admin email if public sign-up is open.
create policy "Admins can manage products" on public.products using (auth.role() = 'authenticated');
create policy "Admins can manage categories" on public.categories using (auth.role() = 'authenticated');
create policy "Admins can manage banners" on public.banners using (auth.role() = 'authenticated');

-- Storage Buckets
-- You need to create 'products' and 'banners' buckets in the Supabase Dashboard.
-- This script creates the policies for them if they exist.

-- STORAGE POLICIES (You might need to create buckets first in dashboard)
-- insert into storage.buckets (id, name, public) values ('products', 'products', true);
-- insert into storage.buckets (id, name, public) values ('banners', 'banners', true);

-- create policy "Public Access Products" on storage.objects for select using ( bucket_id = 'products' );
-- create policy "Admin Access Products" on storage.objects for all using ( bucket_id = 'products' ) with check ( auth.role() = 'authenticated' );

-- create policy "Public Access Banners" on storage.objects for select using ( bucket_id = 'banners' );
-- create policy "Admin Access Banners" on storage.objects for all using ( bucket_id = 'banners' ) with check ( auth.role() = 'authenticated' );
