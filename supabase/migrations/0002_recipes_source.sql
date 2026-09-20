-- Recipes: source/source_id für Spoonacular-Imports
alter table recipes
  add column if not exists source text check (source in ('bodyshift','spoonacular','user_submitted')) default 'bodyshift',
  add column if not exists source_id text;

create unique index if not exists recipes_source_lookup on recipes (source, source_id) where source_id is not null;
create index if not exists recipes_category_idx on recipes (category) where is_published;
