import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as Location from 'expo-location';
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import images from "@/constants/images";
import { HourlyForecast, ImageListProps, WeatherData } from '@/constants/interfaces';
import WeatherModal from '@/components/WeatherModal';


const ImageList: React.FC<ImageListProps> = ({ test_arr = [], title }) => (
  <View>
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-xl font-rubik-bold text-[#2D3142]">{title}</Text>
      <TouchableOpacity>
        <Text className="text-base font-rubik-medium text-[#DA4167]">
          View all
        </Text>
      </TouchableOpacity>
    </View>
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="min-h-[180px]"
    >
      {test_arr.map((_, index) => (
        <TouchableOpacity
          key={index}
          className="mr-4"
          onPress={() => {
            const id = (index + 1).toString();
            router.push(
              title.toLowerCase().includes('outfit') 
                ? {
                    pathname: "/(root)/outfits/[id]",
                    params: { id }
                  }
                : {
                    pathname: "/(root)/items/[id]",
                    params: { id }
                  }
            );
          }}
        >
          <Image
            source={images.spiderman} // Replace with actual image
            className="w-32 h-32 rounded-lg"
          />
          <Text className="mt-2 font-rubik text-[#4F5D75]">
            {`${title} ${index + 1}`}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const Home = () => {
  const { user } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('outfits');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyForecast[]>([]);
  const [showWeather, setShowWeather] = useState(false);
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

  const fetchWeather = async () => {
    try {
      // Request permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      // Get current position
      let location = await Location.getCurrentPositionAsync({});
      const lat = location.coords.latitude;
      const lon = location.coords.longitude;
    
      
      // Current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const currentWeatherData = await currentWeatherResponse.json();
      
      // Hourly forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}&units=metric`
      );
      const forecastData = await forecastResponse.json();
      
      if (currentWeatherData.cod === 200) {
        setWeatherData(currentWeatherData);
        // Get next 24 hours of forecast data
        const hourlyData = forecastData.list.slice(0, 8);
        setHourlyForecast(hourlyData);
      } else {
        console.error('Weather API error:', currentWeatherData.message);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  useEffect(() => {
    fetchWeather();
    refetch({
      filter: params.filter!,
      query: params.query!,
      limit: 8,
    });
  }, [params.filter, params.query]);

  const getWeatherIcon = () => {
    if (!weatherData) return 'weather-cloudy';
    const icon = weatherData.weather[0].icon;
    if (icon.includes('01')) return 'weather-sunny';
    if (icon.includes('02')) return 'weather-partly-cloudy';
    if (icon.includes('03') || icon.includes('04')) return 'weather-cloudy';
    if (icon.includes('09') || icon.includes('10')) return 'weather-rainy';
    if (icon.includes('11')) return 'weather-lightning';
    if (icon.includes('13')) return 'weather-snowy';
    if (icon.includes('50')) return 'weather-fog';
    return 'weather-cloudy';
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <WeatherModal weatherData={weatherData} hourlyForecast={hourlyForecast} showWeather={showWeather} setShowWeather={setShowWeather} />
      <ScrollView className="px-5">
        <View className="flex-row items-center justify-between mt-5">
          <TouchableOpacity 
            className="flex-row items-center"
            onPress={() => router.push('/profile')}
          >
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
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowWeather(true)}
            className="p-2"
          >
            <MaterialCommunityIcons 
              name={getWeatherIcon()} 
              size={28} 
              color="#4F5D75" 
            />
          </TouchableOpacity>
        </View>

        <View className="mt-6">
          <Search />
        </View>

        <View className="flex-row mt-6 border-b border-[#4F5D75]/10">
          <TouchableOpacity 
            onPress={() => setActiveTab('outfits')}
            className={`flex-1 pb-3 ${activeTab === 'outfits' ? 'border-b-2 border-[#DA4167]' : ''}`}
          >
            <Text className={`text-center font-rubik-medium ${
              activeTab === 'outfits' ? 'text-[#DA4167]' : 'text-[#4F5D75]'
            }`}>
              Outfits
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setActiveTab('items')}
            className={`flex-1 pb-3 ${activeTab === 'items' ? 'border-b-2 border-[#DA4167]' : ''}`}
          >
            <Text className={`text-center font-rubik-medium ${
              activeTab === 'items' ? 'text-[#DA4167]' : 'text-[#4F5D75]'
            }`}>
              Items
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'outfits' ? (
          <View className="mt-6">
            <ImageList title="Recommended" test_arr={[1,2,3,4]} />
            <ImageList title="Favorites" test_arr={[1,2,3,4]} />
            <ImageList title="All Outfits" test_arr={[1,2,3,4]} />
          </View>
        ) : (
          <View className="mt-6">
            <ImageList title="Favorites" test_arr={[1,2,3,4]} />
            <ImageList title="All Items" test_arr={[1,2,3,4]} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;