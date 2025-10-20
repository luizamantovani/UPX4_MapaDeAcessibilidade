export default function translateSupabaseError(error: any): string {
  if (!error) return 'Erro desconhecido';

  // Attempt to extract a useful message from various possible shapes
  let msg = '';
  try {
    if (typeof error === 'string') msg = error;
    else if (error.message) msg = error.message;
    else if (error.error_description) msg = error.error_description;
    else if (error.error && typeof error.error === 'string') msg = error.error;
    else if (error.msg) msg = error.msg;
    else if (error.status && error.status === 0) msg = 'Network request failed';
    else msg = JSON.stringify(error);
  } catch (e) {
    msg = String(error);
  }

  msg = String(msg || 'Erro desconhecido');

  const map: { [key: string]: string } = {
    'Invalid login credentials': 'Credenciais inválidas. Verifique email e senha.',
    'Invalid login': 'Credenciais inválidas. Verifique email e senha.',
    'Invalid email or password': 'Email ou senha inválidos.',
    'User already registered': 'Este email já está cadastrado.',
    'User already registered.': 'Este email já está cadastrado.',
    'Password must be at least 8 characters': 'A senha deve ter pelo menos 8 caracteres.',
    'Password must be at least 6 characters': 'A senha deve ter pelo menos 6 caracteres.',
    'The password provided is too weak': 'A senha é muito fraca.',
    'Network request failed': 'Falha na conexão de rede. Verifique sua internet.',
    'duplicate key value violates unique constraint': 'Este email já está cadastrado.',
    'unique_violation': 'Este email já está cadastrado.',
    'user not found': 'Usuário não encontrado.',
    'jwt expired': 'Sessão expirada. Faça login novamente.',
    'invalid or expired token': 'Token inválido ou expirado. Faça login novamente.',
    'Invalid email': 'Email inválido.',
    'Invalid email address': 'Email inválido.',
    'Email not confirmed': 'Email não confirmado. Verifique sua caixa de entrada.',
  };

  // Direct match
  if (map[msg]) return map[msg];

  const lower = msg.toLowerCase();

  // Substring matches for broader coverage
  if (lower.includes('invalid') && lower.includes('email')) return 'Email inválido.';
  if (lower.includes('invalid') && lower.includes('password')) return 'Senha inválida. Verifique os requisitos.';
  if (lower.includes('password') && lower.includes('8')) return 'A senha deve ter pelo menos 8 caracteres.';
  if (lower.includes('duplicate') || lower.includes('unique_violation') || lower.includes('already registered')) return 'Este email já está cadastrado.';
  if (lower.includes('user') && lower.includes('not')) return 'Usuário não encontrado.';
  if (lower.includes('jwt') || lower.includes('token')) return 'Token inválido ou expirado. Faça login novamente.';
  if (lower.includes('network')) return 'Falha na conexão de rede. Verifique sua internet.';

  // Fallback: return original message (trimmed)
  return msg.length > 0 ? msg : 'Erro desconhecido';
}
