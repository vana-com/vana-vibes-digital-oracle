-- Secure RLS policies for reclaim_linkedin_claims and linter fix
begin;

-- 1) Ensure the timestamp function has a fixed search_path (linter: Function Search Path Mutable)
alter function public.update_updated_at_column() set search_path = public, pg_temp;

-- 2) RLS policies: restrict all access to service_role only
-- Drop existing policies if any (idempotent)
drop policy if exists "Service role can select all reclaim_linkedin_claims" on public.reclaim_linkedin_claims;
drop policy if exists "Service role can insert reclaim_linkedin_claims" on public.reclaim_linkedin_claims;
drop policy if exists "Service role can update reclaim_linkedin_claims" on public.reclaim_linkedin_claims;
drop policy if exists "Service role can delete reclaim_linkedin_claims" on public.reclaim_linkedin_claims;

-- Create strict policies
create policy "Service role can select all reclaim_linkedin_claims"
  on public.reclaim_linkedin_claims
  for select
  using ((auth.jwt() ->> 'role') = 'service_role');

create policy "Service role can insert reclaim_linkedin_claims"
  on public.reclaim_linkedin_claims
  for insert
  with check ((auth.jwt() ->> 'role') = 'service_role');

create policy "Service role can update reclaim_linkedin_claims"
  on public.reclaim_linkedin_claims
  for update
  using ((auth.jwt() ->> 'role') = 'service_role');

create policy "Service role can delete reclaim_linkedin_claims"
  on public.reclaim_linkedin_claims
  for delete
  using ((auth.jwt() ->> 'role') = 'service_role');

commit;