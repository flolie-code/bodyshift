-- BodyShift — Initial Schema
-- Alle Tabellen sind per Row-Level-Security auf den eingeloggten User beschränkt.

-- Profil (erweitert auth.users)
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  sex text check (sex in ('male','female')),
  birth_date date,
  height_cm numeric(5,2),
  current_weight_kg numeric(5,2),
  target_weight_kg numeric(5,2),
  activity_level text check (activity_level in ('sedentary','light','moderate','active','very_active')),
  goal_pace text check (goal_pace in ('gentle','moderate','ambitious')) default 'moderate',
  daily_kcal_target int,
  daily_protein_g int,
  daily_carbs_g int,
  daily_fat_g int,
  bodyshift_customer_since date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mahlzeiten (jede Erfassung = 1 Zeile)
create table if not exists meals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  logged_at timestamptz not null default now(),
  meal_type text check (meal_type in ('breakfast','lunch','dinner','snack')),
  name text not null,
  amount_grams numeric(7,2),
  kcal int not null,
  protein_g numeric(6,2),
  carbs_g numeric(6,2),
  fat_g numeric(6,2),
  source text check (source in ('manual','barcode','photo_ai','voice','recipe')),
  photo_url text,
  ai_confidence numeric(3,2),
  created_at timestamptz default now()
);

-- Wochenkonto-Anpassungen (User verschiebt Budget zwischen Tagen)
create table if not exists week_adjustments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  week_start date not null,
  weekday int not null check (weekday between 0 and 6),
  delta_kcal int not null,
  is_treat_day boolean default false,
  created_at timestamptz default now(),
  unique (user_id, week_start, weekday)
);

-- Gewichts-Verlauf
create table if not exists weight_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  recorded_at date not null,
  weight_kg numeric(5,2) not null,
  note text,
  created_at timestamptz default now(),
  unique (user_id, recorded_at)
);

-- Wasser-Tracking (pro Tag)
create table if not exists water_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  recorded_on date not null,
  ml int not null,
  created_at timestamptz default now(),
  unique (user_id, recorded_on)
);

-- Behandlungs-Termine
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  scheduled_at timestamptz not null,
  studio text,
  session_number int,
  total_sessions int,
  notes text,
  created_at timestamptz default now()
);

-- Rezepte (kuratiert von BodyShift — global, nicht user-scoped)
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text,
  minutes int,
  kcal int,
  protein_g numeric(6,2),
  carbs_g numeric(6,2),
  fat_g numeric(6,2),
  servings int default 1,
  image_url text,
  ingredients jsonb not null default '[]',
  steps jsonb not null default '[]',
  tags text[] default array[]::text[],
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Favorisierte Rezepte pro User
create table if not exists recipe_favorites (
  user_id uuid not null references auth.users on delete cascade,
  recipe_id uuid not null references recipes on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- === Row-Level Security ===
alter table profiles          enable row level security;
alter table meals             enable row level security;
alter table week_adjustments  enable row level security;
alter table weight_entries    enable row level security;
alter table water_entries     enable row level security;
alter table appointments      enable row level security;
alter table recipes           enable row level security;
alter table recipe_favorites  enable row level security;

-- User sieht/schreibt nur seine eigenen Daten
create policy "own_profile"    on profiles          for all using (id      = auth.uid());
create policy "own_meals"      on meals             for all using (user_id = auth.uid());
create policy "own_wa"         on week_adjustments  for all using (user_id = auth.uid());
create policy "own_weight"     on weight_entries    for all using (user_id = auth.uid());
create policy "own_water"      on water_entries     for all using (user_id = auth.uid());
create policy "own_appts"      on appointments      for all using (user_id = auth.uid());
create policy "own_favs"       on recipe_favorites  for all using (user_id = auth.uid());

-- Rezepte: alle eingeloggten User können published Rezepte lesen
create policy "read_published_recipes" on recipes for select using (is_published = true);

-- Indexes für Performance
create index if not exists meals_user_day    on meals (user_id, (logged_at::date));
create index if not exists weight_user_date  on weight_entries (user_id, recorded_at desc);
create index if not exists appts_user_time   on appointments (user_id, scheduled_at);
