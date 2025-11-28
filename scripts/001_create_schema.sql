-- Create profiles table for farmer data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  preferred_language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create crop batches table
create table if not exists public.crop_batches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  crop_type text not null,
  estimated_weight numeric not null,
  harvest_date date not null,
  storage_location text not null,
  storage_type text not null,
  moisture_level numeric,
  temperature numeric,
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create risk assessments table
create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid not null references public.crop_batches(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  risk_level text not null,
  estimated_loss_percentage numeric,
  etcl_hours integer,
  recommendations text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.crop_batches enable row level security;
alter table public.risk_assessments enable row level security;

-- Profiles policies
create policy "Allow users to view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Allow users to update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Allow users to insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Crop batches policies
create policy "Allow users to view their own crop batches"
  on public.crop_batches for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own crop batches"
  on public.crop_batches for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own crop batches"
  on public.crop_batches for update
  using (auth.uid() = user_id);

create policy "Allow users to delete their own crop batches"
  on public.crop_batches for delete
  using (auth.uid() = user_id);

-- Risk assessments policies
create policy "Allow users to view their own risk assessments"
  on public.risk_assessments for select
  using (auth.uid() = user_id);

create policy "Allow users to insert their own risk assessments"
  on public.risk_assessments for insert
  with check (auth.uid() = user_id);

create policy "Allow users to update their own risk assessments"
  on public.risk_assessments for update
  using (auth.uid() = user_id);

-- Create trigger to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, phone, preferred_language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Farmer'),
    coalesce(new.raw_user_meta_data ->> 'phone', null),
    coalesce(new.raw_user_meta_data ->> 'preferred_language', 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
