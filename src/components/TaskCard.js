import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const { width } = Dimensions.get('window');
const theme = getTheme();
const responsive = getResponsiveDimensions();

const TaskCard = ({ 
  task, 
  onPress, 
  isDragging = false, 
  onLongPress, 
  onMoveTask,
  showMoveButtons = false 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return '#FF9800';
      case 'inprogress':
        return '#2196F3';
      case 'done':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity 
      onPress={onPress}
      onLongPress={onLongPress}
      style={[
        styles.card,
        isDragging && styles.dragging,
        { 
          borderLeftColor: getStatusColor(task.status),
          backgroundColor: theme.colors.surface 
        }
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
          {task.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
          <Text style={styles.statusText}>
            {task.status.replace('inprogress', 'in progress').toUpperCase()}
          </Text>
        </View>
      </View>
      
      {task.description ? (
        <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={3}>
          {task.description}
        </Text>
      ) : null}
      
      <View style={styles.footer}>
        {task.dueDate && (
          <Text style={[styles.dueDate, { color: theme.colors.textSecondary }]}>
            Due: {formatDate(task.dueDate)}
          </Text>
        )}
        {task.attachments && task.attachments.length > 0 && (
          <Text style={[styles.attachments, { color: theme.colors.textSecondary }]}>
            📎 {task.attachments.length}
          </Text>
        )}
      </View>

      {/* Move buttons for cross-column movement */}
      {showMoveButtons && onMoveTask && (
        <View style={styles.moveButtons}>
          {task.status !== 'todo' && (
            <TouchableOpacity 
              style={[styles.moveButton, styles.moveLeft]} 
              onPress={() => onMoveTask(task, 'left')}
            >
              <Ionicons name="chevron-back" size={16} color="#fff" />
              <Text style={styles.moveButtonText}>
                {task.status === 'inprogress' ? 'To Do' : 'In Progress'}
              </Text>
            </TouchableOpacity>
          )}
          
          {task.status !== 'done' && (
            <TouchableOpacity 
              style={[styles.moveButton, styles.moveRight]} 
              onPress={() => onMoveTask(task, 'right')}
            >
              <Text style={styles.moveButtonText}>
                {task.status === 'todo' ? 'In Progress' : 'Done'}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.borderRadius.sm,
    padding: responsive.cardPadding,
    marginVertical: responsive.cardMargin,
    marginHorizontal: responsive.cardMargin,
    borderLeftWidth: 4,
    // Reduced shadow to prevent layering issues
    shadowColor: theme.colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 1,
    elevation: 1, // Reduced elevation for Android
    minHeight: responsive.cardMinHeight,
  },
  dragging: {
    opacity: 0.8,
    transform: [{ scale: 1.05 }],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: responsive.spacing.sm,
  },
  title: {
    fontSize: responsive.titleFontSize,
    fontWeight: '600',
    flex: 1,
    marginRight: responsive.spacing.xs,
    lineHeight: responsive.titleFontSize + 4,
  },
  statusBadge: {
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    fontSize: responsive.bodyFontSize - 1,
    color: '#ffffff',
    fontWeight: '600',
  },
  description: {
    fontSize: responsive.bodyFontSize,
    lineHeight: responsive.bodyFontSize + 4,
    marginBottom: responsive.spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  dueDate: {
    fontSize: responsive.bodyFontSize - 1,
    fontWeight: '500',
  },
  attachments: {
    fontSize: responsive.bodyFontSize - 1,
    fontWeight: '500',
  },
  moveButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsive.spacing.sm,
    paddingTop: responsive.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: responsive.spacing.sm,
    paddingVertical: responsive.spacing.xs,
    borderRadius: theme.borderRadius.xs,
    minWidth: 60,
    flex: 1,
    marginHorizontal: responsive.spacing.xs,
  },
  moveLeft: {
    backgroundColor: theme.colors.warning,
  },
  moveRight: {
    backgroundColor: theme.colors.success,
  },
  moveButtonText: {
    fontSize: responsive.bodyFontSize - 1,
    color: '#fff',
    fontWeight: '600',
    marginHorizontal: responsive.spacing.xs,
  },
});

export default TaskCard;
