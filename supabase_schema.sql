-- ==============================================================================
-- MINDFLIX - DATABASE SCHEMA & HARDENED ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Principle: Deny by default, explicitly allow only authorized operations.
-- No user can read, create, modify, or delete another user's records.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE lesson_type AS ENUM ('video', 'audio', 'pdf', 'article', 'file', 'link');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE course_status AS ENUM ('not_started', 'in_progress', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked strictly to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    raw_title TEXT NOT NULL,
    display_title TEXT NOT NULL,
    description TEXT,
    provider TEXT NOT NULL,
    cover_image TEXT,
    relative_path TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    classification_source TEXT DEFAULT 'auto',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. COURSE_CATEGORIES (Many-to-Many relationship)
CREATE TABLE IF NOT EXISTS public.course_categories (
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (course_id, category_id)
);

-- 7. MODULES TABLE
CREATE TABLE IF NOT EXISTS public.modules (
    id TEXT PRIMARY KEY,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    raw_title TEXT NOT NULL,
    display_title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    relative_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. LESSONS TABLE
CREATE TABLE IF NOT EXISTS public.lessons (
    id TEXT PRIMARY KEY,
    module_id TEXT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    raw_title TEXT NOT NULL,
    display_title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    type lesson_type DEFAULT 'video',
    relative_path TEXT NOT NULL,
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. LESSON_MATERIALS TABLE
CREATE TABLE IF NOT EXISTS public.lesson_materials (
    id TEXT PRIMARY KEY,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'pdf', 'markdown', 'zip', etc.
    relative_path TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 10. USER_COURSES TABLE (User enrollment / status)
CREATE TABLE IF NOT EXISTS public.user_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    status course_status DEFAULT 'not_started',
    progress_percentage NUMERIC(5,2) DEFAULT 0,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, course_id)
);

-- 11. USER_PROGRESS TABLE (Detailed lesson progress & resume position)
CREATE TABLE IF NOT EXISTS public.user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    position_seconds NUMERIC(10,2) DEFAULT 0,
    duration_seconds NUMERIC(10,2) DEFAULT 0,
    percentage NUMERIC(5,2) DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    last_watched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, lesson_id)
);

-- 12. FAVORITES / MY LIST TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE (user_id, course_id)
);

-- 13. USER_PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 14. PLAYBACK_SESSIONS TABLE (For analytics and study time tracking)
CREATE TABLE IF NOT EXISTS public.playback_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
    lesson_id TEXT NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER DEFAULT 0
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) ENFORCEMENT
-- ==============================================================================

-- Enable and force RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playback_sessions ENABLE ROW LEVEL SECURITY;

-- Clean existing policies to ensure idempotency
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow public read access on courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access on course_categories" ON public.course_categories;
DROP POLICY IF EXISTS "Allow public read access on modules" ON public.modules;
DROP POLICY IF EXISTS "Allow public read access on lessons" ON public.lessons;
DROP POLICY IF EXISTS "Allow public read access on lesson_materials" ON public.lesson_materials;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view own user_courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can insert own user_courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can update own user_courses" ON public.user_courses;
DROP POLICY IF EXISTS "Users can delete own user_courses" ON public.user_courses;

DROP POLICY IF EXISTS "Users can view own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON public.user_progress;
DROP POLICY IF EXISTS "Users can delete own progress" ON public.user_progress;

DROP POLICY IF EXISTS "Users can view own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

DROP POLICY IF EXISTS "Users can view own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON public.user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON public.user_preferences;

DROP POLICY IF EXISTS "Users can view own playback_sessions" ON public.playback_sessions;
DROP POLICY IF EXISTS "Users can insert own playback_sessions" ON public.playback_sessions;

-- ------------------------------------------------------------------------------
-- 1. CATALOG POLICIES (Read-Only for clients; Mutations restricted to Service Role)
-- ------------------------------------------------------------------------------
CREATE POLICY "Allow public read access on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on courses" ON public.courses FOR SELECT USING (is_hidden IS NOT TRUE);
CREATE POLICY "Allow public read access on course_categories" ON public.course_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on modules" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Allow public read access on lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Allow public read access on lesson_materials" ON public.lesson_materials FOR SELECT USING (true);

-- ------------------------------------------------------------------------------
-- 2. USER-SPECIFIC RLS POLICIES (Strict Tenant Isolation with WITH CHECK validation)
-- ------------------------------------------------------------------------------

-- Profiles Table
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- User Courses Table
CREATE POLICY "Users can view own user_courses" ON public.user_courses
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own user_courses" ON public.user_courses
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own user_courses" ON public.user_courses
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own user_courses" ON public.user_courses
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User Progress Table
CREATE POLICY "Users can view own progress" ON public.user_progress
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON public.user_progress
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON public.user_progress
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own progress" ON public.user_progress
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Favorites / My List Table
CREATE POLICY "Users can view own favorites" ON public.favorites
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- User Preferences Table
CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" ON public.user_preferences
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" ON public.user_preferences
    FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Playback Sessions Table
CREATE POLICY "Users can view own playback_sessions" ON public.playback_sessions
    FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own playback_sessions" ON public.playback_sessions
    FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ==============================================================================
-- TRIGGER FOR AUTOMATIC PROFILE & PREFERENCE CREATION ON REGISTRATION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'avatar_url', '')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.user_preferences (user_id)
    VALUES (new.id)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- PERFORMANCE & RLS QUERY INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON public.modules(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_course_order ON public.lessons(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_user_progress_lookup ON public.user_progress(user_id, last_watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_course ON public.user_progress(user_id, course_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_playback_sessions_user_time ON public.playback_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_course_categories_cat ON public.course_categories(category_id);
