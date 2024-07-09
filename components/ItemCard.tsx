import { StyleSheet, TouchableOpacity, Image, View, Text, useColorScheme, Dimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import icon from "@/assets/images/fitpic.jpg";
import { Item } from '@/constants/Interfaces';
import { Modal, Portal } from 'react-native-paper';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ItemCard({ item }: { item: Item }) {
  const colorScheme = useColorScheme(); // Get the current color scheme
  const isDarkMode = colorScheme === 'dark';

  const [showDetails, setShowDetails] = useState(false);

  return (
    <View style={styles.imageContainer}>
      <TouchableOpacity style={styles.touchableImage} onPress={() => setShowDetails(true)}>
        <Image source={item.src} style={styles.image} />
      </TouchableOpacity>
      <Portal>
        <Modal visible={showDetails} onDismiss={() => setShowDetails(false)} contentContainerStyle={styles.detailsContainer}>
          <View style={styles.header}> 
            <Text>{item.id}</Text>
            <View
              style={{ flexDirection: 'row' }}
            >
              <Pressable style={styles.editButton}>
                <FontAwesome name="edit" size={20} color="white" />
              </Pressable>
              <Pressable style={styles.deleteButton}>
                <FontAwesome name="trash" size={20} color="white" />
              </Pressable>
            </View>
          </View>
          <Text>Example Modal. Click outside this area to dismiss.</Text>
          <Image source={item.src} style={{ width: 100, height: 100 }} />
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
  },
  touchableImage: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: 'cover',
    borderRadius: 10, // Ensure the image has rounded corners
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20, // Add some margin to center the modal better
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});
