import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useSearchParams } from "expo-router";

export default function PokemonProfile() {
  const { id } = useSearchParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemon = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://192.168.100.9:9090/pokemon/${id}`);
        if (!response.ok) {
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        }
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokémon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (!pokemon) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Pokémon not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={{ uri: pokemon.image.hires }}
          style={styles.pokemonImage}
        />
        <Text style={styles.pokemonName}>{pokemon.name.english}</Text>
        <Text style={styles.pokemonType}>Type: {pokemon.type.join(", ")}</Text>
        {/* Add more Pokémon details here */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  scrollContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pokemonImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  pokemonType: {
    fontSize: 18,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
