// register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_700Bold, Nunito_600SemiBold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);


const MyWayLogo = require('../assets/images/imagem_inicio.png'); 

export default function RegisterScreen() {
  const router = useRouter(); 
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_600SemiBold,
    Nunito_300Light,
  });

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    try {
      // Supabase signup
      const { error, data } = await supabase.auth.signUp({
        email: email,
        password: senha,
        options: {
          data: { name: nome }
        }
      });
      if (error) {
        Alert.alert('Erro', error.message);
        return;
      }
      // Optionally save user locally
      await AsyncStorage.setItem('user', JSON.stringify({ name: nome, email: email }));
      Alert.alert('Sucesso', 'Cadastro realizado! Verifique seu email para confirmar.');
      router.replace('/');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao realizar o cadastro. Tente novamente.');
      console.error(e);
    }
  };


  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Logo */}
      <Image source={MyWayLogo} style={styles.logo} />
      
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu nome" 
          onChangeText={setNome} 
          value={nome} 
        />
        
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail} 
          value={email} 
        />
        
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
        
        <Text style={styles.label}>Confirmar Senha</Text>
        <View style={styles.senhaContainer}>
          <TextInput
            style={styles.inputSenha}
            placeholder="Confirme sua senha"
            secureTextEntry={!confirmarSenhaVisivel}
            onChangeText={setConfirmarSenha} 
            value={confirmarSenha}
          />
          <TouchableOpacity onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)}>
            <Ionicons name={confirmarSenhaVisivel ? 'eye-off' : 'eye'} size={22} color="#555" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.botao} onPress={handleRegister}>
          <Text style={styles.textoBotao}>CADASTRAR</Text>
        </TouchableOpacity>
        <Text style={styles.textoLinkCadastro} onPress={() => router.push('/login')}>
          Já tem uma conta? Faça login
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A9F4', 
    paddingVertical: 10, 
  },
  logo: {
    width: 600, 
    height: 600, 
    resizeMode: 'contain',
    marginBottom: -170, 
    marginTop: -170,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 14,

    fontFamily: 'Nunito_700Bold', 
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    padding: 10,
    fontFamily: 'Nunito_300Light',
    marginBottom: 5, // Pequeno ajuste para espaçamento
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 5, // Pequeno ajuste para espaçamento
  },
  inputSenha: {
    flex: 1,
    paddingVertical: 10,
    fontFamily: 'Nunito_300Light',
  },
  botao: {
    backgroundColor: '#00A9F4', 
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  textoLinkCadastro: {
    color: '#00A9F4',
    marginTop: 18,
  },
});