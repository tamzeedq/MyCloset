import { StatusBar } from 'expo-status-bar';
import { FlatList, Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { BACKGROUND, BLACK, GREY, WHITE } from '@/constants/Colors';
import React, { useMemo, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button, Image, Card, H2, Input, Paragraph, Select, styled, TextArea, XStack } from 'tamagui';
import fitpic from '@/assets/images/fitpic.jpg';

interface item {
  name: string;
};

const SubmitButton = styled(Button, {
  bg: BLACK,
  color: WHITE,
  hoverStyle: {
    bg: GREY,
  },
});

export default function ModalScreen() {
  const colorScheme = useColorScheme();

  const [entryName, setName] = useState('');
  const [entryDescription, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number>(10);
  const [weather, setWeather] = useState<string>("");
  const [items, setItems] = useState<item[]>([]);

  return (
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
      <Text style={styles.title}>Details</Text>
      <Select defaultValue="">
        <Select.Trigger>
          <Select.Value placeholder="Search..." />
        </Select.Trigger>
        <Select.Content>
          <Select.ScrollUpButton />
          <Select.Viewport>
            <Select.Group>
              <Select.Label>Fruits</Select.Label>
              {useMemo(() =>
                items.map((item, i) => (
                  <Select.Item
                    index={i}
                    key={item.name}
                    value={item.name.toLowerCase()}
                  >
                    <Select.ItemText>{item.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <FontAwesome name="check" />
                    </Select.ItemIndicator>
                  </Select.Item>
                )), [items])
              }
            </Select.Group>
          </Select.Viewport>
          <Select.ScrollDownButton />
        </Select.Content>
      </Select>
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
      <View style={styles.itemsContainer}>
        
      </View>
      <SubmitButton onPress={() => { /* Handle button press */ }}>
        Add
      </SubmitButton>
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: BACKGROUND,
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
});

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
  { name: 'Honeydew' },
  { name: 'Starfruit' },
  { name: 'Blueberry' },
  { name: 'Raspberry' },
  { name: 'Strawberry' },
  { name: 'Mango' },
  { name: 'Pineapple' },
  { name: 'Lime' },
  { name: 'Lemon' },
  { name: 'Coconut' },
  { name: 'Guava' },
  { name: 'Papaya' },
  { name: 'Orange' },
  { name: 'Grape' },
  { name: 'Jackfruit' },
  { name: 'Durian' },
];
