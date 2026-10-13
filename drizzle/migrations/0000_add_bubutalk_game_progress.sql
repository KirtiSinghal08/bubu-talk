CREATE TABLE public.game_progress (
  user_id uuid PRIMARY KEY,
  xp_total integer NOT NULL DEFAULT 0,
  current_streak integer NOT NULL DEFAULT 0,
  longest_streak integer NOT NULL DEFAULT 0,
  last_played_on date,
  daily_words_completed integer NOT NULL DEFAULT 0,
  daily_words_date date,
  games_completed integer NOT NULL DEFAULT 0,
  earned_badges text[] NOT NULL DEFAULT ARRAY[]::text[],
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.game_progress TO authenticated;
GRANT ALL ON public.game_progress TO service_role;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Players can manage their own game progress" ON public.game_progress FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);