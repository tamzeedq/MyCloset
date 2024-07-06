import { StyleSheet, FlatList, Image, View, Text, useColorScheme } from 'react-native';
import React from 'react';
import icon from "../assets/images/test_icon.png";

// Define the interface for the image item
interface ImageItem {
  id: string;
  src: typeof icon;
}

const images: ImageItem[] = [
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

export default function Gallery() {
  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark';

  const renderItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.imageContainer}>
      <Image source={item.src} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: isDarkMode ? 'white' : 'black' }]}>
        Gallery
      </Text>
      <FlatList
        style={styles.galleryContainer}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2} // Change the number of columns to suit your needs
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    width: '95%',
  },
  galleryContainer: {
    width: '95%',
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 0.75,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
  },
});
