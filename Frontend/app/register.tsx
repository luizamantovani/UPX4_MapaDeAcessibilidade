// app/register.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const Register: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Preencha todos os campos");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }

    try {
      setError("");

      // Aqui você poderia enviar o form para o backend.
      // Por enquanto, vamos só salvar no AsyncStorage.
      await AsyncStorage.setItem("user", JSON.stringify(form));

      Alert.alert("Sucesso", "Usuário cadastrado!");

      // Redireciona para a tela principal (Mapa)
      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar cadastro");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar</Text>

      <View style={styles.inputGroup}>
        <Text>Nome</Text>
        <TextInput
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange("name", text)}
          placeholder="Digite seu nome"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={form.email}
          onChangeText={(text) => handleChange("email", text)}
          placeholder="Digite seu email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={form.password}
          onChangeText={(text) => handleChange("password", text)}
          placeholder="Digite sua senha"
          secureTextEntry
        />
      </View>

      <View style={styles.inputGroup}>
        <Text>Confirmar Senha</Text>
        <TextInput
          style={styles.input}
          value={form.confirmPassword}
          onChangeText={(text) => handleChange("confirmPassword", text)}
          placeholder="Confirme sua senha"
          secureTextEntry
        />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Button title="Cadastrar" color="#1976d2" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 400,
    width: "90%",
    alignSelf: "center",
    marginTop: 40,
    padding: 24,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 16,
  },
  input: {
    width: "100%",
    padding: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    backgroundColor: "#f7f7f7",
  },
  error: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default Register;
