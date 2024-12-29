import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from '@expo/vector-icons';

import icons from "@/constants/icons";
import Search from "@/components/Search";
import { Card } from "@/components/Cards";
import NoResults from "@/components/NoResults";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";

const Home = () => {
  const { user } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('items'); // 'items' or 'outfits'
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  const { data: properties, refetch, loading } = useAppwrite({
    fn: getProperties,
    params: {
      filter: params.filter!,
      query: params.query!,
      limit: 8,
    },
    skip: true,
  });

  useEffect(() => {
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 8,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  const TabButton = ({ title, isActive, onPress }: { title: string; isActive: boolean; onPress: () => void }) => (
    <TouchableOpacity 
      onPress={onPress}
      className={`flex-1 py-3 ${isActive ? 'border-b-2 border-[#E63462]' : ''}`}
    >
      <Text 
        className={`text-center font-rubik-medium ${
          isActive ? 'text-[#E63462]' : 'text-[#4F5D75]'
        }`}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View className="px-5">
      {/* User Profile & Notifications */}
      <TouchableOpacity 
        className="flex flex-row items-center justify-between mt-5" 
        onPress={() => router.push('/profile')}
      >
        <View className="flex flex-row items-center">
          <Image
            source={{ uri: user?.avatar }}
            className="size-12 rounded-full"
          />
          <View className="ml-3">
            <Text className="text-xs font-rubik text-[#4F5D75]">Welcome back</Text>
            <Text className="text-base font-rubik-medium text-[#2D3142]">
              {user?.name}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Search Bar */}
      <View className="mt-2">
        <Search />
      </View>

      {/* Tabs */}
      <View className="flex-row mt-2 border-b border-[#4F5D75]/20">
        <TabButton 
          title="Outfits" 
          isActive={activeTab === 'outfits'} 
          onPress={() => setActiveTab('outfits')} 
        />
        <TabButton 
          title="Items" 
          isActive={activeTab === 'items'} 
          onPress={() => setActiveTab('items')} 
        />
      </View>

      {/* Section Headers */}
      {activeTab === 'items' ? (
        <>
          <View className="flex-row justify-between items-center mt-6">
            <Text className="text-xl font-rubik-bold text-[#2D3142]">Favorites</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-medium text-[#E63462]">View all</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View className="flex-row justify-between items-center mt-6">
            <Text className="text-xl font-rubik-bold text-[#2D3142]">Recent Outfits</Text>
            <TouchableOpacity>
              <Text className="text-base font-rubik-medium text-[#E63462]">View all</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <FlatList
        data={properties}
        numColumns={2}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        keyExtractor={(item) => item.$id}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-4 px-5"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="mt-5 text-[#E63462]" />
          ) : (
            <NoResults />
          )
        }
      />
    </SafeAreaView>
  );
};

export default Home;