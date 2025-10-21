import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// -----------------------------------------------------------------------------
// Supabase client e helpers
// -----------------------------------------------------------------------------
// Instruções rápidas:
// 1) Adicione suas chaves em um arquivo .env e exponha via app.config.js (expo) como:
//    extra: { SUPABASE_URL: process.env.SUPABASE_URL, SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY }
//    Ou use react-native-dotenv / expo-env conforme sua preferência.
// 2) Reinicie o Metro bundler para garantir que as variáveis sejam recarregadas.
// 3) Exemplo de uso:
//    import { supabase, signInWithEmail } from '../services/supabase';
//    await signInWithEmail('email@example.com', 'senha');
// -----------------------------------------------------------------------------

const SUPABASE_URL =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  // expo SDK 48+ usa expoConfig / Constants.expoConfig
  (Constants.expoConfig && (Constants.expoConfig as any).extra?.SUPABASE_URL) ||
  '';

const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_KEY ||
  (Constants.expoConfig && (Constants.expoConfig as any).extra?.SUPABASE_ANON_KEY) ||
  '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Não lançar erro automaticamente para não quebrar builds de preview,
  // mas registrar para facilitar debugging.
  // Você pode trocar por um throw se preferir falhar rápido.
  // Ex: throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY');
  // console.warn('Supabase: missing URL or ANON KEY');
}

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  // Persistir sessão no AsyncStorage em React Native / Expo
  auth: { storage: AsyncStorage },
});

// Autenticação básica
export async function signUpWithEmail(email: string, password: string) {
  const response = await supabase.auth.signUp({ email, password });
  return response; // { data, error }
}

export async function signInWithEmail(email: string, password: string) {
  const response = await supabase.auth.signInWithPassword({ email, password });
  return response; // { data, error }
}

export async function signOut() {
  const response = await supabase.auth.signOut();
  return response; // { error }
}

export async function getUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      // Se o erro for sessão ausente, retornar null silenciosamente
      // para evitar poluir logs em cenários onde o usuário não está logado.
      // Outros erros ainda são lançados.
      const message = (error as any)?.message || '';
      if (message.includes('Auth session missing') || message.includes('No active session')) {
        return null;
      }
      throw error;
    }
    return data?.user || null;
  } catch (err) {
    // Caso o SDK lance uma instância específica (ex: AuthSessionMissingError),
    // tratamos aqui também e retornamos null.
    const msg = (err as any)?.message || '';
    if (msg.includes('Auth session missing') || msg.includes('No active session')) {
      return null;
    }
    throw err;
  }
}

// Upload de imagem (uri -> blob -> storage)
export async function uploadImage({
  fileUri,
  bucket = 'images',
  path,
  upsert = false,
}: {
  fileUri: string;
  bucket?: string;
  path: string; // caminho destino, ex: `pins/123/photo.jpg`
  upsert?: boolean;
}) {
  // Primeiro, tentar o fluxo padrão: fetch(fileUri) -> blob -> upload
  try {
    const response = await fetch(fileUri);
    const blob = await response.blob();

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, blob, { upsert });

    if (error) throw error;
    return data; // { Key }
  } catch (originalError) {
    // Fallback para React Native/Expo: ler como base64 e enviar via REST PUT
    // (resolve problemas de `fetch(fileUri)` ou blobs em alguns ambientes)
    try {
      const b64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });

      // converte base64 para Uint8Array sem depender de atob
      const b64ToUint8Array = (b64String: string) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        const lookup = new Uint8Array(256);
        for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

        const len = b64String.length;
        if (len % 4 !== 0) throw new Error('Invalid base64 string');
        const placeHolders = b64String.endsWith('==') ? 2 : b64String.endsWith('=') ? 1 : 0;
        const bytes = (len * 3) / 4 - placeHolders;
        const u8 = new Uint8Array(bytes);

        let curByte = 0;
        for (let i = 0; i < len; i += 4) {
          const tmp = (lookup[b64String.charCodeAt(i)] << 18) | (lookup[b64String.charCodeAt(i + 1)] << 12) |
            (lookup[b64String.charCodeAt(i + 2)] << 6) | lookup[b64String.charCodeAt(i + 3)];
          if (curByte < bytes) u8[curByte++] = (tmp >> 16) & 0xFF;
          if (curByte < bytes) u8[curByte++] = (tmp >> 8) & 0xFF;
          if (curByte < bytes) u8[curByte++] = tmp & 0xFF;
        }
        return u8;
      };

      const bytes = b64ToUint8Array(b64);

      const url = `${SUPABASE_URL.replace(/\/$/, '')}/storage/v1/object/${bucket}/${path}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/octet-stream',
        },
        body: bytes as any,
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Upload failed: ${res.status} ${res.statusText} - ${text}`);
      }

      // Retornar formato similar ao supabase.storage.upload
      return { Key: path } as any;
    } catch (fallbackError) {
      // Ambos falharam: propagar o erro original para ajudar no diagnóstico
      // (podemos priorizar o fallbackError, mas manter o original também é útil)
      (originalError as any).fallback = fallbackError;
      throw originalError;
    }
  }
}

export function getPublicUrl(bucket: string, path: string) {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

// Pequeno helper para obter a URL pública de um arquivo e, opcionalmente,
// verificar se existe.
export async function getDownloadUrl(bucket: string, path: string) {
  // Observação: se o bucket for privado, será necessário usar supabase.storage.createSignedUrl
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
}

export default supabase;
