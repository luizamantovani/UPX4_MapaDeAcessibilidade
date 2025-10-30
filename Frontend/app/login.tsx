import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { supabase } from '../src/utils/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import translateSupabaseError from '../src/utils/translateSupabaseError';
import AlertBox from '../src/components/AlertBox';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState<string | undefined>(undefined);
  const [alertMessage, setAlertMessage] = useState<string | undefined>(undefined);
  const [alertType, setAlertType] = useState<'info'|'success'|'error'>('info');

  const showAlert = (title?: string, message?: string, type: 'info'|'success'|'error' = 'info') => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertType(type);
    setAlertVisible(true);
  };

  const handleAlertClose = () => {
    setAlertVisible(false);
    if (alertType === 'success') {
      router.replace('/');
    }
  };

  const handleLogin = async () => {
    if (!email || !senha) {
      showAlert('Erro', 'Preencha todos os campos.', 'error');
      return;
    }
      try {
        const { error, data } = await supabase.auth.signInWithPassword({
          email: email,
          password: senha,
        });
        if (error) {
            showAlert('Erro', translateSupabaseError(error), 'error');
          return;
        }

        try {
          const user = (data as any)?.user || (data as any)?.data?.user || null;
          if (user && user.id) {
            await AsyncStorage.setItem('user', JSON.stringify({ id: user.id, email }));
          }
        } catch (e) {
          console.warn('Could not persist user locally after login', e);
        }

        showAlert('Sucesso', 'Login realizado!', 'success');
      } catch (e) {
        showAlert('Erro', 'Falha ao realizar o login. Tente novamente.', 'error');
        console.error(e);
      }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Senha</Text>
        <View style={styles.senhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Digite sua senha"
            secureTextEntry={!senhaVisivel}
            onChangeText={setSenha}
            value={senha}
          />
          <TouchableOpacity onPress={() => setSenhaVisivel(!senhaVisivel)}>
            <Ionicons name={senhaVisivel ? 'eye-off' : 'eye'} size={22} color="#555" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>ENTRAR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkCadastro} onPress={() => router.push('/register')}>
        <Text style={styles.textoLinkCadastro}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
      <AlertBox visible={alertVisible} title={alertTitle} message={alertMessage} type={alertType} onClose={handleAlertClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A9F4',
    paddingVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  inputGroup: {
    width: '85%',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 5,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  inputSenha: {
    flex: 1,
    paddingVertical: 10,
  },
  botao: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    width: '85%',
  },
  textoBotao: {
    color: '#00A9F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkCadastro: {
    marginTop: 18,
    alignSelf: 'center',
  },
  textoLinkCadastro: {
    color: '#fff',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
