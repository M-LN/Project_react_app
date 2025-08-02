import { saveTaskToCloud, loadTasksFromCloud } from '../utils/TaskCloudStorage';
import { auth } from '../utils/firebase';
import OfflineStatus from '../components/OfflineStatus';
import SearchBar from '../components/SearchBar';
import FloatingActionButton from '../components/FloatingActionButton';
import QuickActionsModal from '../components/QuickActionsModal';
import React, { useState, useEffect, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import KanbanColumn from '../components/KanbanColumn';
import { TaskStorage } from '../utils/TaskStorage';
import { useTasks } from '../utils/TaskContext';
import { sendTaskUpdateNotification } from '../utils/notifications';
import { 
  trackScreenView, 
  trackBoardOpened, 
  trackTaskMoved, 
  trackCloudSync 
} from '../utils/analytics';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const { width } = Dimensions.get('window');
const theme = getTheme();
const responsive = getResponsiveDimensions();

const BoardScreen = ({ navigation, route }) => {
  // Cloud sync state
  const [syncStatus, setSyncStatus] = useState('');
  const [cloudError, setCloudError] = useState(null);
  
  // UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Get authenticated user ID for cloud sync
  const getCurrentUserId = () => {
    return auth.currentUser?.uid || null;
  };

  // Save all tasks for this board to Firestore
  const handleCloudSaveTasks = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setSyncStatus('Authentication required');
      setCloudError('Please sign in to sync tasks');
      setTimeout(() => setSyncStatus(''), 2000);
      return;
    }

    setSyncStatus('Saving tasks to cloud...');
    setCloudError(null);
    try {
      const promises = tasks.map(task => saveTaskToCloud(userId, boardId, task));
      await Promise.all(promises);
      setSyncStatus('Tasks saved to cloud!');
    } catch (error) {
      setSyncStatus('Cloud save failed');
      setCloudError(error.message);
    }
    setTimeout(() => setSyncStatus(''), 2000);
  };

  // Load all tasks for this board from Firestore
  const handleCloudLoadTasks = async () => {
    const userId = getCurrentUserId();
    if (!userId) {
      setSyncStatus('Authentication required');
      setCloudError('Please sign in to sync tasks');
      setTimeout(() => setSyncStatus(''), 2000);
      return;
    }

    setSyncStatus('Loading tasks from cloud...');
    setCloudError(null);
    const result = await loadTasksFromCloud(userId, boardId);
    if (result.success) {
      setTasksByBoard(prev => ({ ...prev, [boardId]: result.tasks }));
      setSyncStatus('Tasks loaded from cloud!');
    } else {
      setSyncStatus('Cloud load failed');
      setCloudError(result.error?.message || 'Unknown error');
    }
    setTimeout(() => setSyncStatus(''), 2000);
  };
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const boardId = route?.params?.boardId || '1';
  const boardName = route?.params?.boardName || 'Default Board';
  const { tasksByBoard, setTasksByBoard, syncStatus: globalSyncStatus } = useTasks();
  const tasks = tasksByBoard[boardId] || [];

  const columnConfig = [
    { key: 'todo', title: 'To Do', color: '#FF9800' },
    { key: 'inprogress', title: 'In Progress', color: '#2196F3' },
    { key: 'done', title: 'Done', color: '#4CAF50' },
  ];

  const loadTasks = async () => {
    try {
      const loadedTasks = await TaskStorage.loadTasks(boardId);
      setTasksByBoard(prev => ({
        ...prev,
        [boardId]: loadedTasks,
      }));
    } catch (error) {
      console.error('Error loading tasks:', error);
      Alert.alert('Error', 'Failed to load tasks');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // Track screen view and board opened
      trackScreenView('BoardScreen');
      trackBoardOpened(boardId, boardName);
      loadTasks();
    }, [boardId, boardName])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTasks();
  };

  const handleTaskPress = (task) => {
    navigation.navigate('TaskDetail', { task, boardId });
  };

  const handleDragEnd = async (reorderedTasks, newStatus) => {
    try {
      // Check which tasks are actually changing status before updating
      const tasksChangingStatus = reorderedTasks.filter(task => task.status !== newStatus);
      
      // Update the status of moved tasks
      const updatedTasks = reorderedTasks.map(task => ({
        ...task,
        status: newStatus,
      }));

      // Get tasks from other columns
      const otherTasks = tasks.filter(task => task.status !== newStatus);

      // Combine all tasks
      const allTasks = [...otherTasks, ...updatedTasks];

      setTasksByBoard(prev => ({
        ...prev,
        [boardId]: allTasks,
      }));
      await TaskStorage.saveTasks(boardId, allTasks);

      // Send notification for status change (only for tasks that actually changed)
      if (tasksChangingStatus.length > 0) {
        const statusLabels = {
          'todo': 'To Do',
          'inprogress': 'In Progress',
          'done': 'Completed'
        };
        
        for (const task of tasksChangingStatus) {
          await sendTaskUpdateNotification(
            task.title || 'Task',
            `Task moved to ${statusLabels[newStatus] || newStatus}`
          );
        }
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleMoveTask = async (task, direction) => {
    try {
      let newStatus;
      
      if (direction === 'left') {
        if (task.status === 'inprogress') {
          newStatus = 'todo';
        } else if (task.status === 'done') {
          newStatus = 'inprogress';
        }
      } else if (direction === 'right') {
        if (task.status === 'todo') {
          newStatus = 'inprogress';
        } else if (task.status === 'inprogress') {
          newStatus = 'done';
        }
      }

      if (newStatus && newStatus !== task.status) {
        // Track task movement
        trackTaskMoved(task.status, newStatus, 'button');
        
        // Update the task status
        const updatedTasks = tasks.map(t => 
          t.id === task.id ? { ...t, status: newStatus } : t
        );

        setTasksByBoard(prev => ({
          ...prev,
          [boardId]: updatedTasks,
        }));
        
        await TaskStorage.saveTasks(boardId, updatedTasks);

        // Send notification
        const statusLabels = {
          'todo': 'To Do',
          'inprogress': 'In Progress',
          'done': 'Completed'
        };
        
        await sendTaskUpdateNotification(
          task.title || 'Task',
          `Task moved to ${statusLabels[newStatus] || newStatus}`
        );
      }
    } catch (error) {
      console.error('Error moving task:', error);
      Alert.alert('Error', 'Failed to move task');
    }
  };

  // Filter and search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    filterTasks(query, activeFilters);
  };

  const handleFilter = (filterType, filterValue) => {
    let newFilters = { ...activeFilters };
    
    if (filterType === 'clear') {
      newFilters = {};
    } else {
      newFilters[filterType] = filterValue;
    }
    
    setActiveFilters(newFilters);
    filterTasks(searchQuery, newFilters);
  };

  const filterTasks = (query, filters) => {
    let filtered = [...tasks];
    
    // Apply search query
    if (query.trim()) {
      const lowercaseQuery = query.toLowerCase();
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(lowercaseQuery) ||
        task.description?.toLowerCase().includes(lowercaseQuery) ||
        task.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    }
    
    // Apply filters
    Object.entries(filters).forEach(([type, value]) => {
      switch (type) {
        case 'status':
          filtered = filtered.filter(task => task.status === value);
          break;
        case 'priority':
          filtered = filtered.filter(task => task.priority === value);
          break;
        case 'dueDate':
          if (value === 'today') {
            const today = new Date().toDateString();
            filtered = filtered.filter(task => 
              task.dueDate && new Date(task.dueDate).toDateString() === today
            );
          } else if (value === 'overdue') {
            const now = new Date();
            filtered = filtered.filter(task => 
              task.dueDate && new Date(task.dueDate) < now && task.status !== 'done'
            );
          }
          break;
      }
    });
    
    setFilteredTasks(filtered);
  };

  // Update filtered tasks when tasks change
  useEffect(() => {
    filterTasks(searchQuery, activeFilters);
  }, [tasks, searchQuery, activeFilters]);

  // Quick actions handler
  const handleQuickAction = (actionId) => {
    switch (actionId) {
      case 'new-task':
        navigation.navigate('TaskDetail', { boardId });
        break;
      case 'new-board':
        navigation.navigate('Boards');
        break;
      case 'quick-note':
        navigation.navigate('TaskDetail', { 
          boardId, 
          task: { 
            title: 'Quick Note', 
            description: '', 
            priority: 'low' 
          } 
        });
        break;
      case 'template':
        // Show template selection
        Alert.alert('Templates', 'Template functionality coming soon!');
        break;
      case 'scan':
        Alert.alert('Scan Document', 'Document scanning coming soon!');
        break;
      case 'voice-note':
        Alert.alert('Voice Note', 'Voice memo functionality coming soon!');
        break;
    }
  };

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleAddTask = () => {
    navigation.navigate('TaskDetail', { 
      task: null, 
      boardId
    });
  };

  const getStatsText = () => {
    const todoCount = getTasksByStatus('todo').length;
    const inProgressCount = getTasksByStatus('inprogress').length;
    const doneCount = getTasksByStatus('done').length;
    const total = tasks.length;
    
    if (total === 0) return 'No tasks yet - add your first task!';
    
    const completionRate = total > 0 ? Math.round((doneCount / total) * 100) : 0;
    return `${total} total tasks • ${completionRate}% completed`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="hourglass-outline" size={32} color="#2196F3" style={{ marginBottom: 12 }} />
        <Text style={styles.loadingText}>Loading your tasks...</Text>
      </View>
    );
  }

  // Get current tasks to display (filtered or all)
  const currentTasks = searchQuery || Object.keys(activeFilters).length > 0 ? filteredTasks : tasks;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]} edges={["top","left","right"]}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {/* Search and Filter Bar */}
        <SearchBar 
          onSearch={handleSearch}
          onFilter={handleFilter}
          placeholder="Search tasks across all columns..."
        />

        {/* Sync status indicator and offline status */}
        <View style={styles.syncContainer}>
          <View style={styles.syncIconContainer}>
            <Ionicons 
              name={globalSyncStatus && globalSyncStatus.includes('Synced') ? "cloud-done-outline" : "cloud-outline"} 
              size={responsive.isSmallPhone ? 16 : 18} 
              color={globalSyncStatus && globalSyncStatus.includes('Synced') ? theme.colors.success : theme.colors.primary} 
            />
          </View>
          <Text style={[styles.syncText, { 
            color: globalSyncStatus && globalSyncStatus.includes('Synced') ? theme.colors.success : theme.colors.primary 
          }]}>
            {globalSyncStatus || 'Sync status unavailable'}
          </Text>
          <OfflineStatus />
        </View>
        {/* Cloud sync buttons removed as requested */}
        {syncStatus ? <Text style={[styles.syncStatus, { color: theme.colors.textSecondary }]}>{syncStatus}</Text> : null}
        {cloudError ? <Text style={{ color: theme.colors.error, textAlign: 'center', marginBottom: 8 }}>{cloudError}</Text> : null}
        <Text style={[styles.appHeader, { color: theme.colors.text }]}>Project Dashboard</Text>
        <Text style={[styles.appDescription, { color: theme.colors.textSecondary }]}>Organize tasks • Drag to update status</Text>
        
        <View style={styles.header}>
          <Text style={[styles.statsText, { color: theme.colors.text }]}>{getStatsText()}</Text>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: theme.colors.primary }]} onPress={handleAddTask}>
            <Ionicons name="add-circle" size={responsive.isSmallPhone ? 16 : 18} color="#fff" style={{ marginRight: 4 }} />
            <Text style={styles.addButtonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
        
        <Text style={[styles.boardTitle, { color: theme.colors.text }]}>Board: {boardName}</Text>
        {(searchQuery || Object.keys(activeFilters).length > 0) && (
          <Text style={[styles.filterStatus, { color: theme.colors.textSecondary }]}>
            Showing {currentTasks.length} of {tasks.length} tasks
          </Text>
        )}
        <Text style={[styles.hint, { color: theme.colors.textSecondary }]}>Tip: Use arrow buttons to move tasks</Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true} // Show indicator on mobile
          contentContainerStyle={styles.boardContainer}
          style={styles.boardScrollView}
          decelerationRate="fast" // Better scrolling on mobile
          snapToInterval={responsive.columnWidth + responsive.columnMargin * 2} // Snap to columns
          snapToAlignment="start"
          bounces={false} // Prevent over-scrolling for better UX
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {columnConfig.map((column) => (
            <KanbanColumn
              key={column.key}
              title={column.title}
              tasks={currentTasks.filter(task => task.status === column.key)}
              status={column.key}
              statusColor={column.color}
              onTaskPress={handleTaskPress}
              onDragEnd={handleDragEnd}
              onMoveTask={handleMoveTask}
            />
          ))}
        </ScrollView>
        
        {tasks.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="rocket-outline" size={40} color={theme.colors.primary} style={{ marginBottom: 16 }} />
            <Text style={[styles.emptyStateTitle, { color: theme.colors.text }]}>Welcome to your Project Dashboard!</Text>
            <Text style={[styles.emptyStateSubtitle, { color: theme.colors.textSecondary }]}>
              Start by adding your first task to organize your projects.
            </Text>
            <TouchableOpacity style={styles.emptyStateButton} onPress={handleAddTask}>
              <Ionicons name="add-circle" size={20} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.emptyStateButtonText}>Create Your First Task</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Floating Action Button */}
      <FloatingActionButton 
        onPress={() => setShowQuickActions(true)}
        icon="menu"
      />
      
      {/* Quick Actions Modal */}
      <QuickActionsModal
        visible={showQuickActions}
        onClose={() => setShowQuickActions(false)}
        onAction={handleQuickAction}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsive.isSmallPhone ? 4 : 6, // Minimal padding for more space
    paddingTop: 4, // Minimal top padding
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs, // Reduced spacing
    paddingHorizontal: theme.spacing.xs,
  },
  statsText: {
    fontSize: responsive.isSmallPhone ? 12 : 13, // Smaller stats text
    fontWeight: '600',
    flex: 1,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.isSmallPhone ? 8 : 12, // Smaller button
    paddingVertical: responsive.isSmallPhone ? 6 : 8,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: responsive.isSmallPhone ? 12 : 13, // Smaller button text
  },
  boardTitle: {
    fontSize: responsive.isSmallPhone ? 14 : 15, // Much smaller board title
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4, // Minimal margin
    paddingHorizontal: theme.spacing.sm,
  },
  filterStatus: {
    fontSize: responsive.isSmallPhone ? 10 : 11, // Tiny filter status text
    fontStyle: 'italic',
    marginBottom: 2, // Minimal margin
    textAlign: 'center',
    paddingHorizontal: theme.spacing.sm,
  },
  hint: {
    fontSize: responsive.isSmallPhone ? 10 : 11, // Tiny hint text
    textAlign: 'center',
    marginBottom: theme.spacing.xs, // Minimal margin
    lineHeight: 12,
    paddingHorizontal: theme.spacing.md,
  },
  boardContainer: {
    paddingBottom: theme.spacing.xl, // Increased bottom padding to account for higher tab bar
    paddingHorizontal: theme.spacing.xs,
    alignItems: 'flex-start',
    minHeight: responsive.minColumnHeight, // Ensure container is tall enough
  },
  boardScrollView: {
    flex: 1,
    backgroundColor: 'transparent', // Ensure no background conflicts
    paddingBottom: theme.spacing.sm, // Additional padding for tab bar clearance
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.xxl,
    marginTop: theme.spacing.xl,
  },
  emptyStateTitle: {
    ...theme.typography.h2,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyStateSubtitle: {
    ...theme.typography.body,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: theme.spacing.xl,
  },
  appHeader: {
    fontSize: responsive.isSmallPhone ? 16 : 18, // Much smaller header
    fontWeight: '600',
    textAlign: 'center',
    marginTop: theme.spacing.xs, // Minimal margin
    marginBottom: 2,
  },
  appDescription: {
    fontSize: responsive.isSmallPhone ? 11 : 12, // Very small description
    textAlign: 'center',
    marginBottom: theme.spacing.xs, // Minimal margin
    lineHeight: 14,
    paddingHorizontal: theme.spacing.sm,
  },
  syncContainer: {
    alignItems: 'center',
    paddingVertical: responsive.isSmallPhone ? 4 : 6, // Much smaller padding
    marginBottom: 4, // Minimal margin
  },
  syncIconContainer: {
    marginBottom: 2, // Minimal margin
  },
  syncText: {
    fontSize: responsive.isSmallPhone ? 10 : 11, // Smaller sync text
    fontWeight: '600',
    marginBottom: 2, // Minimal margin
  },
});

export default BoardScreen;
