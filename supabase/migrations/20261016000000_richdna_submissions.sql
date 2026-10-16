-- RichDNA™ submissions: one row per completed assessment.
-- Visitors (anon) may only INSERT; only the owner's login may SELECT.

create table public.richdna_submissions (
  id                uuid primary key,
  created_at        timestamptz not null default now(),
  first_name        text not null check (char_length(first_name) between 1 and 100),
  last_name         text not null check (char_length(last_name) between 1 and 100),
  email             text not null check (char_length(email) between 3 and 254),
  birthdate         date not null check (birthdate >= date '1900-01-01' and birthdate <= current_date),
  gender            text not null default '' check (gender in ('', 'male', 'female')),
  western_sign      text not null check (char_length(western_sign) <= 40),
  chinese_animal    text not null check (char_length(chinese_animal) <= 40),
  life_path_number  int  not null check (life_path_number in (1,2,3,4,5,6,7,8,9,11,22,33)),
  life_path_title   text not null check (char_length(life_path_title) <= 60),
  receiving_top     text not null check (char_length(receiving_top) <= 40),
  giving_top        text not null check (char_length(giving_top) <= 40),
  receiving_scores  jsonb not null,
  giving_scores     jsonb not null,
  answers           jsonb not null
);

alter table public.richdna_submissions enable row level security;

revoke all on public.richdna_submissions from anon, authenticated;
grant insert on public.richdna_submissions to anon;
grant select on public.richdna_submissions to authenticated;

create policy anon_insert on public.richdna_submissions
  for insert to anon
  with check (true);

create policy owner_select on public.richdna_submissions
  for select to authenticated
  using ((auth.jwt() ->> 'email') = 'emmanuel.bautistaiii@gmail.com');
