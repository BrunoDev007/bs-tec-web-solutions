// Script para criar usuário ADMIN
// Execute este código no console do navegador na página de login

const createAdminUser = async () => {
  try {
    // Usando fetch direto para o endpoint de signup
    const response = await fetch('https://nucqjivescevldpunbii.supabase.co/auth/v1/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3FqaXZlc2NldmxkcHVuYmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODM4OTksImV4cCI6MjA2NzY1OTg5OX0.j1Pv2wTQWofIHpEpsjkQJV3w1oX2iPp0AmQPMrwaWNo',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51Y3FqaXZlc2NldmxkcHVuYmlpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODM4OTksImV4cCI6MjA2NzY1OTg5OX0.j1Pv2wTQWofIHpEpsjkQJV3w1oX2iPp0AmQPMrwaWNo'
      },
      body: JSON.stringify({
        email: 'admin@sistema.com',
        password: 'MotoXT1965-2'
      })
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('Usuário ADMIN criado com sucesso:', result);
      alert('Usuário ADMIN criado! Você pode fazer login agora.');
    } else {
      console.error('Erro ao criar usuário:', result);
      if (result.message?.includes('already registered')) {
        alert('Usuário ADMIN já existe. Você pode fazer login.');
      } else {
        alert('Erro: ' + result.message);
      }
    }
  } catch (error) {
    console.error('Erro na requisição:', error);
    alert('Erro ao criar usuário ADMIN');
  }
};

// Execute a função
createAdminUser();