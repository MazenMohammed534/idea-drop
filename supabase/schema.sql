create table problems (
  id              uuid primary key default gen_random_uuid(),
  title           text not null check (char_length(title) between 5 and 80),
  description     text not null check (char_length(description) between 50 and 500),
  category        text not null check (category in (
                    'Education','Health','Transportation','Food',
                    'Fintech','Productivity','Technology','Other'
                  )),
  custom_category text,
  name            text,
  linkedin        text,
  open_to_collab  boolean not null default false,
  upvotes         integer not null default 0,
  created_at      timestamptz not null default now()
);

alter table problems enable row level security;

create policy "Anyone can read problems"
  on problems for select using (true);

create policy "Anyone can insert problems"
  on problems for insert with check (true);

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

alter publication supabase_realtime add table problems;
