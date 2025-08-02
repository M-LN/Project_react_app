import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const BOARDS_STORAGE_KEY = '@project_dashboard_boards';
const defaultBoards = [
  { id: '1', name: 'Personal' },
  { id: '2', name: 'Work' },
  { id: '3', name: 'Ideas' },
];

const BoardSelectScreen = () => {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadBoards = async () => {
      try {
        const boardsJson = await AsyncStorage.getItem(BOARDS_STORAGE_KEY);
        if (boardsJson) {
          setBoards(JSON.parse(boardsJson));
        } else {
          setBoards(defaultBoards);
        }
      } catch (error) {
        setBoards(defaultBoards);
      } finally {
        setLoading(false);
      }
    };
    loadBoards();
  }, []);

  const handleSelectBoard = (board) => {
    navigation.replace('MainTabs', {
      screen: 'Board',
      params: { boardId: board.id, boardName: board.name }
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Ionicons name="rocket-outline" size={56} color="#2196F3" style={{ marginBottom: 8 }} />
      </View>
      <Text style={styles.welcome}>Welcome to Your Project Dashboard!</Text>
      <Text style={styles.tagline}>Your personal Kanban for every idea, task, and goal.</Text>
      <Text style={styles.description}>
        Organize your tasks and ideas into boards. Each board is a workspace for your personal, work, or creative projects.
      </Text>
      <View style={styles.onboardingBox}>
        <Ionicons name="bulb-outline" size={22} color="#FF9800" style={{ marginRight: 6 }} />
        <Text style={styles.onboardingTip}>Tip: Tap a board to open it, or create a new board from the Boards tab.</Text>
      </View>
      <Text style={styles.title}>Select a Board</Text>
      <FlatList
        data={boards}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.boardItem} onPress={() => handleSelectBoard(item)}>
            <Ionicons name="grid-outline" size={22} color="#2196F3" style={{ marginRight: 8 }} />
            <Text style={styles.boardName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Text style={styles.quote}>
        "Productivity is never an accident. It is always the result of a commitment to excellence, intelligent planning, and focused effort."
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  logoBox: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 17,
    color: '#2196F3',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '600',
  },
  onboardingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginHorizontal: 12,
  },
  onboardingTip: {
    fontSize: 15,
    color: '#666',
    textAlign: 'left',
    flex: 1,
  },
  quote: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 8,
    marginHorizontal: 24,
    fontStyle: 'italic',
  },
  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2196F3',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    marginBottom: 8,
    marginHorizontal: 12,
  },
  instructions: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    marginHorizontal: 12,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 24,
    textAlign: 'center',
    color: '#2196F3',
  },
  boardItem: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    alignItems: 'center',
  },
  boardName: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
});

export default BoardSelectScreen;
