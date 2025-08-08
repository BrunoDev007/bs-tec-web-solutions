import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verificar se o usuário já existe
    const { data: existingUsers } = await supabaseClient.auth.admin.listUsers()
    const adminExists = existingUsers.users.find(user => user.email === 'admin@sistema.com')
    
    if (adminExists) {
      // Se existe, atualizar senha para garantir que está correta
      const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
        adminExists.id,
        { 
          password: 'MotoXT1965-2',
          email_confirm: true
        }
      )
      
      if (updateError) {
        console.error('Erro ao atualizar senha do ADMIN:', updateError)
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Usuário ADMIN já existe e senha foi atualizada',
          user_id: adminExists.id
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar usuário ADMIN se não existe
    const { data, error } = await supabaseClient.auth.admin.createUser({
      email: 'admin@sistema.com',
      password: 'MotoXT1965-2',
      email_confirm: true
    })

    if (error) {
      console.error('Erro ao criar usuário ADMIN:', error)
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error.message,
          message: 'Erro ao criar usuário ADMIN' 
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data, 
        message: 'Usuário ADMIN criado com sucesso',
        user_id: data.user?.id
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})