import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

const POKEDEX_BG_IMAGE = require("../../assets/Images/pokedex_bg.png");

const typeColors = {
  Normal: "#A8A878",
  Fire: "#F08030",
  Water: "#6890F0",
  Grass: "#78C850",
  Electric: "#F8D030",
  Ice: "#98D8D8",
  Fighting: "#C03028",
  Poison: "#A040A0",
  Ground: "#E0C068",
  Flying: "#A890F0",
  Psychic: "#F85888",
  Bug: "#A8B820",
  Rock: "#B8A038",
  Ghost: "#705898",
  Dark: "#705848",
  Dragon: "#7038F8",
  Steel: "#B8B8D0",
  Fairy: "#EE99AC",
  Unknown: "#000000", // Default for unknown types
};

export default function ViewProfile() {
  const { id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://pokemon-api-nssw.onrender.com/pokemon/${id}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(
            `Network response was not ok: ${response.statusText} - ${errorText}`
          );
        }

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          setProfile(data[0]);
        } else {
          throw new Error("No data found for the given ID");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  const {
    image = {},
    name = {},
    type = [],
    profile: profileDetails = {},
  } = profile;

  const textColor = typeColors[type[0]] || typeColors.Unknown; // Use the first type for color

  return (
    <View style={styles.container}>
      <Image source={POKEDEX_BG_IMAGE} style={styles.backgroundImage} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Pokédex</Text>

        <Image
          source={{ uri: image.hires }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: textColor }]}>
          {name.english || "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Type: </Text>
          {type.join(", ") || "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Species: </Text>
          {profileDetails.species || "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Description: </Text>
          {profile.description || "No description available"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Height: </Text>
          {profileDetails.height || "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Weight: </Text>
          {profileDetails.weight || "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Abilities: </Text>
          {profileDetails.ability
            ? profileDetails.ability
                .map(
                  ([ability, isHidden]) =>
                    `${ability}${isHidden ? " (Hidden)" : ""}`
                )
                .join(", ")
            : "Unknown"}
        </Text>
        <Text style={[styles.text, { color: textColor }]}>
          <Text style={styles.boldText}>Gender Ratio: </Text>
          {profileDetails.gender || "Unknown"}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    paddingBottom: 16,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
});
