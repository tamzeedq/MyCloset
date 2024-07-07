import { StatusBar } from 'expo-status-bar';
import { Platform, Pressable, StyleSheet, TextInput } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import React, { useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ModalScreen() {
  const colorScheme = useColorScheme();

  const [entryName, setName] = useState('');
  const [entryDescription, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add new Outfit/Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Outfit / Item Name"
      />
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
      }}>
        <Pressable style={styles.cameraButton}>
          <FontAwesome
            name="camera"
            size={25}
            color="#808080"
          />
          <Text>Add Image</Text>
        </Pressable>
        <TextInput
          style={styles.description}
          placeholder="Description"
        />
      </View>
      <Text style={styles.title}>Details</Text>
      <Picker
        style={styles.input}
        // selectedValue={selectedLanguage}
        onValueChange={(itemValue, itemIndex) => {}}
        >
        <Picker.Item label="Java" value="java" />
        <Picker.Item label="JavaScript" value="js" />
        <Picker.Item label="Python" value="python" />
        <Picker.Item label="C++" value="c++" />
      </Picker>
      <Text style={styles.title}>Weather</Text>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
      }}>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          placeholder='Temperature'
        />
        <TextInput
          style={styles.input}
          placeholder='Weather Description'
        />
      </View>
      <Text style={styles.title}>Items</Text>

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // alignItems: 'center',
    // justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
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
