import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getTheme } from '../utils/theme';

const { width, height } = Dimensions.get('window');
const theme = getTheme();

const QuickActionsModal = ({ visible, onClose, onAction }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(height));

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const actions = [
    { 
      id: 'new-task', 
      title: 'New Task', 
      icon: 'add-circle-outline', 
      color: theme.colors.primary,
      description: 'Create a new task'
    },
    { 
      id: 'new-board', 
      title: 'New Board', 
      icon: 'albums-outline', 
      color: theme.colors.success,
      description: 'Create a new board'
    },
    { 
      id: 'quick-note', 
      title: 'Quick Note', 
      icon: 'create-outline', 
      color: theme.colors.warning,
      description: 'Add a quick note or idea'
    },
    { 
      id: 'template', 
      title: 'From Template', 
      icon: 'copy-outline', 
      color: theme.colors.info,
      description: 'Create from template'
    },
    { 
      id: 'scan', 
      title: 'Scan Document', 
      icon: 'scan-outline', 
      color: theme.colors.textSecondary,
      description: 'Scan and attach document'
    },
    { 
      id: 'voice-note', 
      title: 'Voice Note', 
      icon: 'mic-outline', 
      color: '#FF6B6B',
      description: 'Record a voice memo'
    },
  ];

  const handleAction = (actionId) => {
    onAction(actionId);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View 
        style={[styles.overlay, { opacity: fadeAnim }]}
      >
        <TouchableOpacity 
          style={styles.overlayTouch} 
          onPress={onClose}
          activeOpacity={1}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            { 
              transform: [{ translateY: slideAnim }],
              backgroundColor: theme.colors.surface 
            }
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Quick Actions
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionsGrid}>
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.actionButton, { borderColor: theme.colors.border }]}
                onPress={() => handleAction(action.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: action.color + '20' }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.colors.text }]}>
                  {action.title}
                </Text>
                <Text style={[styles.actionDescription, { color: theme.colors.textSecondary }]}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: theme.colors.modalBackground,
    justifyContent: 'flex-end',
  },
  overlayTouch: {
    flex: 1,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    maxHeight: height * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - 60) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default QuickActionsModal;
