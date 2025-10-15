import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your Supabase project credentials
const supabaseUrl = 'https://jkzhukadywupkudgnkvh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impremh1a2FkeXd1cGt1ZGdua3ZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MDE2NTYsImV4cCI6MjA3NjA3NzY1Nn0.5Ldwo2_dOn6d19PfAj7YfCjhoRnpZQKmPm--Dmc-W2M';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    try {
      const { error, data } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });
      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }
      Alert.alert('Sucesso', 'Login realizado!');
      router.replace('/');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao realizar o login. Tente novamente.');
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
