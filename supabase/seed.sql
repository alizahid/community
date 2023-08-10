CREATE OR REPLACE FUNCTION public.create_user(email text, "password" text, username text) RETURNS uuid AS $$
DECLARE user_id uuid;

encrypted_pw text;

BEGIN user_id := gen_random_uuid();

encrypted_pw := crypt("password", gen_salt('bf'));

INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    )
VALUES (
        '00000000-0000-0000-0000-000000000000',
        user_id,
        'authenticated',
        'authenticated',
        email,
        encrypted_pw,
        NOW(),
        NOW(),
        NOW(),
        '{"provider":"email","providers":["email"]}',
        json_build_object('username', username),
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    );

INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    )
VALUES (
        gen_random_uuid(),
        user_id,
        format(
            '{"sub":"%s","email":"%s"}',
            user_id::text,
            email
        )::jsonb,
        'email',
        NOW(),
        NOW(),
        NOW()
    );

RETURN user_id;

END;

$$ LANGUAGE plpgsql;