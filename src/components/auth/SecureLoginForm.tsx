import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSecureAuth } from '@/hooks/useSecureAuth';
import { validatePasswordStrength } from '@/utils/securePasswordUtils';

const SecureLoginForm = () => {
  const { signIn, signUp, resetPassword, loading } = useSecureAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErrors([]);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    if (!formData.email || !formData.password) {
      setErrors(['Please fill in all fields']);
      setIsLoading(false);
      return;
    }

    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      setErrors([error.message || 'Sign in failed']);
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setErrors(['Please fill in all fields']);
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(['Passwords do not match']);
      setIsLoading(false);
      return;
    }

    const passwordValidation = validatePasswordStrength(formData.password);
    if (!passwordValidation.isValid) {
      setErrors(passwordValidation.errors);
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password);
    
    if (error) {
      setErrors([error.message || 'Sign up failed']);
    }
    
    setIsLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);

    if (!formData.email) {
      setErrors(['Please enter your email address']);
      setIsLoading(false);
      return;
    }

    const { error } = await resetPassword(formData.email);
    
    if (error) {
      setErrors([error.message || 'Password reset failed']);
    } else {
      setShowResetPassword(false);
    }
    
    setIsLoading(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (showResetPassword) {
    return (
      <div className="space-y-6 p-6">
        <h2 className="text-lg font-semibold text-center text-gray-900">Recuperar Senha</h2>
        {errors.length > 0 && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Enviando...' : 'Enviar'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 text-gray-600 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setShowResetPassword(false)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="space-y-6 p-6">
        <h2 className="text-lg font-semibold text-center text-gray-900">Login Administrativo</h2>
        {errors.length > 0 && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {errors.map((error, index) => (
              <p key={index}>{error}</p>
            ))}
          </div>
        )}
        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
              Usuário
            </Label>
            <Input
              id="username"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
              Senha
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-md hover:bg-blue-600 transition-colors font-medium"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1 text-gray-600 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
              onClick={() => setShowResetPassword(true)}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SecureLoginForm;