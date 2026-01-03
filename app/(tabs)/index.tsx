import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { supabase, Outfit } from '@/lib/supabase';
import { Filter, X } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const COLUMN_COUNT = 2;
const SPACING = 12;
const ITEM_WIDTH = (width - SPACING * (COLUMN_COUNT + 1)) / COLUMN_COUNT;

export default function GalleryScreen() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [filteredOutfits, setFilteredOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({
    weather: '',
    temperature: '',
    feeling: '',
    season: '',
  });

  const fetchOutfits = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setOutfits([]);
        setFilteredOutfits([]);
        return;
      }

      const { data, error } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setOutfits(data || []);
      setFilteredOutfits(data || []);
    } catch (error) {
      console.error('Error fetching outfits:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOutfits();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchOutfits();
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedFilters, outfits]);

  const applyFilters = () => {
    let filtered = [...outfits];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (outfit) =>
          outfit.title.toLowerCase().includes(query) ||
          outfit.notes.toLowerCase().includes(query) ||
          outfit.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedFilters.weather) {
      filtered = filtered.filter(
        (outfit) => outfit.weather.toLowerCase() === selectedFilters.weather.toLowerCase()
      );
    }

    if (selectedFilters.temperature) {
      filtered = filtered.filter(
        (outfit) => outfit.temperature.toLowerCase() === selectedFilters.temperature.toLowerCase()
      );
    }

    if (selectedFilters.feeling) {
      filtered = filtered.filter(
        (outfit) => outfit.feeling.toLowerCase() === selectedFilters.feeling.toLowerCase()
      );
    }

    if (selectedFilters.season) {
      filtered = filtered.filter(
        (outfit) => outfit.season.toLowerCase() === selectedFilters.season.toLowerCase()
      );
    }

    setFilteredOutfits(filtered);
  };

  const toggleFilter = (category: keyof typeof selectedFilters, value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? '' : value,
    }));
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      weather: '',
      temperature: '',
      feeling: '',
      season: '',
    });
    setSearchQuery('');
  };

  const hasActiveFilters =
    searchQuery.trim() ||
    Object.values(selectedFilters).some((val) => val !== '');

  const renderOutfitItem = ({ item }: { item: Outfit }) => {
    const imageUrl = item.image_url.startsWith('http')
      ? item.image_url
      : `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${item.image_url}`;

    return (
      <TouchableOpacity style={styles.outfitCard}>
        <Image source={{ uri: imageUrl }} style={styles.outfitImage} />
        {item.title ? (
          <Text style={styles.outfitTitle} numberOfLines={1}>
            {item.title}
          </Text>
        ) : null}
        <View style={styles.tagContainer}>
          {item.weather ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.weather}</Text>
            </View>
          ) : null}
          {item.temperature ? (
            <View style={styles.tag}>
              <Text style={styles.tagText}>{item.temperature}</Text>
            </View>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderFilterChip = (
    category: keyof typeof selectedFilters,
    label: string,
    value: string
  ) => {
    const isSelected = selectedFilters[category] === value;
    return (
      <TouchableOpacity
        key={value}
        style={[styles.filterChip, isSelected && styles.filterChipSelected]}
        onPress={() => toggleFilter(category, value)}>
        <Text
          style={[
            styles.filterChipText,
            isSelected && styles.filterChipTextSelected,
          ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Outfits</Text>
        <TouchableOpacity
          onPress={() => setShowFilters(!showFilters)}
          style={styles.filterButton}>
          <Filter size={24} color="#2563eb" />
          {hasActiveFilters && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search outfits..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {showFilters && (
        <ScrollView
          style={styles.filtersContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Weather</Text>
            <View style={styles.filterChipsRow}>
              {['Sunny', 'Rainy', 'Cloudy', 'Snowy', 'Windy'].map((val) =>
                renderFilterChip('weather', val, val)
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Temperature</Text>
            <View style={styles.filterChipsRow}>
              {['Hot', 'Warm', 'Mild', 'Cool', 'Cold'].map((val) =>
                renderFilterChip('temperature', val, val)
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Feeling</Text>
            <View style={styles.filterChipsRow}>
              {['Casual', 'Formal', 'Sporty', 'Elegant', 'Comfortable'].map(
                (val) => renderFilterChip('feeling', val, val)
              )}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Season</Text>
            <View style={styles.filterChipsRow}>
              {['Spring', 'Summer', 'Fall', 'Winter'].map((val) =>
                renderFilterChip('season', val, val)
              )}
            </View>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearFiltersButton}
              onPress={clearAllFilters}>
              <X size={16} color="#ef4444" />
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}

      {filteredOutfits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {outfits.length === 0
              ? 'No outfits yet. Start by uploading your first outfit!'
              : 'No outfits match your filters.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredOutfits}
          renderItem={renderOutfitItem}
          keyExtractor={(item) => item.id}
          numColumns={COLUMN_COUNT}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  filterButton: {
    position: 'relative',
    padding: 8,
  },
  filterDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  filtersContainer: {
    maxHeight: 320,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  filterChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextSelected: {
    color: '#ffffff',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    marginTop: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#ef4444',
    fontWeight: '600',
  },
  listContent: {
    padding: SPACING,
  },
  columnWrapper: {
    gap: SPACING,
    marginBottom: SPACING,
  },
  outfitCard: {
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
  outfitImage: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH * 1.3,
    backgroundColor: '#e5e7eb',
  },
  outfitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    padding: 10,
    paddingTop: 4,
  },
  tag: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#3730a3',
    fontWeight: '500',
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
    lineHeight: 24,
  },
});
