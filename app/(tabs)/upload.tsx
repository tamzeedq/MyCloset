import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/lib/supabase';
import { Upload as UploadIcon, Image as ImageIcon, X } from 'lucide-react-native';
import { router } from 'expo-router';

export default function UploadScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedWeather, setSelectedWeather] = useState('');
  const [selectedTemperature, setSelectedTemperature] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera roll is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const addCustomTag = () => {
    if (tagInput.trim() && !customTags.includes(tagInput.trim())) {
      setCustomTags([...customTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(customTags.filter((t) => t !== tag));
  };

  const uploadOutfit = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert('Error', 'You must be logged in to upload outfits');
        return;
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('outfits')
        .upload(fileName, arrayBuffer, {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from('outfits').insert({
        user_id: user.id,
        image_url: `outfits/${fileName}`,
        title: title.trim(),
        weather: selectedWeather,
        temperature: selectedTemperature,
        feeling: selectedFeeling,
        season: selectedSeason,
        tags: customTags,
        notes: notes.trim(),
      });

      if (insertError) throw insertError;

      Alert.alert('Success', 'Outfit uploaded successfully!');
      resetForm();
      router.push('/(tabs)');
    } catch (error) {
      console.error('Error uploading outfit:', error);
      Alert.alert('Error', 'Failed to upload outfit. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setImageUri(null);
    setTitle('');
    setNotes('');
    setSelectedWeather('');
    setSelectedTemperature('');
    setSelectedFeeling('');
    setSelectedSeason('');
    setCustomTags([]);
    setTagInput('');
  };

  const renderOptionButton = (
    category: 'weather' | 'temperature' | 'feeling' | 'season',
    value: string,
    label: string
  ) => {
    const stateMap = {
      weather: selectedWeather,
      temperature: selectedTemperature,
      feeling: selectedFeeling,
      season: selectedSeason,
    };

    const setterMap = {
      weather: setSelectedWeather,
      temperature: setSelectedTemperature,
      feeling: setSelectedFeeling,
      season: setSelectedSeason,
    };

    const isSelected = stateMap[category] === value;

    return (
      <TouchableOpacity
        key={value}
        style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
        onPress={() => setterMap[category](isSelected ? '' : value)}>
        <Text
          style={[
            styles.optionButtonText,
            isSelected && styles.optionButtonTextSelected,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Upload Outfit</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {!imageUri ? (
          <View style={styles.imagePicker}>
            <ImageIcon size={64} color="#9ca3af" />
            <Text style={styles.imagePickerText}>Add a photo of your outfit</Text>
            <View style={styles.imagePickerButtons}>
              <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                <Text style={styles.imagePickerButtonText}>Choose from Library</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.imagePickerButton} onPress={takePhoto}>
                <Text style={styles.imagePickerButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setImageUri(null)}>
              <X size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Title (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Summer Casual"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#9ca3af"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Weather</Text>
          <View style={styles.optionsRow}>
            {['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy'].map((val) =>
              renderOptionButton('weather', val, val)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Temperature</Text>
          <View style={styles.optionsRow}>
            {['Hot', 'Warm', 'Mild', 'Cool', 'Cold'].map((val) =>
              renderOptionButton('temperature', val, val)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Feeling/Style</Text>
          <View style={styles.optionsRow}>
            {['Casual', 'Formal', 'Sporty', 'Elegant', 'Comfortable'].map((val) =>
              renderOptionButton('feeling', val, val)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Season</Text>
          <View style={styles.optionsRow}>
            {['Spring', 'Summer', 'Fall', 'Winter'].map((val) =>
              renderOptionButton('season', val, val)
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Custom Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag..."
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={addCustomTag}
              placeholderTextColor="#9ca3af"
            />
            <TouchableOpacity style={styles.addTagButton} onPress={addCustomTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          {customTags.length > 0 && (
            <View style={styles.customTagsContainer}>
              {customTags.map((tag) => (
                <View key={tag} style={styles.customTag}>
                  <Text style={styles.customTagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeCustomTag(tag)}>
                    <X size={14} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <TouchableOpacity
          style={[styles.uploadButton, uploading && styles.uploadButtonDisabled]}
          onPress={uploadOutfit}
          disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <>
              <UploadIcon size={20} color="#ffffff" />
              <Text style={styles.uploadButtonText}>Upload Outfit</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  imagePicker: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    marginBottom: 24,
    minHeight: 300,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
  },
  imagePickerButtons: {
    width: '100%',
    gap: 12,
  },
  imagePickerButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  imagePickerButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imagePreviewContainer: {
    position: 'relative',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePreview: {
    width: '100%',
    height: 400,
    backgroundColor: '#e5e7eb',
  },
  removeImageButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  optionButtonSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  optionButtonText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  optionButtonTextSelected: {
    color: '#ffffff',
  },
  tagInputContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  tagInput: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  addTagButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addTagButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  customTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  customTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  customTagText: {
    fontSize: 13,
    color: '#3730a3',
    fontWeight: '500',
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#2563eb',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  uploadButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});
