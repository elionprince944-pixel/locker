-- LOCKER starter schema for Supabase
-- Run in Supabase Dashboard > SQL Editor. This creates metadata tables only.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.locker_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 180),
  item_type text not null check (item_type in ('folder','pdf','doc','image','other')),
  parent_id uuid references public.locker_items(id) on delete cascade,
  is_starred boolean not null default false,
  storage_path text,
  size_bytes bigint not null default 0 check (size_bytes >= 0),
  is_trashed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists locker_items_owner_created_idx on public.locker_items(owner_id, created_at desc);
create index if not exists locker_items_owner_parent_idx on public.locker_items(owner_id, parent_id);
create index if not exists locker_items_owner_starred_idx on public.locker_items(owner_id, is_starred) where is_starred = true;

alter table public.profiles enable row level security;
alter table public.locker_items enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile" on public.profiles for select to authenticated using ((select auth.uid()) = id);
drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile" on public.profiles for insert to authenticated with check ((select auth.uid()) = id);
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile" on public.profiles for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

drop policy if exists "Users can read own items" on public.locker_items;
create policy "Users can read own items" on public.locker_items for select to authenticated using ((select auth.uid()) = owner_id);
drop policy if exists "Users can create own items" on public.locker_items;
create policy "Users can create own items" on public.locker_items for insert to authenticated with check ((select auth.uid()) = owner_id);
drop policy if exists "Users can update own items" on public.locker_items;
create policy "Users can update own items" on public.locker_items for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
drop policy if exists "Users can delete own items" on public.locker_items;
create policy "Users can delete own items" on public.locker_items for delete to authenticated using ((select auth.uid()) = owner_id);

-- Create a profile row whenever a user signs up.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Optional private Storage bucket: create a bucket named "locker-files" in
-- Storage dashboard and set it to PRIVATE. Then apply these object policies.
drop policy if exists "Users can read their own locker files" on storage.objects;
create policy "Users can read their own locker files" on storage.objects
for select to authenticated using (bucket_id = 'locker-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can upload their own locker files" on storage.objects;
create policy "Users can upload their own locker files" on storage.objects
for insert to authenticated with check (bucket_id = 'locker-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can update their own locker files" on storage.objects;
create policy "Users can update their own locker files" on storage.objects
for update to authenticated using (bucket_id = 'locker-files' and (storage.foldername(name))[1] = (select auth.uid())::text)
with check (bucket_id = 'locker-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
drop policy if exists "Users can delete their own locker files" on storage.objects;
create policy "Users can delete their own locker files" on storage.objects
for delete to authenticated using (bucket_id = 'locker-files' and (storage.foldername(name))[1] = (select auth.uid())::text);
