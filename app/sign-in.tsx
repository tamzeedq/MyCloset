import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { login } from "@/lib/appwrite";
import { Redirect } from "expo-router";
import { useGlobalContext } from "@/lib/global-provider";
import icons from "@/constants/icons";
import images from "@/constants/images";

const Auth = () => {
  const { refetch, loading, isLogged } = useGlobalContext();

  if (!loading && isLogged) return <Redirect href="/" />;

  const handleLogin = async () => {
    const result = await login();
    if (result) {
      refetch({});
    } else {
      Alert.alert("Error", "Failed to login");
    }
  };

  return (
    <SafeAreaView className="h-full bg-[#FFEBE7]">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        
        <View className="px-6 py-8">
          <Image
            source={images.spiderman}
            className="w-full h-72"
            resizeMode="contain"
          />
        </View>
        <View className="px-6 pt-12">
          <Text className="text-[#2D3142] text-4xl font-rubik-bold text-center">
              My{" "}
            <Text className="text-[#DA4167]">
              Closet
            </Text>
          </Text>
          <Text className="text-[#4F5D75] text-lg font-rubik text-center mt-2 opacity-80">
            Your Personal Style Companion
          </Text>
        </View>


        <View className="px-6 pb-12 pt-12">
          {/* <Text className="text-[#E63462] text-2xl font-rubik-bold text-center mb-3">
            Welcome!
          </Text> */}
          <Text className="text-[#4F5D75] text-base font-rubik text-center mb-8 opacity-80">
            Track, organize, and discover your perfect outfits
          </Text>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-[#2D3142] rounded-xl w-full py-4 shadow-lg"
          >
            <View className="flex flex-row items-center justify-center">
              <Image
                source={icons.google}
                className="w-5 h-5"
                resizeMode="contain"
              />
              <Text className="text-[#FFEBE7] text-lg font-rubik-medium ml-2">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>

          <Text className="text-[#4F5D75] text-sm font-rubik text-center mt-6 opacity-70">
            Digitize your closet today!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Auth;