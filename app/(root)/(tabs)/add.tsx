import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  Pressable,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import RNPickerSelect from 'react-native-picker-select';

const AddScreen = () => {
  const [type, setType] = useState<'item' | 'outfit'>('item');
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTagSelector, setShowTagSelector] = useState(false);

  const [itemForm, setItemForm] = useState({
    description: '',
    primaryCategory: '',
    secondaryCategory: '',
  });

  const [outfitForm, setOutfitForm] = useState({
    description: '',
    selectedTags: new Set<string>(),
    temperature: '',
  });

  const categoryOptions = {
    top: ['t-shirt', 'sweater', 'blouse', 'tank top', 'shirt', 'polo'],
    bottom: ['jeans', 'shorts', 'skirt', 'pants', 'leggings'],
    shoes: ['sneakers', 'boots', 'sandals', 'heels', 'flats'],
    accessory: ['necklace', 'ring', 'bracelet', 'earrings', 'watch', 'belt', 'scarf'],
    outerwear: ['jacket', 'coat', 'cardigan', 'hoodie'],
  };

  const tagOptions = {
    occasion: ['casual', 'work', 'formal', 'party', 'date night'],
    season: ['summer', 'winter', 'fall', 'spring'],
    style: ['minimalist', 'vintage', 'streetwear', 'preppy', 'bohemian'],
    weather: ['rainy', 'sunny', 'snowy', 'windy'],
    mood: ['comfortable', 'elegant', 'cozy', 'sporty'],
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow access to your photo library to add items.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please allow camera access to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleTagToggle = (tag: string) => {
    setOutfitForm(prev => {
      const newTags = new Set(prev.selectedTags);
      if (newTags.has(tag)) {
        newTags.delete(tag);
      } else {
        newTags.add(tag);
      }
      return { ...prev, selectedTags: newTags };
    });
  };

  const handleSubmit = async () => {
    if (!image) {
      Alert.alert('Image Required', 'Please add an image of your item.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement image upload and data storage
      Alert.alert('Success', 'Your item has been added to your closet!');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Unable to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FFEBE7]">
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 100 }} // Add padding for navigation
        >
          {/* Header */}
          <View className="px-6 py-4 bg-white shadow-sm">
            <Text className="text-2xl font-bold text-[#2D3142]">
              Add to Closet
            </Text>
            <Text className="text-base text-[#4F5D75] mt-1">
              Add a new item or outfit to your digital wardrobe
            </Text>
          </View>

          {/* Content */}
          <View className="p-6">
            {/* Type Selector */}
            <View className="flex-row justify-center space-x-4 bg-white rounded-2xl p-2 shadow-sm">
              <TouchableOpacity
                onPress={() => setType('item')}
                className={`flex-1 py-3 rounded-xl ${
                  type === 'item' ? 'bg-[#DA4167]' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  type === 'item' ? 'text-white' : 'text-[#4F5D75]'
                }`}>
                  Single Item
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('outfit')}
                className={`flex-1 py-3 rounded-xl ${
                  type === 'outfit' ? 'bg-[#DA4167]' : 'bg-transparent'
                }`}
              >
                <Text className={`text-center font-semibold ${
                  type === 'outfit' ? 'text-white' : 'text-[#4F5D75]'
                }`}>
                  Full Outfit
                </Text>
              </TouchableOpacity>
            </View>

            {/* Image Upload Section */}
            <View className="mt-6">
              <Text className="text-lg font-semibold text-[#2D3142] mb-3">
                Add Photo
              </Text>
              {!image ? (
                <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  <View className="h-72 flex-row items-center justify-around">
                      <TouchableOpacity
                        onPress={takePhoto}
                        className="items-center"
                      >
                        <View className="bg-[#FFEBE7] p-4 rounded-full mb-2">
                          <MaterialCommunityIcons name="camera" size={32} color="#DA4167" />
                        </View>
                        <Text className="text-[#4F5D75] font-medium">Take Photo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={pickImage}
                        className="items-center"
                      >
                        <View className="bg-[#FFEBE7] p-4 rounded-full mb-2">
                          <MaterialCommunityIcons name="image" size={32} color="#DA4167" />
                        </View>
                        <Text className="text-[#4F5D75] font-medium">Choose Photo</Text>
                      </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View className="relative rounded-2xl shadow-sm overflow-hidden">
                  <Image
                    source={{ uri: image }}
                    className="h-72 w-full"
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    onPress={() => setImage(null)}
                    className="absolute top-4 right-4 bg-black/50 rounded-full p-2"
                  >
                    <MaterialCommunityIcons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Form Fields */}
            <View className="mt-6">
              {type === 'item' ? (
                <>
                  <View className="space-y-4">
                    <View>
                      <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                        Description
                      </Text>
                      <TextInput
                        value={itemForm.description}
                        onChangeText={(text) => setItemForm(prev => ({ ...prev, description: text }))}
                        className="bg-white rounded-xl px-4 py-3 text-[#2D3142] shadow-sm"
                        placeholder="E.g., Blue cotton t-shirt"
                        placeholderTextColor="#9BA0AF"
                      />
                    </View>

                    <View>
                      <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                        Category
                      </Text>
                      <View className="bg-white rounded-xl shadow-sm">
                        <RNPickerSelect
                          onValueChange={(value) => setItemForm(prev => ({
                            ...prev,
                            primaryCategory: value,
                            secondaryCategory: '',
                          }))}
                          value={itemForm.primaryCategory}
                          items={Object.keys(categoryOptions).map(category => ({
                            label: category.charAt(0).toUpperCase() + category.slice(1),
                            value: category,
                          }))}
                          style={{
                            inputIOS: {
                              fontSize: 16,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              color: '#2D3142',
                            },
                            inputAndroid: {
                              fontSize: 16,
                              paddingVertical: 12,
                              paddingHorizontal: 16,
                              color: '#2D3142',
                            },
                          }}
                          placeholder={{ label: 'Select category', value: null }}
                        />
                      </View>
                    </View>

                    {itemForm.primaryCategory && (
                      <View>
                        <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                          Subcategory
                        </Text>
                        <View className="bg-white rounded-xl shadow-sm">
                          <RNPickerSelect
                            onValueChange={(value) => setItemForm(prev => ({
                              ...prev,
                              secondaryCategory: value,
                            }))}
                            value={itemForm.secondaryCategory}
                            items={categoryOptions[itemForm.primaryCategory as keyof typeof categoryOptions].map(subCategory => ({
                              label: subCategory.charAt(0).toUpperCase() + subCategory.slice(1),
                              value: subCategory,
                            }))}
                            style={{
                              inputIOS: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                color: '#2D3142',
                              },
                              inputAndroid: {
                                fontSize: 16,
                                paddingVertical: 12,
                                paddingHorizontal: 16,
                                color: '#2D3142',
                              },
                            }}
                            placeholder={{ label: 'Select subcategory', value: null }}
                          />
                        </View>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <>
                  <View className="space-y-4">
                    <View>
                      <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                        Description
                      </Text>
                      <TextInput
                        value={outfitForm.description}
                        onChangeText={(text) => setOutfitForm(prev => ({ ...prev, description: text }))}
                        className="bg-white rounded-xl px-4 py-3 text-[#2D3142] shadow-sm"
                        placeholder="E.g., Casual weekend outfit"
                        placeholderTextColor="#9BA0AF"
                      />
                    </View>

                    <View>
                      <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                        Tags
                      </Text>
                      <TouchableOpacity
                        onPress={() => setShowTagSelector(!showTagSelector)}
                        className="bg-white rounded-xl px-4 py-3 shadow-sm flex-row justify-between items-center"
                      >
                        <Text className={outfitForm.selectedTags.size === 0 ? "text-[#9BA0AF]" : "text-[#2D3142]"}>
                          {outfitForm.selectedTags.size === 0 ? "Select tags" : `${outfitForm.selectedTags.size} tags selected`}
                        </Text>
                        <MaterialCommunityIcons
                          name={showTagSelector ? "chevron-up" : "chevron-down"}
                          size={24}
                          color="#4F5D75"
                        />
                      </TouchableOpacity>

                      {showTagSelector && (
                        <View className="bg-white rounded-xl shadow-sm mt-2 p-4">
                          {Object.entries(tagOptions).map(([category, tags]) => (
                            <View key={category} className="mb-4">
                              <Text className="text-[#2D3142] font-semibold mb-2 capitalize">
                                {category}
                              </Text>
                              <View className="flex-row flex-wrap gap-2">
                                {tags.map(tag => (
                                  <TouchableOpacity
                                    key={tag}
                                    onPress={() => handleTagToggle(tag)}
                                    className={`rounded-full px-3 py-1 ${
                                      outfitForm.selectedTags.has(tag)
                                        ? 'bg-[#DA4167]'
                                        : 'bg-gray-100'
                                    }`}
                                  >
                                    <Text className={
                                      outfitForm.selectedTags.has(tag)
                                        ? 'text-white'
                                        : 'text-[#4F5D75]'
                                    }>
                                      {tag}
                                    </Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {outfitForm.selectedTags.size > 0 && (
                        <View className="flex-row flex-wrap gap-2 mt-2">
                          {Array.from(outfitForm.selectedTags).map(tag => (
                            <View 
                              key={tag} 
                              className="bg-[#DA4167] rounded-full flex-row items-center px-3 py-1"
                            >
                              <Text className="text-white mr-1">{tag}</Text>
                              <TouchableOpacity
                                onPress={() => handleTagToggle(tag)}
                                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                              >
                                <MaterialCommunityIcons name="close" size={16} color="white" />
                              </TouchableOpacity>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>

                    <View>
                      <Text className="text-lg font-semibold text-[#2D3142] mb-2">
                        Ideal Temperature (°F)
                      </Text>
                      <TextInput
                        value={outfitForm.temperature}
                        onChangeText={(text) => setOutfitForm(prev => ({ ...prev, temperature: text }))}
                        keyboardType="numeric"
                        className="bg-white rounded-xl px-4 py-3 text-[#2D3142] shadow-sm"
                        placeholder="75"
                        placeholderTextColor="#9BA0AF"
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className={`mt-8 rounded-xl shadow-sm ${
                loading ? 'bg-[#9BA0AF]' : 'bg-[#DA4167]'
              }`}
            >
              <Text className="text-white text-center font-semibold py-4 text-lg">
                {loading ? 'Adding to Closet...' : 'Add to Closet'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddScreen;