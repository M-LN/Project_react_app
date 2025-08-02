import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const theme = getTheme();
const responsive = getResponsiveDimensions();

const BOARDS_STORAGE_KEY = '@project_dashboard_boards';
const defaultBoards = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
  { id: '3', name: 'Ideas' },
];

const BoardsScreen = () => {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsJson = await AsyncStorage.getItem(BOARDS_STORAGE_KEY);
        if (boardsJson) {
          setBoards(JSON.parse(boardsJson));
        } else {
          setBoards(defaultBoards);
          await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(defaultBoards));
        }
      } catch (error) {
        setBoards(defaultBoards);
      }
    };
    loadBoards();
  }, []);

  const saveBoards = async (updatedBoards) => {
    setBoards(updatedBoards);
    await AsyncStorage.setItem(BOARDS_STORAGE_KEY, JSON.stringify(updatedBoards));
  };

  const handleBoardPress = (board) => {
    navigation.navigate('Board', { boardId: board.id, boardName: board.name });
  };

  const handleAddBoard = async () => {
    const name = newBoardName.trim();
    if (!name) {
      Alert.alert('Error', 'Board name cannot be empty');
      return;
    }
    const newBoard = { id: Date.now().toString(), name };
    const updatedBoards = [...boards, newBoard];
    await saveBoards(updatedBoards);
    setNewBoardName('');
  };

  const handleDeleteBoard = async (boardId) => {
    Alert.alert('Delete Board', 'Are you sure you want to delete this board?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const updatedBoards = boards.filter(b => b.id !== boardId);
          await saveBoards(updatedBoards);
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.header, { color: theme.colors.text }]}>Boards Overview</Text>
        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>Manage your projects by organizing them into boards. All changes are automatically synced to the cloud and updated in realtime.</Text>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

        <View style={styles.addBoardContainer}>
          <TextInput
            style={[styles.input, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text 
            }]}
            value={newBoardName}
            onChangeText={setNewBoardName}
            placeholder="New board name"
            placeholderTextColor={theme.colors.textSecondary}
          />
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddBoard}>
            <Ionicons name="add-circle" size={responsive.isSmallPhone ? 18 : 20} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.addButtonText}>Add Board</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>Tip: Swipe left to delete a board you no longer need.</Text>
        <FlatList
          data={boards}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.boardRow}>
              <TouchableOpacity style={[styles.boardItem, { backgroundColor: theme.colors.surface }]} onPress={() => handleBoardPress(item)}>
                <Ionicons name="grid-outline" size={responsive.isSmallPhone ? 18 : 20} color={theme.colors.primary} style={{ marginRight: 8 }} />
                <Text style={[styles.boardName, { color: theme.colors.text }]}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteButton, { backgroundColor: theme.colors.error }]} onPress={() => handleDeleteBoard(item.id)}>
                <Ionicons name="trash-outline" size={responsive.isSmallPhone ? 14 : 16} color="#fff" style={{ marginRight: 2 }} />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsive.spacing.md,
    paddingTop: responsive.spacing.md,
    backgroundColor: theme.colors.background,
  },
  header: {
    fontSize: responsive.isSmallPhone ? 20 : 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: responsive.spacing.sm,
  },
  description: {
    fontSize: responsive.isSmallPhone ? 13 : 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: responsive.spacing.md,
    paddingHorizontal: responsive.spacing.sm,
  },
  divider: {
    height: 1,
    marginVertical: responsive.spacing.md,
  },
  hint: {
    fontSize: responsive.isSmallPhone ? 11 : 12,
    textAlign: 'center',
    marginBottom: responsive.spacing.md,
    fontStyle: 'italic',
  },
  addBoardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.spacing.md,
  },
  input: {
    flex: 1,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    fontSize: responsive.isSmallPhone ? 14 : 15,
    marginRight: responsive.spacing.sm,
    borderWidth: 1,
  },
  addButton: {
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    borderRadius: theme.borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.isSmallPhone ? 13 : 14,
    marginLeft: 4,
  },
  boardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: responsive.spacing.md,
  },
  boardItem: {
    flex: 1,
    padding: responsive.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginRight: responsive.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    ...theme.shadows.sm,
  },
  boardName: {
    fontSize: responsive.isSmallPhone ? 15 : 16,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.isSmallPhone ? 11 : 12,
    marginLeft: 2,
  },
});

export default BoardsScreen;
