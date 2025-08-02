import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../utils/theme';

const { width } = Dimensions.get('window');
const theme = getTheme();

const EnhancedTaskCard = ({ 
  task, 
  onPress, 
  isDragging = false, 
  onLongPress, 
  onMoveTask,
  showMoveButtons = false,
  onSwipeDelete,
  onSwipeComplete 
}) => {
  const animatedValue = new Animated.Value(1);

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return theme.colors.todo;
      case 'inprogress':
        return theme.colors.inprogress;
      case 'done':
        return theme.colors.done;
      default:
        return theme.colors.textTertiary;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.colors.high;
      case 'medium':
        return theme.colors.medium;
      case 'low':
        return theme.colors.low;
      default:
        return theme.colors.textTertiary;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day(s)`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} day(s)`;
    }
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return date < now && task.status !== 'done';
  };

  const getProgressPercentage = () => {
    // Mock progress calculation - you can implement based on subtasks or manual input
    if (task.status === 'done') return 100;
    if (task.status === 'inprogress') return task.progress || 50;
    return 0;
  };

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        { transform: [{ scale: animatedValue }] },
        isDragging && { opacity: 0.8 }
      ]}
    >
      <TouchableOpacity 
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          { 
            borderLeftColor: getStatusColor(task.status),
            backgroundColor: theme.colors.surface,
          },
          isOverdue(task.dueDate) && styles.overdueCard
        ]}
        activeOpacity={0.9}
      >
        {/* Priority Indicator */}
        {task.priority && (
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(task.priority) }]} />
        )}

        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={2}>
              {task.title}
            </Text>
            {task.tags && task.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {task.tags.slice(0, 2).map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
                {task.tags.length > 2 && (
                  <Text style={[styles.moreTagsText, { color: theme.colors.textSecondary }]}>
                    +{task.tags.length - 2}
                  </Text>
                )}
              </View>
            )}
          </View>
          
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(task.status) }]}>
            <Text style={styles.statusText}>
              {task.status === 'inprogress' ? 'IN PROGRESS' : task.status.toUpperCase()}
            </Text>
          </View>
        </View>
        
        {task.description ? (
          <Text style={[styles.description, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {task.description}
          </Text>
        ) : null}

        {/* Progress Bar */}
        {task.status !== 'todo' && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${getProgressPercentage()}%`,
                    backgroundColor: getStatusColor(task.status)
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.colors.textSecondary }]}>
              {getProgressPercentage()}%
            </Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            {task.dueDate && (
              <View style={[
                styles.dueDateContainer,
                isOverdue(task.dueDate) && styles.overdueDateContainer
              ]}>
                <Ionicons 
                  name={isOverdue(task.dueDate) ? "warning" : "time-outline"} 
                  size={12} 
                  color={isOverdue(task.dueDate) ? theme.colors.error : theme.colors.textSecondary} 
                />
                <Text style={[
                  styles.dueDate,
                  { color: isOverdue(task.dueDate) ? theme.colors.error : theme.colors.textSecondary }
                ]}>
                  {formatDate(task.dueDate)}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.footerRight}>
            {task.attachments && task.attachments.length > 0 && (
              <View style={styles.attachmentIndicator}>
                <Ionicons name="attach" size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.attachmentCount, { color: theme.colors.textSecondary }]}>
                  {task.attachments.length}
                </Text>
              </View>
            )}
            
            {task.estimatedTime && (
              <View style={styles.timeIndicator}>
                <Ionicons name="timer-outline" size={14} color={theme.colors.textSecondary} />
                <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>
                  {task.estimatedTime}h
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Enhanced Move buttons */}
        {showMoveButtons && onMoveTask && (
          <View style={styles.moveButtons}>
            {task.status !== 'todo' && (
              <TouchableOpacity 
                style={[styles.moveButton, styles.moveLeft, { backgroundColor: theme.colors.primary }]} 
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
                style={[styles.moveButton, styles.moveRight, { backgroundColor: theme.colors.success }]} 
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
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 4,
    padding: 16,
    borderLeftWidth: 4,
    ...theme.shadows.md,
    position: 'relative',
  },
  overdueCard: {
    borderColor: theme.colors.error,
    backgroundColor: '#FFF5F5',
  },
  priorityIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopWidth: 20,
    borderRightWidth: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 4,
  },
  tag: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
    marginBottom: 2,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 10,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '500',
    minWidth: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeft: {
    flex: 1,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overdueDateContainer: {
    backgroundColor: '#FFF0F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  dueDate: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  attachmentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  attachmentCount: {
    fontSize: 12,
    marginLeft: 2,
  },
  timeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
    marginLeft: 2,
  },
  moveButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  moveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  moveLeft: {
    marginRight: 8,
  },
  moveRight: {
    marginLeft: 8,
  },
  moveButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginHorizontal: 4,
  },
});

export default EnhancedTaskCard;
