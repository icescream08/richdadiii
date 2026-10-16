-- Harden visitor inserts: scores/answers must have the expected JSON shape
-- and size, and visitors can't backdate created_at.

alter table public.richdna_submissions
  add constraint receiving_scores_shape check (jsonb_typeof(receiving_scores) = 'array' and jsonb_array_length(receiving_scores) = 5),
  add constraint giving_scores_shape    check (jsonb_typeof(giving_scores) = 'array' and jsonb_array_length(giving_scores) = 5),
  add constraint answers_shape          check (jsonb_typeof(answers) = 'object' and pg_column_size(answers) <= 8192);

revoke insert on public.richdna_submissions from anon;
grant insert (id, first_name, last_name, email, birthdate, gender, western_sign, chinese_animal,
              life_path_number, life_path_title, receiving_top, giving_top,
              receiving_scores, giving_scores, answers)
  on public.richdna_submissions to anon;
