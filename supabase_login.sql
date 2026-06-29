-- VERGRENDELEN: alleen ingelogde gebruikers mogen de lijst zien en bewerken.
-- Plak dit in de Supabase SQL editor en klik Run.

alter table public.items enable row level security;

-- oude, open regels weghalen
drop policy if exists "items read"   on public.items;
drop policy if exists "items insert" on public.items;
drop policy if exists "items update" on public.items;
drop policy if exists "items delete" on public.items;

-- nieuwe regels: enkel voor ingelogde (authenticated) gebruikers
create policy "auth read"   on public.items for select to authenticated using (true);
create policy "auth insert" on public.items for insert to authenticated with check (true);
create policy "auth update" on public.items for update to authenticated using (true) with check (true);
create policy "auth delete" on public.items for delete to authenticated using (true);
