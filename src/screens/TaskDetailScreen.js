import React, { useState, useEffect } from 'react';
import { useTasks } from '../utils/TaskContext';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { Modal, TouchableWithoutFeedback, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TaskStorage } from '../utils/TaskStorage';
import { 
  scheduleTaskReminder, 
  sendTaskUpdateNotification 
} from '../utils/notifications';
import {
  trackScreenView,
  trackTaskCreated,
  trackTaskUpdated,
  trackAttachmentAdded
} from '../utils/analytics';

const TaskDetailScreen = ({ route, navigation }) => {
  const { task, boardId } = route.params;
  const [localTask, setLocalTask] = useState(task);
  const { updateTask, addTask, setTasksByBoard } = useTasks();
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || 'todo');
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [saving, setSaving] = useState(false);
  const [attachments, setAttachments] = useState(task?.attachments || []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [fullscreenImage, setFullscreenImage] = useState(null);

  useEffect(() => {
    // Track screen view
    trackScreenView(isEditing ? 'EditTaskScreen' : 'CreateTaskScreen');
    
    navigation.setOptions({
      title: isEditing ? 'Edit Task' : 'New Task',
      headerRight: () => (
        <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
          <Text style={styles.headerButtonText}>
            {saving ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [isEditing, saving, title, description, status, dueDate]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    setSaving(true);

    try {
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate || null,
        attachments,
      };

      let savedTask;

      if (isEditing) {
        await TaskStorage.updateTask(boardId, task.id, taskData);
        savedTask = { ...task, ...taskData };
        
        // Track task update
        trackTaskUpdated(savedTask.status, 'content');
        
        // Send task update notification
        await sendTaskUpdateNotification(
          savedTask.title || 'Task',
          'Task has been updated'
        );
      } else {
        savedTask = await TaskStorage.addTask(boardId, taskData);
        
        // Track task creation
        trackTaskCreated(
          savedTask.status,
          !!savedTask.dueDate,
          !!savedTask.description,
          !!(savedTask.attachments && savedTask.attachments.length > 0)
        );
        
        // Send task creation notification
        await sendTaskUpdateNotification(
          savedTask?.title || taskData.title || 'New Task',
          'New task created'
        );
      }

      // Schedule reminder notification if task has due date
      if (savedTask.dueDate) {
        await scheduleTaskReminder(savedTask);
      }

      // Always reload tasks from storage for this board
      const loadedTasks = await TaskStorage.loadTasks(boardId);
      setTasksByBoard(prev => ({
        ...prev,
        [boardId]: loadedTasks,
      }));

      navigation.goBack();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await TaskStorage.deleteTask(boardId, task.id);
              const loadedTasks = await TaskStorage.loadTasks(boardId);
              setTasksByBoard(prev => ({
                ...prev,
                [boardId]: loadedTasks,
              }));
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting task:', error);
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const statusOptions = [
    { label: 'To Do', value: 'todo', color: '#FF9800' },
    { label: 'In Progress', value: 'inprogress', color: '#2196F3' },
    { label: 'Done', value: 'done', color: '#4CAF50' },
  ];

  // Pick and add image only (local URI)
  const handleAddAttachment = async () => {
    try {
      // Request permissions first
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to add images!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newAttachments = [...attachments, result.assets[0].uri];
        setAttachments(newAttachments);
        
        // Track attachment added
        trackAttachmentAdded('image', newAttachments.length);
      }
    } catch (error) {
      Alert.alert('Error', `ImagePicker failed: ${error.message}`);
    }
  };

  // Upload to Firebase Storage and add to attachments
  // Remove file upload logic

  const handleRemoveAttachment = (uri) => {
    setAttachments(attachments.filter(att => att !== uri));
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.field}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              multiline
              maxLength={100}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Status</Text>
            <TouchableOpacity
              style={[styles.statusSelector, { borderColor: '#ddd' }]}
              onPress={() => setStatusModalVisible(true)}
            >
              <Text style={[styles.statusSelectorText, { color: statusOptions.find(o => o.value === status)?.color || '#333' }]}> 
                {statusOptions.find(o => o.value === status)?.label}
              </Text>
            </TouchableOpacity>
            <Modal
              visible={statusModalVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setStatusModalVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setStatusModalVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    {statusOptions.map(option => (
                      <TouchableOpacity
                        key={option.value}
                        style={[styles.modalOption, { backgroundColor: option.color }]}
                        onPress={() => {
                          setStatus(option.value);
                          setStatusModalVisible(false);
                        }}
                      >
                        <Text style={styles.modalOptionText}>{option.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Due Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={dueDate}
              onChangeText={setDueDate}
              placeholder="2025-12-31"
              keyboardType="default"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.helperText}>
              Format: YYYY-MM-DD (e.g., 2025-12-31)
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Attachments</Text>
            <View style={styles.attachmentsRow}>
              <TouchableOpacity style={styles.addAttachmentButton} onPress={handleAddAttachment}>
                <Text style={styles.addAttachmentText}>+ Add Image</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.attachmentsPreview}>
              {attachments.length === 0 && (
                <Text style={{ color: '#888', fontStyle: 'italic', marginBottom: 8 }}>No attachments yet.</Text>
              )}
              {attachments.map((uri, idx) => (
                <View key={uri} style={styles.attachmentItem}>
                  <TouchableOpacity onPress={() => setFullscreenImage(uri)}>
                    <Image source={{ uri }} style={styles.attachmentImage} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.removeAttachmentButton} onPress={() => handleRemoveAttachment(uri)}>
                    <Text style={styles.removeAttachmentText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {fullscreenImage && (
              <Modal visible={true} transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
                <TouchableWithoutFeedback onPress={() => setFullscreenImage(null)}>
                  <View style={styles.fullscreenOverlay}>
                    <Image source={{ uri: fullscreenImage }} style={styles.fullscreenImage} resizeMode="contain" />
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            )}
          </View>

          {isEditing && (
            <View style={styles.metadata}>
              <Text style={styles.metadataText}>
                Created: {new Date(task.createdAt).toLocaleDateString()}
              </Text>
              <Text style={styles.metadataText}>
                ID: {task.id}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!title.trim() || saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? 'Saving...' : isEditing ? 'Update' : 'Create'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusSelector: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
    marginBottom: 4,
  },
  statusSelectorText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    minWidth: 220,
    elevation: 5,
  },
  modalOption: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 6,
    alignItems: 'center',
  },
  modalOptionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  metadata: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  metadataText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  bottomActions: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  deleteButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#9E9E9E',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#BDBDBD',
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  headerButton: {
    marginRight: 16,
  },
  headerButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  attachmentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addAttachmentButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addAttachmentText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  attachmentsPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  attachmentItem: {
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  attachmentImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  removeAttachmentButton: {
    backgroundColor: '#f44336',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  removeAttachmentText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  fullscreenOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '90%',
    height: '80%',
    borderRadius: 12,
  },
});

export default TaskDetailScreen;
