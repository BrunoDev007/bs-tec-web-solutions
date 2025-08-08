-- Forçar criação do usuário ADMIN diretamente
DO $$
DECLARE
    admin_user_id UUID := '00000000-0000-0000-0000-000000000001';
    hashed_password TEXT;
BEGIN
    -- Deletar usuário existente se houver
    DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin@sistema.com');
    DELETE FROM auth.users WHERE email = 'admin@sistema.com';
    
    -- Criar hash da senha usando a extensão pgcrypto
    SELECT crypt('MotoXT1965-2', gen_salt('bf')) INTO hashed_password;
    
    -- Inserir usuário na tabela auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        created_at,
        updated_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        aud,
        role
    ) VALUES (
        admin_user_id,
        '00000000-0000-0000-0000-000000000000',
        'admin@sistema.com',
        hashed_password,
        NOW(),
        NOW(),
        NOW(),
        '',
        '',
        '',
        '',
        'authenticated',
        'authenticated'
    );
        
    -- Inserir na tabela auth.identities
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        admin_user_id,
        jsonb_build_object(
            'sub', admin_user_id::text, 
            'email', 'admin@sistema.com',
            'email_verified', true,
            'phone_verified', false
        ),
        'email',
        NOW(),
        NOW(),
        NOW()
    );
        
    RAISE NOTICE 'Usuário ADMIN criado com sucesso: %', admin_user_id;
        
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Erro ao criar usuário ADMIN: %', SQLERRM;
END $$;