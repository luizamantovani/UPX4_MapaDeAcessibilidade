export default function translateSupabaseError(error: any): string {
  if (!error) return 'Erro desconhecido';

  // Supabase may return an Error object or an object with .message or .status
  const msg = (error.message || error.error_description || error.toString()).toString();

  // Map known messages/codes to Portuguese
  const map: { [key: string]: string } = {
    'Invalid login credentials': 'Credenciais inválidas. Verifique email e senha.',
    'Invalid login': 'Credenciais inválidas. Verifique email e senha.',
    'Invalid email or password': 'Email ou senha inválidos.',
    'User already registered': 'Este email já está cadastrado.',
    'User already registered.': 'Este email já está cadastrado.',
    'Password must be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'The password provided is too weak': 'A senha é muito fraca.',
    'Network request failed': 'Falha na conexão de rede. Verifique sua internet.',
  };

  // Try direct map
  if (map[msg]) return map[msg];

  // Check substrings
  const lower = msg.toLowerCase();
  if (lower.includes('invalid')) return 'Dados inválidos. Verifique os campos.';
  if (lower.includes('password')) return 'Problema com a senha. Verifique os requisitos.';
  if (lower.includes('network')) return 'Falha na conexão de rede. Verifique sua internet.';
  if (lower.includes('already registered') || lower.includes('user exists')) return 'Este email já está cadastrado.';

  // Fallback
  return msg;
}
