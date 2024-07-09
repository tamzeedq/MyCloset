import { StyleSheet, FlatList, Image, View, Text, useColorScheme, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import icon from "@/assets/images/fitpic.jpg";
import { Item } from '@/constants/Interfaces';
import ItemCard from '@/components/ItemCard';

// Get the screen width
const screenWidth = Dimensions.get('window').width;

const images: Item[] = [
  { id: '1', src: icon },
  { id: '2', src: icon },
  { id: '3', src: icon },
  { id: '4', src: icon },
  { id: '5', src: icon },
  { id: '6', src: icon },
  { id: '7', src: icon },
  { id: '8', src: icon },
  { id: '28', src: icon },
  { id: '38', src: icon },
  { id: '48', src: icon },
  { id: '9', src: icon },
  // Add more images as needed
];

export default function ItemGallery() {
  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark';

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard item={item} />
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
          Tops
        </Text>
        <FlatList
          style={styles.galleryContainer}
          contentContainerStyle={styles.flatListContent}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
        />
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
          Bottoms
        </Text>
        <FlatList
          style={styles.galleryContainer}
          contentContainerStyle={styles.flatListContent}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
        />
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
          Accessories
        </Text>
        <FlatList
          style={styles.galleryContainer}
          contentContainerStyle={styles.flatListContent}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
        />
        <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
          Jewelry
        </Text>
        <FlatList
          style={styles.galleryContainer}
          contentContainerStyle={styles.flatListContent}
          data={images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth, // Ensure the ScrollView is the full width of the screen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '95%',
  },
  galleryContainer: {
    borderWidth: 2, // Border width
    borderColor: 'blue', // Border color, you can change it to any color you like
    borderRadius: 10, // Border radius for rounded corners
    marginBottom: 20, // Space between FlatLists
    width: '95%', // Set the width of the FlatList container
    height: 220, // Set the height of the FlatList container
  },
  flatListContent: {
    padding: 5, // Padding inside the FlatList to prevent images from touching the border
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 0.75,
    borderWidth: 2, // Border width
    borderColor: 'blue', // Border color, you can change it to any color you like
    borderRadius: 10, // Border radius for rounded corners
    width: 150, // Set the width of the image container
    height: "100%", // Set the height of the image container
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
});
