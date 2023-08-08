CREATE TABLE "public"."users" (
  "id" uuid NOT NULL,
  "email" text NOT NULL,
  "username" text NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."users" enable ROW LEVEL SECURITY;

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_pkey" PRIMARY KEY USING INDEX "users_pkey";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_email_key" UNIQUE USING INDEX "users_email_key";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."users" validate CONSTRAINT "users_id_fkey";

ALTER TABLE "public"."users"
ADD CONSTRAINT "users_username_key" UNIQUE USING INDEX "users_username_key";

SET check_function_bodies = off;

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

CREATE policy "Users can update their profile" ON "public"."users" AS permissive FOR
UPDATE TO authenticated USING ((auth.uid() = id));

CREATE policy "Users can view all profiles" ON "public"."users" AS permissive FOR
SELECT TO authenticated USING (TRUE);

CREATE TRIGGER on_user_created
AFTER
INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();