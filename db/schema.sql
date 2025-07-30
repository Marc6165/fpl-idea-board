-- Fantasy Premier League Idea Board schema
create extension if not exists "pgcrypto";

create table if not exists ideas (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('forfeit', 'reward', 'rule')),
  text varchar(280) not null,
  score int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  idea_id uuid references ideas(id) on delete cascade,
  voter_id uuid not null,
  vote int not null check (vote in (-1,1)),
  created_at timestamptz not null default now(),
  primary key (idea_id, voter_id)
);

-- keep ideas.score in sync
create or replace function update_idea_score() returns trigger as $$
begin
  update ideas
  set score = (select coalesce(sum(vote),0) from votes where idea_id = new.idea_id)
  where id = new.idea_id;
  return new;
end;
$$ language plpgsql;

create trigger votes_aiud
after insert or update or delete on votes
for each row execute procedure update_idea_score(); 

-- View with 24h delta
create or replace view ideas_with_delta as
select i.*, coalesce((select sum(v.vote)
                      from votes v
                      where v.idea_id = i.id
                        and v.created_at > now() - interval '24 hours'),0) as delta_24h
from ideas i; 