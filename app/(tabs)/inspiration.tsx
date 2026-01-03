import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import { Search } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_WIDTH = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

interface PexelsPhoto {
  id: number;
  src: {
    medium: string;
    large: string;
  };
  photographer: string;
  url: string;
}

export default function InspirationScreen() {
  const [searchQuery, setSearchQuery] = useState('fashion outfit');
  const [photos, setPhotos] = useState<PexelsPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPhotos = async (query: string = searchQuery) => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=30`,
        {
          headers: {
            Authorization: 'YOUR_PEXELS_API_KEY',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch photos');
      }

      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (err) {
      setError('Unable to load inspiration photos. Please try again.');
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    searchPhotos();
  };

  const openPhotoUrl = (url: string) => {
    Linking.openURL(url);
  };

  const renderPhotoItem = ({ item }: { item: PexelsPhoto }) => (
    <TouchableOpacity
      style={styles.photoCard}
      onPress={() => openPhotoUrl(item.url)}>
      <Image source={{ uri: item.src.medium }} style={styles.photoImage} />
      <View style={styles.photoOverlay}>
        <Text style={styles.photographerText} numberOfLines={1}>
          by {item.photographer}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSuggestionChip = (label: string, query: string) => (
    <TouchableOpacity
      key={query}
      style={styles.suggestionChip}
      onPress={() => {
        setSearchQuery(query);
        searchPhotos(query);
      }}>
      <Text style={styles.suggestionText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inspiration</Text>
        <Text style={styles.headerSubtitle}>Find outfit ideas and styles</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#6b7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for outfit ideas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#9ca3af"
          />
        </View>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionsLabel}>Popular Searches:</Text>
        <View style={styles.suggestionsRow}>
          {renderSuggestionChip('Summer Outfits', 'summer fashion outfit')}
          {renderSuggestionChip('Casual Style', 'casual outfit style')}
          {renderSuggestionChip('Formal Wear', 'formal outfit elegant')}
          {renderSuggestionChip('Streetwear', 'streetwear fashion')}
          {renderSuggestionChip('Winter Fashion', 'winter outfit cozy')}
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Finding inspiration...</Text>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.errorSubtext}>
            Note: To use the Pexels API, you need to add your API key in the code.
          </Text>
        </View>
      )}

      {!loading && !error && photos.length === 0 && (
        <View style={styles.emptyContainer}>
          <Search size={64} color="#d1d5db" />
          <Text style={styles.emptyText}>
            Search for outfit inspiration to get started
          </Text>
        </View>
      )}

      {!loading && photos.length > 0 && (
        <FlatList
          data={photos}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  suggestionsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  suggestionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e0e7ff',
    borderWidth: 1,
    borderColor: '#c7d2fe',
  },
  suggestionText: {
    fontSize: 13,
    color: '#3730a3',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 24,
  },
  listContent: {
    padding: SPACING,
  },
  columnWrapper: {
    gap: SPACING,
    marginBottom: SPACING,
  },
  photoCard: {
    width: ITEM_WIDTH,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  photoImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    backgroundColor: '#e5e7eb',
  },
  photoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  photographerText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '500',
  },
});
