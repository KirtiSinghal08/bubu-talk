ALTER TABLE public.game_progress
  ADD COLUMN daily_word_ids text[] NOT NULL DEFAULT ARRAY[]::text[];

DROP POLICY "Players can manage their own game progress" ON public.game_progress;
CREATE POLICY "Players can view their own game progress" ON public.game_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
REVOKE INSERT, UPDATE, DELETE ON public.game_progress FROM authenticated;
GRANT SELECT ON public.game_progress TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_game_reward(p_xp integer, p_daily_word_id text DEFAULT NULL)
RETURNS public.game_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_today date := CURRENT_DATE;
  v_reward integer;
  v_progress public.game_progress;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Sign in to save game rewards.';
  END IF;
  IF p_xp IS NULL OR p_xp < 1 OR p_xp > 25 THEN
    RAISE EXCEPTION 'Game rewards must be between 1 and 25 XP.';
  END IF;
  IF p_daily_word_id IS NOT NULL AND (length(p_daily_word_id) > 80 OR length(p_daily_word_id) = 0) THEN
    RAISE EXCEPTION 'Invalid daily word.';
  END IF;

  INSERT INTO public.game_progress (user_id) VALUES (v_user_id) ON CONFLICT (user_id) DO NOTHING;
  SELECT * INTO v_progress FROM public.game_progress WHERE user_id = v_user_id FOR UPDATE;

  IF v_progress.daily_words_date IS DISTINCT FROM v_today THEN
    v_progress.daily_words_date := v_today;
    v_progress.daily_words_completed := 0;
    v_progress.daily_word_ids := ARRAY[]::text[];
  END IF;

  IF p_daily_word_id IS NOT NULL THEN
    IF p_daily_word_id = ANY(v_progress.daily_word_ids) OR cardinality(v_progress.daily_word_ids) >= 3 THEN
      RETURN v_progress;
    END IF;
    v_progress.daily_words_completed := v_progress.daily_words_completed + 1;
    v_progress.daily_word_ids := array_append(v_progress.daily_word_ids, p_daily_word_id);
  END IF;

  v_reward := LEAST(p_xp, 25);
  IF v_progress.last_played_on IS NULL OR v_progress.last_played_on < v_today - 1 THEN
    v_progress.current_streak := 1;
  ELSIF v_progress.last_played_on = v_today - 1 THEN
    v_progress.current_streak := v_progress.current_streak + 1;
  END IF;
  v_progress.longest_streak := GREATEST(v_progress.longest_streak, v_progress.current_streak);
  v_progress.last_played_on := v_today;
  v_progress.xp_total := v_progress.xp_total + v_reward;
  v_progress.games_completed := v_progress.games_completed + 1;

  IF NOT ('first_game' = ANY(v_progress.earned_badges)) THEN
    v_progress.earned_badges := array_append(v_progress.earned_badges, 'first_game');
  END IF;
  IF v_progress.games_completed >= 5 AND NOT ('five_games' = ANY(v_progress.earned_badges)) THEN
    v_progress.earned_badges := array_append(v_progress.earned_badges, 'five_games');
  END IF;
  IF v_progress.xp_total >= 250 AND NOT ('xp_250' = ANY(v_progress.earned_badges)) THEN
    v_progress.earned_badges := array_append(v_progress.earned_badges, 'xp_250');
  END IF;
  IF v_progress.current_streak >= 7 AND NOT ('streak_7' = ANY(v_progress.earned_badges)) THEN
    v_progress.earned_badges := array_append(v_progress.earned_badges, 'streak_7');
  END IF;
  IF v_progress.daily_words_completed >= 3 AND NOT ('daily_3' = ANY(v_progress.earned_badges)) THEN
    v_progress.earned_badges := array_append(v_progress.earned_badges, 'daily_3');
  END IF;

  v_progress.updated_at := now();
  UPDATE public.game_progress SET
    xp_total = v_progress.xp_total,
    current_streak = v_progress.current_streak,
    longest_streak = v_progress.longest_streak,
    last_played_on = v_progress.last_played_on,
    daily_words_completed = v_progress.daily_words_completed,
    daily_words_date = v_progress.daily_words_date,
    daily_word_ids = v_progress.daily_word_ids,
    games_completed = v_progress.games_completed,
    earned_badges = v_progress.earned_badges,
    updated_at = v_progress.updated_at
  WHERE user_id = v_user_id
  RETURNING * INTO v_progress;

  RETURN v_progress;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.claim_game_reward(integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_game_reward(integer, text) TO authenticated;