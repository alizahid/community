CREATE sequence "public"."comments_id_seq";

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

CREATE TABLE "public"."likes" (
  "id" integer NOT NULL DEFAULT nextval('likes_id_seq'::regclass),
  "postId" integer NOT NULL,
  "userId" uuid NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."likes" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."posts" (
  "id" integer NOT NULL DEFAULT nextval('posts_id_seq'::regclass),
  "communityId" integer NOT NULL,
  "userId" uuid NOT NULL,
  "content" text NOT NULL,
  "meta" jsonb NOT NULL DEFAULT '{}'::jsonb,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."posts" enable ROW LEVEL SECURITY;

ALTER sequence "public"."comments_id_seq" owned by "public"."comments"."id";

ALTER sequence "public"."likes_id_seq" owned by "public"."likes"."id";

ALTER sequence "public"."posts_id_seq" owned by "public"."posts"."id";

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX likes_pkey ON public.likes USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_pkey" PRIMARY KEY USING INDEX "comments_pkey";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_pkey" PRIMARY KEY USING INDEX "likes_pkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_pkey" PRIMARY KEY USING INDEX "posts_pkey";

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."comments" validate CONSTRAINT "comments_postId_fkey";

ALTER TABLE "public"."comments"
ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."comments" validate CONSTRAINT "comments_userId_fkey";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES posts(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."likes" validate CONSTRAINT "likes_postId_fkey";

ALTER TABLE "public"."likes"
ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."likes" validate CONSTRAINT "likes_userId_fkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_community_fkey" FOREIGN KEY ("communityId") REFERENCES communities(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."posts" validate CONSTRAINT "posts_community_fkey";

ALTER TABLE "public"."posts"
ADD CONSTRAINT "posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."posts" validate CONSTRAINT "posts_userId_fkey";

SET check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_post() RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $function$ BEGIN
INSERT INTO public.likes ("postId", "userId")
VALUES (new.id, auth.uid());

RETURN new;

END;

$function$;

CREATE policy "Users can comment on posts" ON "public"."comments" AS permissive FOR
INSERT TO authenticated WITH CHECK (TRUE);

CREATE policy "Users can delete their comments" ON "public"."comments" AS permissive FOR DELETE TO authenticated USING ((auth.uid() = "userId"));

CREATE policy "Users can view all comments" ON "public"."comments" AS permissive FOR
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

CREATE TRIGGER on_post_created
AFTER
INSERT ON public.posts FOR EACH ROW EXECUTE FUNCTION handle_new_post();