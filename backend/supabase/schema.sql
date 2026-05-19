-- ============================================================
-- BEAUTY STORE — Schema completo do banco de dados
-- Rodar no SQL Editor do Supabase
-- ============================================================

-- Extensões necessárias
create extension if not exists "uuid-ossp";

-- ============================================================
-- PERFIS DE USUÁRIO
-- ============================================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  birth_date date,
  skin_type text check (skin_type in ('oleosa','seca','mista','normal','sensivel')),
  skin_concerns text[],
  points_balance int not null default 0,
  referral_code text unique default substr(md5(random()::text), 1, 8),
  referred_by uuid references profiles(id),
  created_at timestamptz not null default now()
);

-- ============================================================
-- COLEÇÕES
-- ============================================================
create table collections (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  cover_image_url text,
  position int not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PRODUTOS
-- ============================================================
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  collection_id uuid references collections(id) on delete set null,
  skin_types text[],
  concerns text[],
  estimated_duration_days int,
  is_limited bool not null default false,
  is_active bool not null default true,
  created_at timestamptz not null default now()
);

-- Variantes (tamanho, tom, etc.)
create table variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  sku text not null unique,
  price numeric(10,2) not null,
  compare_at_price numeric(10,2),
  stock int not null default 0,
  attributes jsonb,
  created_at timestamptz not null default now()
);

-- Imagens dos produtos
create table images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  position int not null default 0
);

-- Ingredientes
create table ingredients (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  description text,
  benefit text,
  icon_url text
);

-- ============================================================
-- ROTINAS (Modo Rotina Completa)
-- ============================================================
create table routines (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  description text
);

create table routine_products (
  id uuid primary key default uuid_generate_v4(),
  routine_id uuid not null references routines(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  step_order int not null,
  time_of_day text check (time_of_day in ('AM','PM','ambos'))
);

-- ============================================================
-- CARRINHO
-- ============================================================
create table cart_items (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  variant_id uuid not null references variants(id) on delete cascade,
  quantity int not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(),
  unique(user_id, variant_id)
);

-- ============================================================
-- PEDIDOS
-- ============================================================
create table orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  status text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled','refunded')),
  total numeric(10,2) not null,
  shipping_total numeric(10,2) not null default 0,
  discount_total numeric(10,2) not null default 0,
  shipping_address jsonb,
  gift_mode bool not null default false,
  gift_message text,
  payment_id text,
  tracking_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  variant_id uuid not null references variants(id),
  quantity int not null,
  unit_price numeric(10,2) not null
);

-- ============================================================
-- REVIEWS + BEFORE/AFTER (UGC)
-- ============================================================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id),
  rating int not null check (rating between 1 and 5),
  body text,
  before_image_url text,
  after_image_url text,
  approved bool not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- PONTOS (Ritual Points)
-- ============================================================
create table points_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  amount int not null,
  type text not null check (type in ('purchase','review','referral','redemption','expiry')),
  reference_id uuid,
  description text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- WAITLIST
-- ============================================================
create table waitlist (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  product_id uuid not null references products(id) on delete cascade,
  notified bool not null default false,
  created_at timestamptz not null default now(),
  unique(email, product_id)
);

-- ============================================================
-- AFILIADOS (Affiliate Hub)
-- ============================================================
create table affiliates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id),
  code text not null unique default substr(md5(random()::text), 1, 10),
  commission_rate numeric(4,2) not null default 10.00,
  status text not null default 'pending' check (status in ('pending','active','suspended')),
  total_sales numeric(10,2) not null default 0,
  total_earned numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table affiliate_conversions (
  id uuid primary key default uuid_generate_v4(),
  affiliate_id uuid not null references affiliates(id),
  order_id uuid not null references orders(id),
  commission numeric(10,2) not null,
  paid bool not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Profiles: usuário vê/edita apenas o próprio perfil
alter table profiles enable row level security;
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

-- Cart: usuário acessa apenas seu carrinho
alter table cart_items enable row level security;
create policy "cart_own" on cart_items using (auth.uid() = user_id);

-- Orders: usuário vê apenas seus pedidos
alter table orders enable row level security;
create policy "orders_own" on orders for select using (auth.uid() = user_id);

-- Points: usuário vê apenas suas transações
alter table points_transactions enable row level security;
create policy "points_own" on points_transactions for select using (auth.uid() = user_id);

-- Reviews: qualquer um pode ver reviews aprovados
alter table reviews enable row level security;
create policy "reviews_public" on reviews for select using (approved = true);
create policy "reviews_own_insert" on reviews for insert with check (auth.uid() = user_id);

-- Produtos, coleções, variantes, ingredientes: leitura pública
alter table products enable row level security;
create policy "products_public" on products for select using (is_active = true);

alter table collections enable row level security;
create policy "collections_public" on collections for select using (true);

alter table variants enable row level security;
create policy "variants_public" on variants for select using (true);

alter table images enable row level security;
create policy "images_public" on images for select using (true);

alter table ingredients enable row level security;
create policy "ingredients_public" on ingredients for select using (true);

alter table routines enable row level security;
create policy "routines_public" on routines for select using (true);

alter table routine_products enable row level security;
create policy "routine_products_public" on routine_products for select using (true);

alter table waitlist enable row level security;
create policy "waitlist_insert" on waitlist for insert with check (true);

-- ============================================================
-- FUNÇÃO: creditar pontos após compra confirmada
-- ============================================================
create or replace function credit_purchase_points()
returns trigger as $$
begin
  if NEW.status = 'paid' and OLD.status != 'paid' then
    insert into points_transactions (user_id, amount, type, reference_id, description)
    values (NEW.user_id, floor(NEW.total)::int, 'purchase', NEW.id, 'Pontos por compra');

    update profiles
    set points_balance = points_balance + floor(NEW.total)::int
    where id = NEW.user_id;
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

create trigger on_order_paid
  after update on orders
  for each row execute function credit_purchase_points();

-- ============================================================
-- FUNÇÃO: atualizar updated_at nos pedidos
-- ============================================================
create or replace function update_updated_at()
returns trigger as $$
begin
  NEW.updated_at = now();
  return NEW;
end;
$$ language plpgsql;

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();
