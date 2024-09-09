import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TextInput,
  Button,
  ImageBackground,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../src/context/AuthContext";

const POKEDEX_BG_IMAGE = require("../assets/Images/pokedex_bg.png");

const Login = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const HARDCODED_PASSWORD = "1";

  const { setIsLoggedIn } = useAuth();

  const handleLogin = () => {
    if (password === HARDCODED_PASSWORD) {
      setIsLoggedIn(true);
      setError("");
      router.push("/(tabs)");
    } else {
      setError("Incorrect Password");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={POKEDEX_BG_IMAGE}
        resizeMode="cover"
        style={styles.background}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View>
            <Text style={styles.title}>Pokédex Login</Text>
            <TextInput
              placeholder="Enter Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: 250,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});

export default Login;
