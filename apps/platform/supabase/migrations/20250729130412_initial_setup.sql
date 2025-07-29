-- Create the user table in the public schema
CREATE TABLE public.user (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  username text,
  profile_image text,
  theme text,
  config text,
  longest_streak smallint NOT NULL DEFAULT 0,
  current_streak smallint NOT NULL DEFAULT 0,
  last_entry_date timestamp with time zone,
  CONSTRAINT user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.user ENABLE ROW LEVEL SECURITY;

-- Setup RLS policies for the user table
CREATE POLICY "Allow Authenticated Users" ON "public"."user" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);


-- Entry Table 


-- Create the entry table in the public schema
CREATE TABLE public.entry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  entry_date timestamp with time zone NOT NULL DEFAULT now(),
  title text NOT NULL DEFAULT '',
  content text,
  character_count integer NOT NULL DEFAULT 0,
  tags text[] NOT NULL DEFAULT '{}', -- Specify text[] with a default empty array
  pinned boolean NOT NULL DEFAULT false,
  icon text,
  cover text,
  excerpt text,
  type text NOT NULL DEFAULT 'entry',
  CONSTRAINT entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

-- Enable Row Level Security
ALTER TABLE public.entry ENABLE ROW LEVEL SECURITY;

-- Create an index on the foreign key for performance
CREATE INDEX idx_entry_user_id ON public.entry(user_id);

-- Setup RLS policies for the entry table
CREATE POLICY "Allow Authenticated Users" ON "public"."entry" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);


-- Asset Table 


-- Create the asset table in the public schema
CREATE TABLE public.asset (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  mime_type text NOT NULL,
  size bigint NOT NULL,
  file_name text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  path text NOT NULL,
  CONSTRAINT asset_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

-- Enable Row Level Security
ALTER TABLE public.asset ENABLE ROW LEVEL SECURITY;

-- Create an index on the foreign key for performance
CREATE INDEX idx_asset_user_id ON public.asset(user_id);

-- Setup RLS policies for the asset table
CREATE POLICY "Allow Authenticated Users" ON "public"."asset" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);


-- Tag Table 


-- Create the tag table in the public schema
CREATE TABLE public.tag (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  label text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  cover text,
  variant text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  CONSTRAINT tag_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

-- Enable Row Level Security
ALTER TABLE public.tag ENABLE ROW LEVEL SECURITY;

-- Create an index on the foreign key for performance
CREATE INDEX idx_tag_user_id ON public.tag(user_id);

-- Setup RLS policies for the tag table
CREATE POLICY "Allow Authenticated Users" ON "public"."tag" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);


-- Goal Table 


-- Create the goal table in the public schema
CREATE TABLE public.goal (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  description text,
  tags text[] NOT NULL DEFAULT '{}', -- Specify text[] with a default empty array   
  state text NOT NULL DEFAULT 'active',
  cover text,
  icon text,
  CONSTRAINT goal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);

-- Enable Row Level Security
ALTER TABLE public.goal ENABLE ROW LEVEL SECURITY;

-- Create an index on the foreign key for performance       
CREATE INDEX idx_goal_user_id ON public.goal(user_id);

-- Setup RLS policies for the goal table
CREATE POLICY "Allow Authenticated Users" ON "public"."goal" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);


-- Log Table 

-- Create the log table in the public schema
CREATE TABLE public.log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  goal_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  type text,
  content text,
  CONSTRAINT log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id),
  CONSTRAINT log_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goal(id)
);

-- Enable Row Level Security
ALTER TABLE public.log ENABLE ROW LEVEL SECURITY;

-- Create an index on the foreign key for performance
CREATE INDEX idx_log_user_id ON public.log(user_id);
CREATE INDEX idx_log_goal_id ON public.log(goal_id);

-- Setup RLS policies for the log table
CREATE POLICY "Allow Authenticated Users" ON "public"."log" AS PERMISSIVE
FOR ALL TO anon, authenticated USING (true);

-- Create storage bucket for user assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('user-assets', 'user-assets', false);

-- Create storage policy for user-assets bucket
CREATE POLICY "Allow Authenticated Users" 
ON storage.objects FOR ALL 
TO authenticated, anon 
USING ( true );