import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    width: "80%",
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

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  // Helper functions for validation
  const isEmailValid = (email: string) => {
    // Simple regex for email validation
    return /^\S+@\S+\.\S+$/.test(email);
  };

  const isPasswordValid = (password: string) => {
    // At least 8 characters, contains letters and numbers
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(password);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Nome não pode ser vazio");
      return;
    }
    if (!isEmailValid(form.email)) {
      setError("Email inválido");
      return;
    }
    if (!isPasswordValid(form.password)) {
      setError("A senha deve ter pelo menos 8 caracteres, incluindo letras e números");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Senhas não coincidem");
      return;
    }

    try {
      setError("");
      await AsyncStorage.setItem("user", JSON.stringify(form));
      Alert.alert("Sucesso", "Usuário cadastrado!");
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
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            value={form.password}
            onChangeText={(text) => handleChange("password", text)}
            placeholder="Digite sua senha"
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={{ position: "absolute", right: 10, top: 12 }}
          >
            <MaterialCommunityIcons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#1976d2"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.inputGroup}>
        <Text>Confirmar Senha</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            value={form.confirmPassword}
            onChangeText={(text) => handleChange("confirmPassword", text)}
            placeholder="Confirme sua senha"
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((prev) => !prev)}
            style={{ position: "absolute", right: 10, top: 12 }}
          >
            <MaterialCommunityIcons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#1976d2"
            />
          </TouchableOpacity>
        </View>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Cadastrar" color="#1976d2" onPress={handleSubmit} />
    </View>
  );
};

export default Register;