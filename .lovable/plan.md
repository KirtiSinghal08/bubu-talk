# Play & Learn for BubuTalk

## Build
- Add an age-aware Play & Learn area inside the existing learner dashboard, with five complete vocabulary games, daily word challenges, spoken prompts, hints, and instant feedback.
- Add a compact progress and reward summary for XP, levels, streaks, and earned badges; keep the existing dashboard sections intact.
- Persist game rewards and daily activity in a private, owner-scoped Lovable Cloud table.

## Technical approach
- Keep reusable game UI and curated multilingual vocabulary in focused files; use the existing design tokens, Button component, mascot asset, and browser speech synthesis.
- Scale round length, hint support, and answer choices using the learner age already stored in their profile (ages 5–18; use a gentle middle-band default when unset).
- Apply the additive schema change with explicit grants and RLS, refresh generated database types, then validate the dashboard and all five game modes.
