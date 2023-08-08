CREATE TYPE "public"."MemberRole" AS enum ('member', 'admin');

CREATE sequence "public"."communities_id_seq";

CREATE sequence "public"."members_id_seq";

CREATE TABLE "public"."communities" (
  "id" integer NOT NULL DEFAULT nextval('communities_id_seq'::regclass),
  "slug" text NOT NULL,
  "name" text NOT NULL,
  "description" text NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."communities" enable ROW LEVEL SECURITY;

CREATE TABLE "public"."members" (
  "id" integer NOT NULL DEFAULT nextval('members_id_seq'::regclass),
  "communityId" integer NOT NULL,
  "userId" uuid NOT NULL,
  "role" "MemberRole" NOT NULL,
  "createdAt" timestamp without time zone NOT NULL DEFAULT NOW()
);

ALTER TABLE "public"."members" enable ROW LEVEL SECURITY;

ALTER sequence "public"."communities_id_seq" owned by "public"."communities"."id";

ALTER sequence "public"."members_id_seq" owned by "public"."members"."id";

CREATE UNIQUE INDEX communities_pkey ON public.communities USING btree (id);

CREATE UNIQUE INDEX communities_slug_key ON public.communities USING btree (slug);

CREATE UNIQUE INDEX members_pkey ON public.members USING btree (id);

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_pkey" PRIMARY KEY USING INDEX "communities_pkey";

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_pkey" PRIMARY KEY USING INDEX "members_pkey";

ALTER TABLE "public"."communities"
ADD CONSTRAINT "communities_slug_key" UNIQUE USING INDEX "communities_slug_key";

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES communities(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."members" validate CONSTRAINT "members_communityId_fkey";

CREATE policy "Users can view all communities" ON "public"."communities" AS permissive FOR
SELECT TO authenticated USING (TRUE);

ALTER TABLE "public"."members"
ADD CONSTRAINT "members_userId_fkey" FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE NOT valid;

ALTER TABLE "public"."members" validate CONSTRAINT "members_userId_fkey";