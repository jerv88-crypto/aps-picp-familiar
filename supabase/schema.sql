-- Ejecutar en el editor SQL de tu proyecto Supabase (SQL Editor > New query).

-- Perfiles de usuario (vinculados a auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role text not null default 'USUARIO' check (role in ('USUARIO', 'ADMIN')),
  welcome_popup_seen boolean not null default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Planes de cuidado primario (uno por cada PICP generado/guardado)
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  form_data jsonb not null,
  analisis jsonb,
  created_at timestamptz default now()
);

-- Pagos (cada registro = pago por N planes)
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric not null,
  planes_count integer not null,
  method text check (method in ('transferencia', 'PSE', 'tarjeta')),
  status text not null default 'pendiente' check (status in ('pendiente', 'confirmado')),
  created_at timestamptz default now()
);

-- Configuración de admin (prompt PICP, cuenta de pago)
create table if not exists public.admin_config (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

-- Valores por defecto
insert into public.admin_config (key, value) values
  ('prompt_picp', 'Eres experto en el sector salud, coordinador de APS, conocedor de la Ley 3280 de 2018, RIAS y MINSALUD. Debes crear el Plan Integral de Cuidado Primario (PICP) familiar basado en los datos de la ficha. El análisis debe ser estructurado, integral e intersectorial, articulando acciones de promoción de la salud, prevención de la enfermedad, valoración según ciclo de vida y tamizajes RIAS, con enfoque familiar y comunitario.'),
  ('cuenta_pago', '{"banco":"","numero":"","tipo":"","titular":"","instrucciones":""}')
on conflict (key) do nothing;

-- Función para saber si el usuario actual es admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'ADMIN'
  );
$$ language sql security definer stable;

-- Perfil al registrar usuario
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.plans enable row level security;
alter table public.payments enable row level security;
alter table public.admin_config enable row level security;

-- profiles: usuario ve el suyo; admin ve todos. Usuario puede actualizar su propio perfil (ej. welcome_popup_seen)
create policy "Users can read own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can read all profiles" on public.profiles for select using (public.is_admin());
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- plans: usuario inserta y lee los suyos; admin lee todos
create policy "Users can insert own plans" on public.plans for insert with check (auth.uid() = user_id);
create policy "Users can read own plans" on public.plans for select using (auth.uid() = user_id);
create policy "Admins can read all plans" on public.plans for select using (public.is_admin());

-- payments: usuario inserta y lee los suyos; admin lee y actualiza todos
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() = user_id);
create policy "Users can read own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Admins can read all payments" on public.payments for select using (public.is_admin());
create policy "Admins can update payments" on public.payments for update using (public.is_admin());

-- admin_config: todos los autenticados pueden leer; solo admin escribir
create policy "Authenticated can read admin_config" on public.admin_config for select using (auth.role() = 'authenticated');
create policy "Admins can manage admin_config" on public.admin_config for all using (public.is_admin());

-- Índices
create index if not exists plans_user_id on public.plans(user_id);
create index if not exists payments_user_id on public.payments(user_id);
