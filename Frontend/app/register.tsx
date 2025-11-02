// register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_700Bold, Nunito_600SemiBold, Nunito_300Light } from '@expo-google-fonts/nunito';
import { useRouter } from 'expo-router'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { createClient } from '@supabase/supabase-js';
import translateSupabaseError from '../src/utils/translateSupabaseError';
import AlertBox from '../src/components/AlertBox';
import { theme } from '../src/styles/theme';

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

  // alert personalizado
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

  const handleRegister = async () => {
    if (!nome || !email || !senha || !confirmarSenha) {
      showAlert('Erro', 'Preencha todos os campos.', 'error');
      return;
    }
    if (senha !== confirmarSenha) {
      showAlert('Erro', 'As senhas não coincidem.', 'error');
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
        showAlert('Erro', translateSupabaseError(error), 'error');
        return;
      }
  
  const userObj: any = { name: nome, email: email };
  if ((data as any)?.user?.id) userObj.id = (data as any).user.id;
  await AsyncStorage.setItem('user', JSON.stringify(userObj));
      showAlert('Sucesso', 'Cadastro realizado! Verifique seu email para confirmar.', 'success');
    } catch (e) {
      showAlert('Erro', 'Falha ao realizar o cadastro. Tente novamente.', 'error');
      console.error(e);
    }
  };


  if (!fontsLoaded) return null;

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
      <AlertBox visible={alertVisible} title={alertTitle} message={alertMessage} type={alertType} onClose={handleAlertClose} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 8,
    marginTop: 8,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: theme.fontSizes.md,
    fontFamily: theme.fonts.bold,
    marginBottom: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontFamily: theme.fonts.regular,
    marginBottom: theme.spacing.sm,
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  inputSenha: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontFamily: theme.fonts.regular,
  },
  botao: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  textoBotao: {
    color: '#fff',
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.semibold,
  },
  textoLinkCadastro: {
    color: theme.colors.primary,
    marginTop: theme.spacing.lg,
  },
});