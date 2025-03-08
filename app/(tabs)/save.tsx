import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { ChevronLeft, Search, Filter, Star, X } from "react-native-feather";
import { useRoute } from "@react-navigation/native";
import { useRouter } from "expo-router";

// Sample movie data
const savedMovies = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    genres: ["Sci-Fi", "Action", "Thriller"],
    director: "Christopher Nolan",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2023-12-15",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
    director: "Christopher Nolan",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2023-11-20",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    genres: ["Sci-Fi", "Adventure", "Drama"],
    director: "Christopher Nolan",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2024-01-05",
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    genres: ["Thriller", "Drama", "Comedy"],
    director: "Bong Joon-ho",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2024-02-10",
  },
  {
    id: 5,
    title: "The Godfather",
    year: 1972,
    rating: 9.2,
    genres: ["Crime", "Drama"],
    director: "Francis Ford Coppola",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2023-10-30",
  },
  {
    id: 6,
    title: "Pulp Fiction",
    year: 1994,
    rating: 8.9,
    genres: ["Crime", "Drama"],
    director: "Quentin Tarantino",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2023-09-15",
  },
  {
    id: 7,
    title: "The Shawshank Redemption",
    year: 1994,
    rating: 9.3,
    genres: ["Drama"],
    director: "Frank Darabont",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2023-08-22",
  },
  {
    id: 8,
    title: "Dune",
    year: 2021,
    rating: 8.0,
    genres: ["Sci-Fi", "Adventure"],
    director: "Denis Villeneuve",
    poster: "/placeholder.svg?height=300&width=200",
    dateSaved: "2024-03-01",
  },
];

// Available genres for filtering
const allGenres = [
  "All",
  "Action",
  "Adventure",
  "Comedy",
  "Crime",
  "Drama",
  "Sci-Fi",
  "Thriller",
];

// Sort options
const sortOptions = [
  { id: "recent", label: "Recently Saved" },
  { id: "rating", label: "Highest Rated" },
  { id: "title", label: "Title (A-Z)" },
  { id: "year", label: "Release Year" },
];

export default function SavedMoviesScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentSort, setCurrentSort] = useState(sortOptions[0]);

  // Animation values
  const filterHeight = useSharedValue(0);
  const filterOpacity = useSharedValue(0);

  // Toggle filter panel
  const toggleFilters = () => {
    if (showFilters) {
      filterHeight.value = withTiming(0, { duration: 300 });
      filterOpacity.value = withTiming(0, { duration: 200 });
      setTimeout(() => setShowFilters(false), 300);
    } else {
      setShowFilters(true);
      filterHeight.value = withTiming(200, { duration: 300 });
      filterOpacity.value = withTiming(1, { duration: 300 });
    }
  };

  // Animated styles for filter panel
  const filterAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: filterHeight.value,
      opacity: filterOpacity.value,
      overflow: "hidden",
    };
  });

  // Filter and sort movies
  const filteredMovies = savedMovies
    .filter((movie) => {
      // Apply search filter
      const matchesSearch =
        searchQuery === "" ||
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.director.toLowerCase().includes(searchQuery.toLowerCase());

      // Apply genre filter
      const matchesGenre =
        selectedGenre === "All" || movie.genres.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (currentSort.id) {
        case "recent":
          return (
            new Date(b.dateSaved).getTime() - new Date(a.dateSaved).getTime()
          );
        case "rating":
          return b.rating - a.rating;
        case "title":
          return a.title.localeCompare(b.title);
        case "year":
          return b.year - a.year;
        default:
          return 0;
      }
    });

  // Movie card component
  const MovieCard = ({ item, index }: { item: any; index: any }) => {
    const scale = useSharedValue(1);

    const cardAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: scale.value }],
      };
    });

    const handlePressIn = () => {
      scale.value = withTiming(0.95, { duration: 100 });
    };

    const handlePressOut = () => {
      scale.value = withTiming(1, { duration: 100 });
    };

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).springify()}
        style={cardAnimatedStyle}
        className="w-[48%] mb-4"
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="rounded-xl overflow-hidden bg-dark-100"
        >
          <Image
            source={{ uri: item.poster }}
            className="w-full h-56 rounded-t-xl"
            resizeMode="cover"
          />

          <View className="p-3">
            <Text className="text-white font-bold text-base" numberOfLines={1}>
              {item.title}
            </Text>

            <View className="flex-row justify-between items-center mt-1">
              <Text className="text-light-300 text-xs">{item.year}</Text>
              <View className="flex-row items-center">
                <Star width={12} height={12} color="#FFCA28" />
                <Text className="text-light-200 text-xs ml-1">
                  {item.rating}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap mt-2">
              {item.genres.slice(0, 2).map((genre, idx) => (
                <View
                  key={idx}
                  className="bg-dark-200 rounded-full px-2 py-1 mr-1 mb-1"
                >
                  <Text className="text-light-100 text-[10px]">{genre}</Text>
                </View>
              ))}
              {item.genres.length > 2 && (
                <View className="bg-dark-200 rounded-full px-2 py-1 mr-1 mb-1">
                  <Text className="text-light-100 text-[10px]">
                    +{item.genres.length - 2}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Genre pill component
  const GenrePill = ({ genre }: { genre: any }) => (
    <TouchableOpacity
      onPress={() => setSelectedGenre(genre)}
      className={`rounded-full px-4 py-2 mr-2 ${
        selectedGenre === genre ? "bg-accent" : "bg-dark-100"
      }`}
    >
      <Text
        className={`${
          selectedGenre === genre ? "text-white" : "text-light-200"
        } font-medium`}
      >
        {genre}
      </Text>
    </TouchableOpacity>
  );

  // Sort option component
  const SortOption = ({ option }: { option: any }) => (
    <TouchableOpacity
      onPress={() => setCurrentSort(option)}
      className={`py-2 px-4 rounded-lg mb-2 ${
        currentSort.id === option.id ? "bg-accent" : "bg-dark-200"
      }`}
    >
      <Text
        className={`${
          currentSort.id === option.id ? "text-white" : "text-light-200"
        } font-medium`}
      >
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <ChevronLeft width={24} height={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Saved Movies</Text>
        <View className="w-10" />
      </View>

      {/* Search and Filter Bar */}
      <View className="px-5 mb-4">
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center bg-dark-100 rounded-xl px-3 py-2 mr-2">
            <Search width={18} height={18} color="#9CA4AB" />
            <TextInput
              placeholder="Search saved movies..."
              placeholderTextColor="#9CA4AB"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-white"
            />
            {searchQuery !== "" && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X width={18} height={18} color="#9CA4AB" />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            onPress={toggleFilters}
            className={`w-10 h-10 items-center justify-center rounded-xl ${
              showFilters ? "bg-accent" : "bg-dark-100"
            }`}
          >
            <Filter
              width={18}
              height={18}
              color={showFilters ? "#FFFFFF" : "#9CA4AB"}
            />
          </TouchableOpacity>
        </View>

        {/* Filter Panel */}
        {showFilters && (
          <Animated.View
            style={filterAnimatedStyle}
            className="bg-dark-100 rounded-xl p-4 mb-4"
          >
            <View className="mb-3">
              <Text className="text-white font-bold mb-2">Sort By</Text>
              <View>
                {sortOptions.map((option) => (
                  <SortOption key={option.id} option={option} />
                ))}
              </View>
            </View>
          </Animated.View>
        )}

        {/* Genre Pills */}
        <View className="mb-2">
          <FlatList
            data={allGenres}
            renderItem={({ item }) => <GenrePill genre={item} />}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="py-2"
          />
        </View>
      </View>

      {/* Movie Grid */}
      <FlatList
        data={filteredMovies}
        renderItem={({ item, index }) => (
          <MovieCard item={item} index={index} />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Animated.View
            entering={FadeIn.delay(300)}
            className="items-center justify-center py-20"
          >
            <Text className="text-light-200 text-lg font-medium">
              No movies found
            </Text>
            <Text className="text-light-300 text-sm text-center mt-2 px-10">
              Try adjusting your search or filters to find what you're looking
              for
            </Text>
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
}
