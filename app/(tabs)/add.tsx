import { StatusBar } from 'expo-status-bar';
import { Dimensions, FlatList, Platform, Pressable, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from 'react-native-ui-lib';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { BACKGROUND, BLACK, GREY, WHITE } from '@/constants/Colors';
import React, { useMemo, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button, Image, Card, H2, Input, Paragraph, styled, TextArea, XStack } from 'tamagui';
import fitpic from '@/assets/images/fitpic.jpg';
import ItemCard from '@/components/ItemCard';
import { Item } from '@/constants/Interfaces';

const SubmitButton = styled(Button, {
  bg: BLACK,
  color: WHITE,
  hoverStyle: {
    bg: GREY,
  },
});

const screenWidth = Dimensions.get('window').width;

const options = [
  { label: 'JavaScript', value: 'js' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'C++', value: 'c++' },
  { label: 'Perl', value: 'perl' }
];

export default function ModalScreen() {
  const colorScheme = useColorScheme();

  const [entryName, setName] = useState('');
  const [entryDescription, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number>(10);
  const [weather, setWeather] = useState<string>("");
  const [items, setItems] = useState<Item[]>(images);

  const handleAddItem = () => {
    const newItem = { id: (items.length + 1).toString(), src: fitpic };
    setItems([...items, newItem]);
  };

  const renderItem = ({ item }: { item: Item }) => {
    if (item.id === 'add') {
      return (
        <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
          <FontAwesome name="plus" size={50} color="blue" />
        </TouchableOpacity>
      );
    } else {
      return <ItemCard item={item} />;
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Add new Outfit/Item</Text>
        <Input
          style={styles.input}
          placeholder="Outfit / Item Name"
          onChangeText={setName}
          value={entryName}
        />
        <View style={styles.row}>
          <Pressable style={styles.cameraButton}>
            <FontAwesome
              name="camera"
              size={25}
              color="#808080"
            />
            <Text>Add Image</Text>
          </Pressable>
          <TextArea
            style={styles.description}
            placeholder="Description"
            onChangeText={setDescription}
            value={entryDescription}
          />
        </View>
        <Text style={styles.title}>Tags</Text>
        <Picker
          placeholder="Favorite Languages (up to 3)"
          value={tags}
          onChange={(items) => setTags(items)}
          mode={Picker.modes.MULTI}
          selectionLimit={3}
          items={options}
        />
        <Text style={styles.title}>Weather</Text>
        <View style={styles.row}>
          <Input
            style={styles.temperature}
            keyboardType='numeric'
            placeholder='Temperature'
            onChangeText={(text) => setTemperature(Number(text))}
            value={temperature ? String(temperature) : ''}
          />
          <Input
            style={styles.weather}
            placeholder='Weather Description'
            onChangeText={setWeather}
            value={weather}
          />
        </View>
        <Text style={styles.title}>Items</Text>
        <FlatList
          style={styles.galleryContainer}
          contentContainerStyle={styles.flatListContent}
          data={[...items, { id: 'add', src: fitpic }]} // Add the extra item for the button
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={true}
        />
        <SubmitButton onPress={() => { /* Handle button press */ }}>
          Add
        </SubmitButton>
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BACKGROUND,
  },
  scrollContainer: {
    width: screenWidth, // Ensure the ScrollView is the full width of the screen
  },
  itemsContainer: {
    flexDirection: 'row',
    overflow: 'scroll',
    padding: 20,
    backgroundColor: BACKGROUND,
  },
  itemsCard: {
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingTop: 10,
    paddingBottom: 10,
    color: BLACK,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10,
    backgroundColor: BACKGROUND,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  temperature: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '15%',
  },
  weather: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%',
  },
  description: {
    height: 160,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '60%',
  },
  cameraButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: "#808080",
    borderRadius: 5,
    borderStyle: 'dashed',
    marginTop: 10,
    width: '40%',
  },
  galleryContainer: {
    borderWidth: 2, // Border width
    borderColor: 'blue', // Border color, you can change it to any color you like
    borderRadius: 10, // Border radius for rounded corners
    marginBottom: 20, // Space between FlatLists
    width: '100%', // Set the width of the FlatList container
    height: 220, // Set the height of the FlatList container
  },
  flatListContent: {
    paddingRight: 5, // Padding inside the FlatList to prevent images from touching the border
  },
  addButton: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 0.75,
    borderWidth: 2, // Border width
    borderColor: 'blue', // Border color, you can change it to any color you like
    borderRadius: 10, // Border radius for rounded corners
    width: 150, // Set the width of the button container
    height: "100%", // Set the height of the button container
    backgroundColor: '#f0f0f0',
  },
});

const images: Item[] = [
  { id: '1', src: fitpic },
  { id: '2', src: fitpic },
  { id: '3', src: fitpic },
  { id: '4', src: fitpic },
  { id: '5', src: fitpic },
  { id: '6', src: fitpic },
];
