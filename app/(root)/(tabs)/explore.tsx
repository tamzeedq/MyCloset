import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";

import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";

import { getProperties } from "@/lib/appwrite";
import { useAppwrite } from "@/hooks/useAppwrite";
import { MaterialIcons } from "@expo/vector-icons";

const Explore = () => {
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const {
    data: properties,
    refetch,
    loading,
  } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <View className="flex-1 items-center justify-center px-6">
        <View className="px-6 py-8 items-center">
          <MaterialIcons 
            name="checkroom" 
            size={200} 
            color="#2D3142" 
          />
        </View>
        <Text className="text-2xl font-rubik-bold text-[#2D3142] mb-4">
          Coming Soon!
        </Text>
        <Text className="text-base font-rubik text-[#4F5D75] text-center opacity-80">
          We're working on something special for you. Stay tuned for new features and updates!
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Explore;
