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
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { Card } from "@/components/Cards";
import Search from "@/components/Search";
import NoResults from "@/components/NoResults";
import { useAppwrite } from "@/hooks/useAppwrite";
import { useGlobalContext } from "@/lib/global-provider";
import { getLatestProperties, getProperties } from "@/lib/appwrite";
import images from "@/constants/images";


interface WeatherData {
  weather: { 
    icon: string; 
    description: string;
    main: string;
  }[];
  main: { 
    temp: number; 
    humidity: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
}

interface HourlyForecast {
  dt: number;
  temp: number;
  weather: [{
    icon: string;
    description: string;
  }];
}

interface WeatherForecast {
  hourly: HourlyForecast[];
}

// Separate ImageList component with proper typing
interface ImageListProps {
  test_arr?: number[];
  title: string;
}

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
        >
          <Image
            source={images.spiderman} // Remove uri if images.spiderman is already an image resource
            className="w-32 h-32 rounded-lg"
            defaultSource={require('@/assets/images/spiderman.png')} // Add a placeholder image
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
  const [activeTab, setActiveTab] = useState('items');
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
      const lat = 51.5074;
      const lon = -0.1278;
      
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

  const WeatherModal = () => {
    const formatTime = (timestamp: number) => {
      return new Date(timestamp * 1000).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showWeather}
        onRequestClose={() => setShowWeather(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-2xl w-11/12 max-h-[80%]">
            {weatherData ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-4">
                  {/* Location and Current Weather */}
                  <View className="items-center">
                    <Text className="text-2xl font-rubik-bold text-[#2D3142]">
                      {weatherData.name}
                    </Text>
                    <Image
                      source={{ 
                        uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` 
                      }}
                      className="w-24 h-24"
                    />
                    <Text className="text-3xl font-rubik-medium">
                      {Math.round(weatherData.main.temp)}°C
                    </Text>
                    <Text className="text-lg font-rubik capitalize text-[#4F5D75]">
                      {weatherData.weather[0].description}
                    </Text>
                  </View>

                  {/* Current Details */}
                  <View className="bg-[#F7F7F7] p-4 rounded-xl space-y-2">
                    <Text className="font-rubik-medium text-lg text-[#2D3142]">Details</Text>
                    <View className="space-y-2">
                      <Text className="font-rubik">
                        Feels like: {Math.round(weatherData.main.feels_like)}°C
                      </Text>
                      <Text className="font-rubik">
                        Min/Max: {Math.round(weatherData.main.temp_min)}°C / {Math.round(weatherData.main.temp_max)}°C
                      </Text>
                      <Text className="font-rubik">
                        Humidity: {weatherData.main.humidity}%
                      </Text>
                      <Text className="font-rubik">
                        Wind Speed: {Math.round(weatherData.wind.speed * 3.6)} km/h
                      </Text>
                      <Text className="font-rubik">
                        Pressure: {weatherData.main.pressure} hPa
                      </Text>
                    </View>
                  </View>

                  {/* Hourly Forecast */}
                  <View className="space-y-2">
                    <Text className="font-rubik-medium text-lg text-[#2D3142]">
                      24-Hour Forecast
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      className="space-x-4"
                    >
                      {hourlyForecast.map((hour, index) => (
                        <View 
                          key={index} 
                          className="items-center bg-[#F7F7F7] p-3 rounded-xl w-20"
                        >
                          <Text className="font-rubik text-sm">
                            {formatTime(hour.dt)}
                          </Text>
                          <Image
                            source={{ 
                              uri: `https://openweathermap.org/img/wn/${hour.weather[0].icon}.png` 
                            }}
                            className="w-10 h-10"
                          />
                          <Text className="font-rubik-medium">
                            {Math.round(hour.temp)}°C
                          </Text>
                        </View>
                      ))}
                    </ScrollView>
                  </View>

                  <TouchableOpacity 
                    onPress={() => setShowWeather(false)}
                    className="bg-[#DA4167] py-3 rounded-lg mt-4"
                  >
                    <Text className="text-white text-center font-rubik-medium">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ActivityIndicator size="large" color="#DA4167" />
            )}
          </View>
        </View>
      </Modal>
    );
  };

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

  const weatherIcon = weatherData?.weather[0].icon 
    ? { uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png` }
    : null;

  const renderHeader = () => (
    <View className="px-5">
      <View className="flex-row items-center justify-between mt-5">
        <View className="flex-row items-center">
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
          onPress={() => setActiveTab('items')}
          className={`flex-1 pb-3 ${activeTab === 'items' ? 'border-b-2 border-[#DA4167]' : ''}`}
        >
          <Text className={`text-center font-rubik-medium ${
            activeTab === 'items' ? 'text-[#DA4167]' : 'text-[#4F5D75]'
          }`}>
            Items
          </Text>
        </TouchableOpacity>
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
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <WeatherModal />
      <FlatList
        data={[]}
        renderItem={() => null}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-32"
      />
    </SafeAreaView>
  );
};

export default Home;