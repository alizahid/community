-- enums
-- 
create type member_role as enum ('member', 'admin');

-- tables
-- 
-- users
create table users (
    id uuid not null references auth.users on delete cascade primary key,
    username text not null unique,
    image text,
    created_at timestamp without time zone not null default now()
);

-- communities
create table communities (
    id bigint generated by default as identity primary key,
    slug text not null unique,
    name text not null,
    description text not null,
    image text,
    created_at timestamp without time zone not null default now()
);

-- members
create table members (
    community_id integer not null references communities on delete cascade,
    user_id uuid not null references users on delete cascade,
    role member_role not null,
    created_at timestamp without time zone not null default now(),
    primary key (community_id, user_id)
);

-- posts
create table posts (
    id bigint generated by default as identity primary key,
    community_id integer not null references communities on delete cascade,
    user_id uuid not null references users on delete cascade,
    content text not null,
    meta jsonb not null default '{}'::jsonb,
    created_at timestamp without time zone not null default now()
);

-- comments
create table comments (
    id bigint generated by default as identity primary key,
    post_id integer not null references posts on delete cascade,
    user_id uuid not null references users on delete cascade,
    content text not null,
    created_at timestamp without time zone not null default now()
);

-- likes
create table likes (
    id bigint generated by default as identity primary key,
    post_id integer not null references posts on delete cascade,
    user_id uuid not null references users on delete cascade,
    created_at timestamp without time zone not null default now()
);

-- indices
-- 
-- posts
create index index_posts_community on posts(community_id);

create index index_posts_user on posts(user_id);

-- comments
create index index_comments_post on comments(post_id);

create index index_comments_user on comments(user_id);

-- likes
create index index_likes_post_user on likes(post_id, user_id);

-- rls
-- 
-- users
alter table users enable row level security;

create policy "Users can view all profiles" on users as permissive for
select to authenticated using (true);

create policy "Users can create their profile" on users as permissive for
insert to authenticated with check ((auth.uid() = id));

create policy "Users can update their profile" on users as permissive for
update to authenticated using ((auth.uid() = id));

-- communities
alter table communities enable row level security;

create policy "Users can view all communities" on communities as permissive for
select to authenticated using (true);

create policy "Users can create communities" on communities as permissive for
insert to authenticated with check (true);

-- members
alter table members enable row level security;

create policy "Users can view all members" on members as permissive for
select to authenticated using (true);

create policy "Users can join communities" on members as permissive for
insert to authenticated with check ((auth.uid() = user_id));

create policy "Users can leave communities" on members as permissive for delete to authenticated using ((auth.uid() = user_id));

-- posts
alter table posts enable row level security;

create policy "Users can view all posts" on posts as permissive for
select to authenticated using (true);

create policy "Users can create posts" on posts as permissive for
insert to authenticated with check (true);

create policy "Users can delete their posts" on posts as permissive for delete to authenticated using ((auth.uid() = user_id));

-- comments
alter table comments enable row level security;

create policy "Users can view all comments" on comments as permissive for
select to authenticated using (true);

create policy "Users can comment on posts" on comments as permissive for
insert to authenticated with check (true);

create policy "Users can delete their comments" on comments as permissive for delete to authenticated using ((auth.uid() = user_id));

-- likes
alter table likes enable row level security;

create policy "Users can view all likes" on likes as permissive for
select to authenticated using (true);

create policy "Users can like posts" on likes as permissive for
insert to authenticated with check (true);

create policy "Users can delete their likes" on likes as permissive for delete to authenticated using ((auth.uid() = user_id));

-- functions
-- 
-- handle_new_user
create or replace function handle_new_user() returns trigger LANGUAGE plpgsql security definer as $function$ begin
insert into public.users (id, username)
values (
        new.id,
        new.raw_user_meta_data->>'username'
    );

return new;

end;

$function$;

-- handle_new_community
create or replace function handle_new_community() returns trigger LANGUAGE plpgsql security definer as $function$ begin
insert into members (community_id, user_id, role)
values (new.id, auth.uid(), 'admin');

return new;

end;

$function$;

-- handle_new_post
create or replace function handle_new_post() returns trigger LANGUAGE plpgsql security definer as $function$ begin
insert into likes (post_id, user_id)
values (new.id, auth.uid());

return new;

end;

$function$;

-- triggers
-- 
-- on_user_created
create trigger on_user_created
after
insert on auth.users for each row execute procedure handle_new_user();

-- on_community_created
create trigger on_community_created
after
insert on communities for each row execute procedure handle_new_community();

-- on_post_created
create trigger on_post_created
after
insert on posts for EACH row execute function handle_new_post();

-- search
-- 
-- communities
alter table communities
add column search tsvector generated always as (
        to_tsvector('english', name || ' ' || description)
    ) stored;

create index index_communities_search on communities using gin (search);

-- posts
alter table posts
add column search tsvector generated always as (to_tsvector('english', content)) stored;

create index index_posts_search on posts using gin (search);