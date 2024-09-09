import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  ImageBackground,
  StatusBar,
} from "react-native";
import { usePokemon } from "../../src/context/PokemonContext";
import { useRouter } from "expo-router";
import { ThemeContext } from "../../src/context/MyTheme";

const POKEDEX_BG_IMAGE = require("../../assets/Images/pokedex_bg.png");

export default function Favorite() {
  const { pokemonData, favorites, toggleFavorite } = usePokemon();
  const [filteredFavorites, setFilteredFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { theme, toggleTheme } = useContext(ThemeContext); // Access theme and toggleTheme

  useEffect(() => {
    const fetchFavoriteData = () => {
      setLoading(true);
      try {
        const favoritePokemons = pokemonData.filter((pokemon) =>
          favorites.has(pokemon.id)
        );
        console.log("Filtered Favorite Pokémon:", favoritePokemons);

        const uniquePokemons = Array.from(
          new Map(
            favoritePokemons.map((pokemon) => [pokemon.id, pokemon])
          ).values()
        );
        console.log("Unique Pokémon:", uniquePokemons);

        setFilteredFavorites(uniquePokemons);
      } catch (error) {
        console.error("Error filtering favorite Pokémon data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteData();
  }, [favorites, pokemonData]);

  const handlePokemonPress = (id) => {
    console.log(`Navigate to Pokémon details for ID: ${id}`);
    router.push(`/profile/${id}`);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={theme.statusBarText}
          backgroundColor={theme.statusBarBackground}
        />
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (filteredFavorites.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <StatusBar
          barStyle={theme.statusBarText}
          backgroundColor={theme.statusBarBackground}
        />
        <Text style={[styles.title, { color: theme.text }]}>
          No Favorites Yet
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar
        barStyle={theme.statusBarText}
        backgroundColor={theme.statusBarBackground}
      />
      <ImageBackground
        source={POKEDEX_BG_IMAGE}
        resizeMode="cover"
        style={styles.background}
      >
        <Text style={[styles.title]}>Pokédex</Text>

        <FlatList
          data={filteredFavorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const imageUrl = `https://raw.githubusercontent.com/Purukitto/pokemon-data.json/master/images/pokedex/hires/${item.id
              .toString()
              .padStart(3, "0")}.png?${new Date().getTime()}`;
            return (
              <View
                style={[
                  styles.pokemonItem,
                  { backgroundColor: theme.background },
                ]}
              >
                <TouchableOpacity
                  style={styles.pokemonDetails}
                  onPress={() => handlePokemonPress(item.id)}
                >
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.pokemonImage}
                    onError={() =>
                      console.log(`Failed to load image for ID: ${item.id}`)
                    }
                  />
                  <Text style={[styles.pokemonText, { color: theme.text }]}>
                    {item.name.english}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.favoriteButton,
                    favorites.has(item.id) && styles.favoriteButtonActive,
                  ]}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Text style={styles.favoriteButtonText}>
                    {favorites.has(item.id) ? "❤️" : "🤍"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
          contentContainerStyle={styles.flatListContent}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 99,
    marginBottom: 7,
    textAlign: "center",
  },
  flatListContent: {
    paddingBottom: 7,
    paddingTop: 1,
    marginLeft: 10,
    maxWidth: 363,
    paddingLeft: 10,
  },
  pokemonItem: {
    padding: 11,
    marginVertical: 2,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pokemonDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  pokemonImage: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderRadius: 25,
  },
  pokemonText: {
    fontSize: 18,
  },
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  favoriteButtonText: {
    fontSize: 24,
  },
  favoriteButtonActive: {
    color: "red",
  },
  toggleButton: {
    padding: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  toggleButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
