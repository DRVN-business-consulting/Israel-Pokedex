import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { useRouter } from "expo-router";
import { usePokemon } from "../../src/context/PokemonContext";
import { ThemeContext } from "../../src/context/MyTheme";

const POKEDEX_BG_IMAGE = require("../../assets/Images/pokedex_bg.png");

export default function AllPokemon() {
  const { pokemonData, setPokemonData, favorites, toggleFavorite } =
    usePokemon();
  const { theme } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("");
  const [filteredPokemon, setFilteredPokemon] = useState([]);
  const flatListRef = useRef(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [pokemonDetails, setPokemonDetails] = useState(null);
  const router = useRouter();

  const fetchAllPokemon = async (page) => {
    const limit = 5;
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const response = await fetch(
        `https://pokemon-api-nssw.onrender.com/pokemon?page=${page}&limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);

      if (Array.isArray(data)) {
        if (data.length < limit) {
          setHasMore(false);
        }
        setPokemonData((prevData) => {
          const uniqueData = [
            ...prevData,
            ...data.filter(
              (item) => !prevData.some((prevItem) => prevItem.id === item.id)
            ),
          ];
          return uniqueData;
        });
      } else {
        console.error("Fetched data is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPokemon(page);
  }, [page]);

  useEffect(() => {
    if (selectedType === "Null") {
      setFilteredPokemon(
        pokemonData.filter(
          (pokemon) => !pokemon.type || pokemon.type.includes("Null")
        )
      );
    } else if (selectedType) {
      setFilteredPokemon(
        pokemonData.filter((pokemon) => pokemon.type.includes(selectedType))
      );
    } else {
      setFilteredPokemon(pokemonData);
    }
  }, [selectedType, pokemonData]);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading, hasMore]);

  const handlePokemonPress = async (id) => {
    try {
      const response = await fetch(
        `https://pokemon-api-nssw.onrender.com/pokemon/${id}`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Fetched Pokémon details:", data);

      setPokemonDetails(data);
      router.push(`/profile/${id}`);
    } catch (error) {
      console.error("Error fetching Pokémon details:", error);
    }
  };

  // Helper function to get type color
  const getTypeColor = (type) => {
    const typeColors = {
      Normal: "#A8A77A",
      Fire: "#EE8130",
      Water: "#6390F0",
      Grass: "#7AC74C",
      Electric: "#F7D02C",
      Ice: "#96D9D6",
      Fighting: "#C22E28",
      Poison: "#A33EA1",
      Ground: "#E2BF65",
      Flying: "#A98FF3",
      Psychic: "#F95587",
      Bug: "#A6B91A",
      Rock: "#B6A136",
      Ghost: "#735797",
      Dark: "#705746",
      Dragon: "#6F35FC",
      Steel: "#B7B7CE",
      Fairy: "#D685AD",
    };

    return typeColors[type] || theme.text; // Default to theme text color if type not found
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ImageBackground
        source={POKEDEX_BG_IMAGE}
        resizeMode="cover"
        style={styles.background}
      >
        <RNPickerSelect
          onValueChange={(value) => setSelectedType(value)}
          items={[
            { label: "Normal", value: "Normal" },
            { label: "Fire", value: "Fire" },
            { label: "Water", value: "Water" },
            { label: "Grass", value: "Grass" },
            { label: "Electric", value: "Electric" },
            { label: "Ice", value: "Ice" },
            { label: "Fighting", value: "Fighting" },
            { label: "Poison", value: "Poison" },
            { label: "Ground", value: "Ground" },
            { label: "Flying", value: "Flying" },
            { label: "Psychic", value: "Psychic" },
            { label: "Bug", value: "Bug" },
            { label: "Rock", value: "Rock" },
            { label: "Ghost", value: "Ghost" },
            { label: "Dark", value: "Dark" },
            { label: "Dragon", value: "Dragon" },
            { label: "Steel", value: "Steel" },
            { label: "Fairy", value: "Fairy" },
          ]}
          style={{
            inputIOS: {
              marginLeft: 10,
              fontSize: 24,
              fontWeight: "bold",
              color: theme.text,
            },
            inputAndroid: {
              marginLeft: 10,
              fontSize: 24,
              fontWeight: "bold",
              color: theme.text,
            },
          }}
          placeholder={{ label: "Select Type", value: null }}
        />
        <View style={styles.pokedexContainer}>
          <Text style={[styles.title]}>Pokédex</Text>

          {loading && page === 1 ? (
            <ActivityIndicator size="large" color={theme.text} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={filteredPokemon}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={({ item }) => (
                <View
                  key={`${item.id}-${item.name.english}`}
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
                      source={{ uri: item.image.hires }}
                      style={styles.pokemonImage}
                    />
                    <Text style={[styles.pokemonText, { color: theme.text }]}>
                      {item.name.english}
                    </Text>
                    <Text
                      style={[
                        styles.pokemonType,
                        { color: getTypeColor(item.type[0]) },
                      ]}
                    >
                      {item.type.join(", ")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.favoriteButton,
                      favorites.has(item.id) && styles.favoriteButtonActive,
                    ]}
                    onPress={() => toggleFavorite(item.id)}
                  >
                    <Text
                      style={[
                        styles.favoriteButtonText,
                        { color: favorites.has(item.id) ? "red" : theme.text },
                      ]}
                    >
                      {favorites.has(item.id) ? "❤️" : "🤍"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              contentContainerStyle={[
                styles.flatListContent,
                { paddingTop: 0 },
              ]}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                loading && hasMore ? (
                  <ActivityIndicator size="small" color={theme.text} />
                ) : null
              }
            />
          )}
        </View>
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
    marginTop: 45,
    marginBottom: 10,
    textAlign: "center",
  },
  pokedexContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  flatListContent: {
    paddingBottom: 1,
    marginLeft: 22,
    maxWidth: 345,
  },
  pokemonItem: {
    padding: 10,
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
    fontWeight: "bold",
  },
  pokemonType: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 10,
  },
  favoriteButton: {
    padding: 10,
  },
  favoriteButtonActive: {},
  favoriteButtonText: {
    fontSize: 24,
  },
  flatListContent: {
    paddingBottom: 20,
  },
});
