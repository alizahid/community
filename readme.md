![Community](./src/assets/images/community.png)

# Community

Community is my entry for the [Supabase Launch Week 8 hackathon](https://supabase.com/blog/supabase-lw8-hackathon).

It's a [Reddit](https://reddit.com/) style app with communities and posts. It supports both light and dark mode.

It has the following features;

- Feeds (personalized feed, community posts, user posts)
- Communities
- User
- Posts with image attachments (you can create and delete)
- Comments (you can create and delete)
- Search (full text search)

## Demo

Here's a video you can view; [Link](https://drive.google.com/file/d/1V-hASlYZmArZQVHtRNSUOzPUOJ7aUVZO/view?usp=sharing)

## How to run

### 1. Clone this repo with `git clone https://github.com/alizahid/community.git`

### 2. Install dependencies with Yarn `yarn`

### 3. Setup local Supabase project

```bash
supabase init
supabase start
supabase db reset
```

### 4. Setup .env files

There's two .env files; `.env` and `.env.local`

`.env` is purely for the seed script and `.env.local` is for the Expo app.

#### `.env`

For `.env`, you need to define the following variables;

```
DATABASE_URL=
UNSPLASH_KEY=
```

You can get `DATABASE_URL` from `supabase status` and `UNSPLASH_KEY` from [Unsplash](https://unsplash.com/developers).

#### `.env.local`

For `.env.local`, you need to define the following two variables. You can get these from `supabase status`.

```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_KEY=
```

### 4. Seed some data

> You can skip this part but then you'll be greeted by an empty app

Run the seed script with `yarn seed` once you've setup `.env`.

### 5. Start up

Start up the app with `yarn dev` and enjoy!

## Tech

Community is written in [TypeScript](https://www.typescriptlang.org) and built with [Expo](https://expo.dev) and [Supabase](https://supabase.com) and styled with [Tailwind CSS](https://tailwindcss.com).

### Supabase

- [x] Auth
- [x] Database
- [x] Storage
- [x] Postgres functions and triggers
- [x] Full text search

## Team

| Name                              | GitHub                                  | Twitter                                    |
| --------------------------------- | --------------------------------------- | ------------------------------------------ |
| [Ali Zahid](https://alizahid.dev) | [alizahid](https://github.com/alizahid) | [alizahid0](https://twitter.com/alizahid0) |
