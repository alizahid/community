CREATE TYPE "public"."MemberRole" AS enum ('member', 'admin');

CREATE sequence "public"."comments_id_seq";

CREATE sequence "public"."communities_id_seq";

CREATE sequence "public"."likes_id_seq";

CREATE sequence "public"."posts_id_seq";

CREATE TABLE "public"."comments" (
    "id" integer NOT NULL DEFAULT nextval('comments_id_seq'::regclass),
    "postId" integer NOT NULL,
    "userId" uuid NOT NULL,
    "content" text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."comments" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."communities" (
    "id" integer NOT NULL DEFAULT nextval('communities_id_seq'::regclass),
    "slug" text NOT NULL,
    "name" text NOT NULL,
    "description" text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."communities" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."likes" (
    "id" integer NOT NULL DEFAULT nextval('likes_id_seq'::regclass),
    "postId" integer NOT NULL,
    "userId" uuid NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."likes" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."members" (
    "communityId" integer NOT NULL,
    "userId" uuid NOT NULL,
    "role" "MemberRole" NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE "public"."posts" (
    "id" integer NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
    "communityId" integer NOT NULL,
    "userId" uuid NOT NULL,
    "content" text NOT NULL,
    "meta" jsonb NOT NULL DEFAULT '{}'::jsonb,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."posts" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."users" (
    "id" uuid NOT NULL,
    "email" text NOT NULL,
    "username" text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."users" enable ROW LEVEL SECURITY;

ALTER sequence "public"."comments_id_seq" owned by "public"."comments"."id";

ALTER sequence "public"."communities_id_seq" owned by "public"."communities"."id";

ALTER sequence "public"."likes_id_seq" owned by "public"."likes"."id";

ALTER sequence "public"."posts_id_seq" owned by "public"."posts"."id";

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

CREATE UNIQUE INDEX communities_slug_key ON public.communities USING btree (slug);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (id);

CREATE UNIQUE INDEX members_pkey ON public.members USING btree ("userId", "communityId");

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_pkey" PRIMARY KEY USING INDEX "comments_pkey";

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_pkey" PRIMARY KEY USING INDEX "communities_pkey";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_pkey" PRIMARY KEY USING INDEX "likes_pkey";

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_pkey" PRIMARY KEY USING INDEX "members_pkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_pkey" PRIMARY KEY USING INDEX "posts_pkey";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_pkey" PRIMARY KEY USING INDEX "users_pkey";

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."comments" validate CONSTRAINT "comments_postId_fkey";

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."comments" validate CONSTRAINT "comments_userId_fkey";

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_slug_key" UNIQUE USING INDEX "communities_slug_key";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."likes" validate CONSTRAINT "likes_postId_fkey";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."likes" validate CONSTRAINT "likes_userId_fkey";

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES communities(id) NOT valid;

ALTER TABLE "public"."members" validate CONSTRAINT "members_communityId_fkey";

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) NOT valid;

ALTER TABLE "public"."members" validate CONSTRAINT "members_userId_fkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_community_fkey" FOREIGN KEY ("communityId") REFERENCES communities(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."posts" validate CONSTRAINT "posts_community_fkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."posts" validate CONSTRAINT "posts_userId_fkey";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_email_key" UNIQUE USING INDEX "users_email_key";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."users" validate CONSTRAINT "users_id_fkey";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_username_key" UNIQUE USING INDEX "users_username_key";

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_post() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $function$ BEGIN
INSERT INTO public.likes ("postId", "userId")
VALUES (new.id, auth.uid());

RETURN new;

END;

$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $function$ BEGIN
INSERT INTO public.users (id, email, username)
VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'username'
    );

RETURN new;

END;

$function$;

CREATE policy "Users can comment on posts" ON "public"."comments" AS permissive FOR
INSERT TO authenticated WITH CHECK (TRUE);

CREATE policy "Users can delete their comments" ON "public"."comments" AS permissive FOR DELETE TO authenticated USING ((auth.uid() = "userId"));

CREATE policy "Users can view all comments" ON "public"."comments" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE policy "Users can view all communities" ON "public"."communities" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE policy "Users can delete their likes" ON "public"."likes" AS permissive FOR DELETE TO authenticated USING ((auth.uid() = "userId"));

CREATE policy "Users can like posts" ON "public"."likes" AS permissive FOR
INSERT TO authenticated WITH CHECK (TRUE);

CREATE policy "Users can view all likes" ON "public"."likes" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE policy "Users can create posts" ON "public"."posts" AS permissive FOR
INSERT TO authenticated WITH CHECK (TRUE);

CREATE policy "Users can delete their posts" ON "public"."posts" AS permissive FOR DELETE TO authenticated USING ((auth.uid() = "userId"));

CREATE policy "Users can view all posts" ON "public"."posts" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE policy "Users can update their profile" ON "public"."users" AS permissive FOR
UPDATE TO authenticated USING ((auth.uid() = id));

CREATE policy "Users can view all profiles" ON "public"."users" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE TRIGGER on_post_created
AFTER
INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION handle_new_post();