import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import TaskCard from './TaskCard';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const { width, height } = Dimensions.get('window');
const theme = getTheme();
const responsive = getResponsiveDimensions();

const KanbanColumn = ({ 
  title, 
  tasks, 
  status, 
  onTaskPress, 
  onDragEnd, 
  statusColor,
  onMoveTask 
}) => {
  const renderTaskItem = ({ item, drag, isActive }) => (
    <TaskCard
      task={item}
      onPress={() => onTaskPress(item)}
      isDragging={isActive}
      onLongPress={drag}
      showMoveButtons={true}
      onMoveTask={onMoveTask}
    />
  );

  return (
    <View style={[styles.column, { 
      borderTopColor: statusColor,
    }]}>
      <View style={[styles.header, { backgroundColor: statusColor }]}>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={styles.taskCountBadge}>
          <Text style={styles.taskCount}>{tasks.length}</Text>
        </View>
      </View>
      
      <View style={styles.taskList}>
        <DraggableFlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={(item) => item.id}
          onDragEnd={({ data }) => onDragEnd(data, status)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            tasks.length === 0 && styles.emptyListContent
          ]}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                No tasks yet
              </Text>
              <Text style={[styles.emptySubtext, { color: theme.colors.textTertiary }]}>
                Drag tasks here or add a new one
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    width: responsive.columnWidth,
    minHeight: responsive.minColumnHeight,
    maxHeight: responsive.maxColumnHeight,
    borderRadius: theme.borderRadius.md,
    marginHorizontal: responsive.columnMargin,
    marginVertical: responsive.spacing.xs,
    borderTopWidth: 3, // Reduced from 4 to prevent visual clutter
    backgroundColor: theme.colors.surface,
    // Reduced shadow to prevent layering issues
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Reduced elevation for Android
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsive.spacing.md,
    paddingVertical: responsive.spacing.sm,
    borderTopLeftRadius: theme.borderRadius.md,
    borderTopRightRadius: theme.borderRadius.md,
    minHeight: responsive.headerHeight,
  },
  headerTitle: {
    fontSize: responsive.headerFontSize,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  taskCountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    minWidth: 28,
    alignItems: 'center',
  },
  taskCount: {
    ...theme.typography.caption,
    color: '#ffffff',
    fontWeight: '600',
  },
  taskList: {
    flex: 1,
    paddingHorizontal: responsive.spacing.sm,
    paddingTop: responsive.spacing.sm,
  },
  listContent: {
    paddingBottom: responsive.spacing.lg,
    flexGrow: 1,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: responsive.spacing.xl,
    paddingHorizontal: responsive.spacing.lg,
  },
  emptyText: {
    fontSize: responsive.bodyFontSize,
    fontWeight: '500',
    marginBottom: responsive.spacing.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: responsive.bodyFontSize - 1,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default KanbanColumn;
