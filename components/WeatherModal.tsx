import { View, Text, Modal, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import { HourlyForecast, WeatherData } from '@/constants/interfaces';

interface WeatherModalProps {
  weatherData: WeatherData | null;
  hourlyForecast: HourlyForecast[];
  showWeather: boolean;
  setShowWeather: React.Dispatch<React.SetStateAction<boolean>>;
}

const WeatherModal: React.FC<WeatherModalProps> = ({ weatherData, hourlyForecast, showWeather, setShowWeather }) => {
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
          <View className="bg-[#FFEBE7] p-6 rounded-2xl w-11/12 max-h-[80%]">
            {weatherData ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View className="space-y-4">
                  {/* Location and Current Weather */}
                  <View className="items-center">
                    <Text className="text-2xl font-rubik-bold text-[#2D3142]">
                      {weatherData.name}
                    </Text>
                    <View className='bg-[#C1666B] rounded-full my-2'>
                        <Image
                            source={{ 
                            uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png` 
                            }}
                            className="w-24 h-24"
                        />
                    </View>
                    <Text className="text-3xl font-rubik-medium">
                      {Math.round(weatherData.main.temp)}°C
                    </Text>
                    <Text className="text-lg font-rubik capitalize text-[#4F5D75]">
                      {weatherData.weather[0].description}
                    </Text>
                  </View>

                  {/* Current Details */}
                  <View className="bg-[#F7F7F7] p-4 rounded-xl my-2">
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
                          className="items-center bg-[#F7F7F7] p-3 rounded-xl  mr-2"
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
                            {Math.round(hour.main.temp)}°C
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

export default WeatherModal