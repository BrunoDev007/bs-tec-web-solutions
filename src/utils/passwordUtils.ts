
// Função simplificada para gerar hash da senha de forma consistente
export const generatePasswordHash = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Converter para string hexadecimal e garantir tamanho fixo
  const hexHash = Math.abs(hash).toString(16);
  // Completar com zeros à esquerda para garantir 22 caracteres
  const paddedHash = hexHash.padStart(22, '0').substring(0, 22);
  
  return `$2b$10$${paddedHash}`;
};
