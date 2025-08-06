-- Limpar usuários existentes (apenas em desenvolvimento)
-- ATENÇÃO: Isso remove TODOS os usuários!

-- Limpar tabelas relacionadas primeiro
DELETE FROM public.admin_users;
DELETE FROM public.password_reset_tokens;

-- Inserir usuário ADMIN
-- Nota: O email será admin@sistema.com e a senha MotoXT1965-2
-- O usuário será criado via código após esta migração ser aprovada