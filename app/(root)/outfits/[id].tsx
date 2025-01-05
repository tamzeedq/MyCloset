import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const dummyOutfitData = {
  id: '1',
  name: 'Casual Weekend Look',
  description: 'Perfect for a relaxed weekend brunch',
  tags: ['casual', 'summer', 'comfortable'],
  idealTemperature: '75',
  items: [
    { id: '1', name: 'Blue T-Shirt', type: 'top' },
    { id: '2', name: 'Dark Jeans', type: 'bottom' },
    { id: '3', name: 'White Sneakers', type: 'shoes' },
  ],
};

const OutfitView = () => {
  const { id } = useLocalSearchParams();

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <ScrollView>
        <View className="relative">
          {/* Placeholder Image */}
          <View className="h-96 bg-gray-200 items-center justify-center">
            <MaterialCommunityIcons name="hanger" size={96} color="#4F5D75" />
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
          <Text className="text-2xl font-bold text-[#2D3142]">{dummyOutfitData.name}</Text>
          <Text className="text-base text-[#4F5D75] mt-2">{dummyOutfitData.description}</Text>

          <View className="flex-row flex-wrap gap-2 mt-4">
            {dummyOutfitData.tags.map(tag => (
              <View key={tag} className="bg-[#DA4167] rounded-full px-3 py-1">
                <Text className="text-white">{tag}</Text>
              </View>
            ))}
          </View>

          <View className="mt-6">
            <Text className="text-xl font-semibold text-[#2D3142] mb-4">Items in this outfit</Text>
            {dummyOutfitData.items.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => router.push({
                    pathname: "/(root)/items/[id]",
                    params: { id: item.id }
                  })}
                className="flex-row items-center justify-between bg-white rounded-xl p-4 mb-3 shadow-sm"
              >
                <View className="flex-row items-center">
                    <MaterialCommunityIcons 
                    name={
                        item.type === 'top' ? 'tshirt-crew' :
                        item.type === 'bottom' ? 'alpha-p-box' :
                        'shoe-sneaker'
                    } as string
                    size={24} 
                    color="#4F5D75" 
                    />
                  <Text className="text-[#2D3142] ml-3">{item.name}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#4F5D75" />
              </TouchableOpacity>
            ))}
          </View>

          <View className="mt-6 bg-white rounded-xl p-4 shadow-sm">
            <Text className="text-[#4F5D75]">Ideal Temperature</Text>
            <Text className="text-xl font-semibold text-[#2D3142] mt-1">
              {dummyOutfitData.idealTemperature}°C
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OutfitView;