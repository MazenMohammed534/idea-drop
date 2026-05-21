-- Run in Supabase SQL Editor

alter table problems add column if not exists open_to_collab boolean not null default false;
alter table problems add column if not exists custom_category text;

alter table problems drop constraint if exists problems_category_check;

alter table problems add constraint problems_category_check check (category in (
  'Education','Health','Transportation','Food',
  'Fintech','Productivity','Technology','Other'
));

-- Fix upvotes not persisting (RLS blocks updates without this)
drop policy if exists "Anyone can update upvotes" on problems;
create policy "Anyone can update upvotes"
  on problems for update using (true) with check (true);

create or replace function increment_upvote(problem_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.problems set upvotes = upvotes + 1 where id = problem_id;
end;
$$;

grant execute on function increment_upvote(uuid) to anon;
grant execute on function increment_upvote(uuid) to authenticated;

create or replace function decrement_upvote(problem_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.problems set upvotes = greatest(0, upvotes - 1) where id = problem_id;
end;
$$;

grant execute on function decrement_upvote(uuid) to anon;
grant execute on function decrement_upvote(uuid) to authenticated;
