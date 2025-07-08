
// Função simplificada para gerar hash da senha de forma consistente
export const generatePasswordHash = (password: string): string => {
  let hash = 0;
  if (password.length === 0) return hash.toString();
  
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Converter para string hexadecimal positiva e garantir tamanho fixo
  const hexHash = Math.abs(hash).toString(16);
  // Completar com zeros à esquerda para garantir exatamente 8 caracteres
  const paddedHash = hexHash.padStart(8, '0');
  
  return `$2b$10$${paddedHash}`;
};

// Função para verificar se uma senha corresponde ao hash
export const verifyPassword = (password: string, hash: string): boolean => {
  const generatedHash = generatePasswordHash(password);
  console.log(`Verificando senha: "${password}"`);
  console.log(`Hash gerado: "${generatedHash}"`);
  console.log(`Hash armazenado: "${hash}"`);
  console.log(`Match: ${generatedHash === hash}`);
  return generatedHash === hash;
};

// Função para criar usuário admin padrão (apenas desenvolvimento)
export const createDefaultAdminHash = (): string => {
  return generatePasswordHash('admin123');
};
