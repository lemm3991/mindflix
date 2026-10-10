-- ==============================================================================
-- MINDFLIX - DATABASE SCHEMA FOR SUPABASE (lpzrpbmikwbqknfbilvl)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. USER PREFERENCES
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id TEXT PRIMARY KEY,
    playback_speed NUMERIC(3,2) DEFAULT 1.0,
    autoplay_next BOOLEAN DEFAULT TRUE,
    auto_preview BOOLEAN DEFAULT FALSE,
    auto_resume BOOLEAN DEFAULT TRUE,
    remember_speed_per_course BOOLEAN DEFAULT FALSE,
    parallax_enabled BOOLEAN DEFAULT FALSE,
    interactive_bg_enabled BOOLEAN DEFAULT TRUE,
    reduce_motion BOOLEAN DEFAULT FALSE,
    theme_id TEXT DEFAULT 'cyan-indigo',
    background_style TEXT DEFAULT 'waves',
    gemini_api_key TEXT,
    selected_categories TEXT[] DEFAULT '{}',
    first_login_notice_seen BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. USER PROGRESS
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    lesson_id TEXT NOT NULL,
    position_seconds NUMERIC(10,2) DEFAULT 0,
    duration_seconds NUMERIC(10,2) DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, lesson_id)
);

-- 4. FAVORITES / MINHA LISTA
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, course_id)
);

-- 5. USER COURSES (STATUS / ENROLLMENT)
CREATE TABLE IF NOT EXISTS public.user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    status TEXT DEFAULT 'not_started',
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, course_id)
);

-- 6. PLAYBACK SESSIONS
CREATE TABLE IF NOT EXISTS public.playback_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,
    course_id TEXT,
    lesson_id TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_user_progress_lookup ON public.user_progress(user_id, last_watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON public.user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_courses_user ON public.user_courses(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_sessions_user ON public.playback_sessions(user_id, started_at DESC);

-- 8. ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_sessions ENABLE ROW LEVEL SECURITY;

-- Idempotent RLS Policies: Allow anon & authenticated roles full access to mindflix tables
DROP POLICY IF EXISTS "Allow all on profiles" ON public.profiles;
CREATE POLICY "Allow all on profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on user_preferences" ON public.user_preferences;
CREATE POLICY "Allow all on user_preferences" ON public.user_preferences FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on user_progress" ON public.user_progress;
CREATE POLICY "Allow all on user_progress" ON public.user_progress FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on favorites" ON public.favorites;
CREATE POLICY "Allow all on favorites" ON public.favorites FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on user_courses" ON public.user_courses;
CREATE POLICY "Allow all on user_courses" ON public.user_courses FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all on playback_sessions" ON public.playback_sessions;
CREATE POLICY "Allow all on playback_sessions" ON public.playback_sessions FOR ALL USING (true) WITH CHECK (true);

-- 9. INITIAL SEED FOR LEMMG0800 AND TAMYDOAGRO
INSERT INTO public.profiles (id, email, full_name, avatar_url)
VALUES 
  ('user-lemmg0800', 'lemmg0800@mindflix.local', 'Lemmg0800', ''),
  ('user-tamydoagro', 'tamydoagro@mindflix.local', 'Tamires', '')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name;

INSERT INTO public.user_preferences (user_id, autoplay_next, auto_resume, theme_id)
VALUES
  ('user-lemmg0800', true, true, 'cyan-indigo'),
  ('user-tamydoagro', true, true, 'cyan-indigo')
ON CONFLICT (user_id) DO NOTHING;
