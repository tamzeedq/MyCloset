import { StyleSheet, FlatList, Image, View, Text } from 'react-native';
import React from 'react';
import icon from "../assets/images/favicon.png";

const images = [
  { id: '1', src: icon },
  { id: '2', src: icon },
  { id: '3', src: icon },
  { id: '4', src: icon },
  // Add more images as needed
];

export default function Gallery() {
  const renderItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={item} style={styles.image} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gallery</Text>
      <FlatList
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
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    aspectRatio: 1, // Keeps images square
    borderWidth: 2, // Add border width
    borderColor: '#007AFF', // Add border color
    borderRadius: 10, // Add border radius
    overflow: 'hidden', // Ensure the image fits within the border radius
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
