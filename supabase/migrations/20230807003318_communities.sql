CREATE sequence "public"."communities_id_seq";

CREATE TABLE "public"."communities" (
  "id" integer NOT NULL DEFAULT nextval('communities_id_seq'::regclass),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."communities" enable ROW LEVEL SECURITY;

ALTER sequence "public"."communities_id_seq" owned by "public"."communities"."id";

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

CREATE UNIQUE INDEX communities_slug_key ON public.communities USING btree (slug);

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_pkey" PRIMARY KEY USING INDEX "communities_pkey";

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_slug_key" UNIQUE USING INDEX "communities_slug_key";

CREATE policy "Users can view all communities" ON "public"."communities" AS permissive FOR
SELECT TO authenticated USING (TRUE);