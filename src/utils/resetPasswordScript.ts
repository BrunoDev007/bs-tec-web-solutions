import { supabase } from '@/integrations/supabase/client';

// Script para executar reset de senha
const executePasswordReset = async () => {
  try {
    const redirectUrl = `${window.location.origin}/#/reset-password`;
    
    const { error } = await supabase.auth.resetPasswordForEmail('bs.suporte.tec@gmail.com', {
      redirectTo: redirectUrl,
    });
    
    if (error) {
      console.error('Reset password error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Password reset email sent successfully!');
    return { success: true, message: 'Password reset email sent!' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { success: false, error: error.message };
  }
};

// Execute the reset
executePasswordReset().then(result => {
  console.log('Reset result:', result);
});

export { executePasswordReset };