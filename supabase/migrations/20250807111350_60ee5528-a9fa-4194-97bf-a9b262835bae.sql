-- Primeiro, tentar deletar o usuário se existir (para recriar corretamente)
-- Criar o usuário ADMIN diretamente no banco de dados
DO $$
DECLARE
    admin_user_id UUID;
    hashed_password TEXT;
BEGIN
    -- Gerar um UUID para o usuário ADMIN
    admin_user_id := gen_random_uuid();
    
    -- Hash da senha 'MotoXT1965-2' (usar bcrypt ou similar)
    -- Para Supabase, vamos usar a função nativa de hash
    hashed_password := crypt('MotoXT1965-2', gen_salt('bf'));
    
    -- Inserir ou atualizar o usuário na tabela auth.users
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
        email_change
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
        ''
    )
    ON CONFLICT (email) 
    DO UPDATE SET 
        encrypted_password = hashed_password,
        email_confirmed_at = NOW(),
        updated_at = NOW();
        
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
        jsonb_build_object('sub', admin_user_id::text, 'email', 'admin@sistema.com'),
        'email',
        NOW(),
        NOW(),
        NOW()
    )
    ON CONFLICT (user_id, provider) 
    DO UPDATE SET 
        identity_data = jsonb_build_object('sub', EXCLUDED.user_id::text, 'email', 'admin@sistema.com'),
        updated_at = NOW();
        
END $$;