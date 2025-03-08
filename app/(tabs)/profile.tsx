import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  FadeIn,
  FadeInDown,
  FadeInRight,
} from "react-native-reanimated";

// Movie data for watchlist and favorites
const movieData = [
  {
    id: 1,
    title: "Inception",
    year: 2010,
    rating: 8.8,
    poster: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 2,
    title: "The Dark Knight",
    year: 2008,
    rating: 9.0,
    poster: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 3,
    title: "Interstellar",
    year: 2014,
    rating: 8.6,
    poster: "/placeholder.svg?height=150&width=100",
  },
  {
    id: 4,
    title: "Parasite",
    year: 2019,
    rating: 8.5,
    poster: "/placeholder.svg?height=150&width=100",
  },
];

// Activity data
const activityData = [
  {
    id: 1,
    type: "review",
    movie: "Dune: Part Two",
    date: "2 days ago",
    content: "A visual masterpiece with incredible world-building.",
  },
  {
    id: 2,
    type: "rating",
    movie: "Poor Things",
    date: "1 week ago",
    rating: 4.5,
  },
  { id: 3, type: "watchlist", movie: "Oppenheimer", date: "2 weeks ago" },
];

// Stats data
const statsData = [
  { label: "Reviews", value: 42 },
  { label: "Watchlist", value: 87 },
  { label: "Favorites", value: 23 },
];

export default function ProfileScreen() {
  // Animation values
  const scrollY = useSharedValue(0);
  const headerHeight = useSharedValue(280);
  const avatarSize = useSharedValue(100);
  const avatarBorderRadius = useSharedValue(50);
  const avatarMarginTop = useSharedValue(30);

  // Scroll handler for animations
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated styles
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 100],
        [headerHeight.value, 120],
        "clamp"
      ),
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: interpolate(
        scrollY.value,
        [0, 100],
        [avatarSize.value, 60],
        "clamp"
      ),
      height: interpolate(
        scrollY.value,
        [0, 100],
        [avatarSize.value, 60],
        "clamp"
      ),
      borderRadius: interpolate(
        scrollY.value,
        [0, 100],
        [avatarBorderRadius.value, 30],
        "clamp"
      ),
      marginTop: interpolate(
        scrollY.value,
        [0, 100],
        [avatarMarginTop.value, 10],
        "clamp"
      ),
    };
  });

  const nameAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, 50], [1, 0.8], "clamp"),
      transform: [
        {
          translateY: interpolate(scrollY.value, [0, 100], [0, -20], "clamp"),
        },
      ],
    };
  });

  // Movie card component
  const MovieCard = ({ movie }: { movie: any }) => (
    <Animated.View
      entering={FadeInRight.delay(movie.id * 100).springify()}
      className="w-32 mr-4 rounded-lg overflow-hidden"
    >
      <Image
        source={{ uri: movie.poster }}
        className="w-full h-48 rounded-lg"
        resizeMode="cover"
      />
      <View className="mt-2">
        <Text className="text-white font-semibold text-sm">{movie.title}</Text>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-light-200 text-xs">{movie.year}</Text>
          <View className="flex-row items-center">
            <Text className="text-yellow-400 text-xs mr-1">★</Text>
            <Text className="text-light-200 text-xs">{movie.rating}</Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );

  // Activity item component
  const ActivityItem = ({ item, index }: { item: any; index: any }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      className="bg-dark-100 p-4 rounded-xl mb-3"
    >
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-accent font-medium text-sm">
            {item.type === "review"
              ? "Reviewed"
              : item.type === "rating"
              ? "Rated"
              : "Added to Watchlist"}
          </Text>
          <Text className="text-white font-bold text-base mt-1">
            {item.movie}
          </Text>
        </View>
        <Text className="text-light-300 text-xs">{item.date}</Text>
      </View>

      {item.type === "review" && (
        <Text className="text-light-200 text-sm mt-2">{item.content}</Text>
      )}

      {item.type === "rating" && (
        <View className="flex-row items-center mt-2">
          <Text className="text-yellow-400 text-base mr-1">★★★★</Text>
          <Text className="text-yellow-400 text-base">½</Text>
          <Text className="text-white text-sm ml-2">({item.rating}/5)</Text>
        </View>
      )}
    </Animated.View>
  );

  // Stats item component
  const StatItem = ({ item, index }: { item: any; index: any }) => (
    <Animated.View
      entering={FadeIn.delay(index * 200).springify()}
      className="items-center"
    >
      <Text className="text-white text-xl font-bold">{item.value}</Text>
      <Text className="text-light-300 text-sm">{item.label}</Text>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary pb-10">
      <StatusBar barStyle="light-content" />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        className="flex-1"
      >
        {/* Header Background */}
        <Animated.View
          style={headerAnimatedStyle}
          className="bg-dark-100 absolute top-0 left-0 right-0"
        />

        {/* Profile Info */}
        <View className="px-5">
          <View className="flex-row items-start">
            <Animated.Image
              source={require("../../assets/images/patrick.jpeg")}
              style={avatarAnimatedStyle}
              className="border-4 border-primary"
            />

            <View className="ml-4 mt-8">
              <Animated.Text
                style={nameAnimatedStyle}
                className="text-white text-2xl font-bold"
              >
                Patrick Bateman
              </Animated.Text>
              <Text className="text-light-200 text-sm">@AmericanPsycho</Text>
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-light-200 text-sm leading-5">
              Film enthusiast and critic. Lover of sci-fi and psychological
              thrillers. Based in Los Angeles, CA.
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mt-6 bg-dark-100 p-4 rounded-xl">
            {statsData.map((stat, index) => (
              <StatItem key={stat.label} item={stat} index={index} />
            ))}
          </View>

          {/* Action Buttons */}
          <View className="flex-row mt-4 gap-3 pt-10">
            <TouchableOpacity className="flex-1 bg-accent py-3 rounded-xl items-center">
              <Text className="text-white font-semibold">Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-dark-100 py-3 rounded-xl items-center">
              <Text className="text-white font-semibold">Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Watchlist Section */}
        <View className="mt-8 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">My Watchlist</Text>
            <TouchableOpacity>
              <Text className="text-accent">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
            {movieData.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ScrollView>
        </View>

        {/* Favorites Section */}
        <View className="mt-8 px-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white text-lg font-bold">Favorites</Text>
            <TouchableOpacity>
              <Text className="text-accent">See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pb-2"
          >
            {[...movieData].reverse().map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </ScrollView>
        </View>

        {/* Recent Activity */}
        <View className="mt-8 px-5 mb-10">
          <Text className="text-white text-lg font-bold mb-4">
            Recent Activity
          </Text>

          {activityData.map((item, index) => (
            <ActivityItem key={item.id} item={item} index={index} />
          ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
