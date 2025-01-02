import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const dummyItemData = {
  id: '1',
  name: 'Blue Cotton T-Shirt',
  description: 'Comfortable casual t-shirt perfect for everyday wear',
  category: 'top',
  subcategory: 't-shirt',
  image: 'https://example.com/image.jpg',   
  lastWorn: '2024-01-15',
  timesWorn: 5,
};

const ItemView = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <ScrollView>
        <View className="relative">
          {/* Placeholder Image */}
          <View className="h-96 bg-gray-200 items-center justify-center">
            <MaterialCommunityIcons name="tshirt-crew" size={96} color="#4F5D75" />
          </View>
          
          {/* Back Button */}
          <TouchableOpacity 
            onPress={() => router.back()}
            className="absolute top-4 left-4 bg-black/50 rounded-full p-2"
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View className="p-6">
          <Text className="text-2xl font-bold text-[#2D3142]">{dummyItemData.name}</Text>
          <Text className="text-base text-[#4F5D75] mt-2">{dummyItemData.description}</Text>

          <View className="mt-6 space-y-4">
            <View className="flex-row justify-between">
              <Text className="text-[#4F5D75]">Category</Text>
              <Text className="text-[#2D3142] font-medium capitalize">{dummyItemData.category}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#4F5D75]">Type</Text>
              <Text className="text-[#2D3142] font-medium capitalize">{dummyItemData.subcategory}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#4F5D75]">Last Worn</Text>
              <Text className="text-[#2D3142] font-medium">{dummyItemData.lastWorn}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#4F5D75]">Times Worn</Text>
              <Text className="text-[#2D3142] font-medium">{dummyItemData.timesWorn}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ItemView;