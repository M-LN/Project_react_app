import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const theme = getTheme();
const responsive = getResponsiveDimensions();

const SearchBar = ({ onSearch, onFilter, placeholder = "Search tasks..." }) => {
  const [searchText, setSearchText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  const handleSearchChange = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    setIsExpanded(!isExpanded);
    
    Animated.timing(animatedValue, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const clearSearch = () => {
    setSearchText('');
    onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Ionicons name="search" size={responsive.isSmallPhone ? 16 : 18} color={theme.colors.textSecondary} style={styles.searchIcon} />
        
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.textSecondary}
          value={searchText}
          onChangeText={handleSearchChange}
          returnKeyType="search"
        />
        
        {searchText.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={responsive.isSmallPhone ? 16 : 18} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={toggleExpanded} style={styles.filterButton}>
          <Ionicons 
            name={isExpanded ? "options" : "filter"} 
            size={responsive.isSmallPhone ? 16 : 18} 
            color={theme.colors.primary} 
          />
        </TouchableOpacity>
      </View>
      
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            height: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 120],
            }),
            opacity: animatedValue,
          }
        ]}
      >
        <View style={styles.filterRow}>
          <FilterChip title="High Priority" onPress={() => onFilter('priority', 'high')} />
          <FilterChip title="Due Today" onPress={() => onFilter('dueDate', 'today')} />
          <FilterChip title="Overdue" onPress={() => onFilter('dueDate', 'overdue')} />
        </View>
        
        <View style={styles.filterRow}>
          <FilterChip title="To Do" onPress={() => onFilter('status', 'todo')} />
          <FilterChip title="In Progress" onPress={() => onFilter('status', 'inprogress')} />
          <FilterChip title="Done" onPress={() => onFilter('status', 'done')} />
        </View>
        
        <TouchableOpacity 
          style={styles.clearFiltersButton}
          onPress={() => onFilter('clear', null)}
        >
          <Ionicons name="refresh" size={16} color={theme.colors.primary} />
          <Text style={[styles.clearFiltersText, { color: theme.colors.primary }]}>
            Clear Filters
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const FilterChip = ({ title, onPress, isActive = false }) => {
  return (
    <TouchableOpacity 
      style={[
        styles.chip,
        { 
          backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
          borderColor: isActive ? theme.colors.primary : theme.colors.border,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.chipText,
        { color: isActive ? '#fff' : theme.colors.text }
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: responsive.isSmallPhone ? 8 : 12, // Reduced margins
    marginVertical: responsive.isSmallPhone ? 4 : 6,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.isSmallPhone ? 10 : 12, // Smaller padding
    paddingVertical: responsive.isSmallPhone ? 8 : 10,
    borderRadius: 10,
    ...theme.shadows.sm,
  },
  searchIcon: {
    marginRight: responsive.isSmallPhone ? 8 : 10, // Smaller margin
  },
  searchInput: {
    flex: 1,
    fontSize: responsive.isSmallPhone ? 14 : 15, // Smaller font
    height: responsive.isSmallPhone ? 20 : 22, // Smaller height
  },
  clearButton: {
    marginLeft: responsive.isSmallPhone ? 6 : 8, // Smaller margin
  },
  filterButton: {
    marginLeft: responsive.isSmallPhone ? 8 : 10, // Smaller margin
    padding: responsive.isSmallPhone ? 2 : 4,
  },
  filterContainer: {
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    borderRadius: 10,
    marginTop: responsive.isSmallPhone ? 4 : 6, // Smaller margin
    paddingHorizontal: responsive.isSmallPhone ? 10 : 12, // Smaller padding
    ...theme.shadows.sm,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: responsive.isSmallPhone ? 4 : 6, // Smaller margin
  },
  chip: {
    paddingHorizontal: responsive.isSmallPhone ? 8 : 10, // Smaller padding
    paddingVertical: responsive.isSmallPhone ? 4 : 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  chipText: {
    fontSize: responsive.isSmallPhone ? 10 : 11, // Smaller text
    fontWeight: '500',
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default SearchBar;
