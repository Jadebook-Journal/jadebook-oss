-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.
CREATE TABLE public.user (
  id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  username text,
  profile_image text,
  theme text,
  longest_streak smallint NOT NULL DEFAULT '0'::smallint,
  current_streak smallint NOT NULL DEFAULT '0'::smallint,
  last_entry_date timestamp with time zone,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.asset (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  mime_type text NOT NULL,
  size bigint NOT NULL,
  file_name text NOT NULL,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  path text NOT NULL,
  CONSTRAINT asset_pkey PRIMARY KEY (id),
  CONSTRAINT asset_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.entry (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  document_date timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  content text,
  character_count integer NOT NULL DEFAULT 0,
  tags ARRAY,
  pinned boolean NOT NULL DEFAULT false,
  icon text,
  cover text,
  excerpt text,
  CONSTRAINT entry_pkey PRIMARY KEY (id),
  CONSTRAINT entry_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.goal (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  end_date timestamp with time zone NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  description text,
  tags ARRAY,
  state text NOT NULL DEFAULT 'active'::text,
  cover text,
  icon text,
  CONSTRAINT goal_pkey PRIMARY KEY (id),
  CONSTRAINT goal_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.log (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  goal_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL,
  type text,
  content text,
  CONSTRAINT log_pkey PRIMARY KEY (id),
  CONSTRAINT log_goal_id_fkey FOREIGN KEY (goal_id) REFERENCES public.goal(id),
  CONSTRAINT log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);
CREATE TABLE public.tag (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  label text NOT NULL,
  pinned boolean NOT NULL DEFAULT false,
  cover text,
  variant text NOT NULL,
  color text NOT NULL,
  icon text NOT NULL,
  CONSTRAINT tag_pkey PRIMARY KEY (id),
  CONSTRAINT tag_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.user(id)
);