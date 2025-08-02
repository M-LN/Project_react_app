import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  Alert, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TaskStorage } from '../utils/TaskStorage';
import { 
  requestNotificationPermissions,
  getScheduledNotifications,
} from '../utils/notifications';
import { getTheme } from '../utils/theme';
import { getResponsiveDimensions } from '../utils/responsive';

const theme = getTheme();
const responsive = getResponsiveDimensions();

function isUpcoming(dateStr) {
  if (!dateStr) return false;
  const now = new Date();
  const date = new Date(dateStr);
  return date >= now && (date - now) < 7 * 24 * 60 * 60 * 1000;
}

const NotificationsScreen = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [taskReminders, setTaskReminders] = useState(true);
  const [taskUpdates, setTaskUpdates] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load upcoming tasks
      const tasks = await TaskStorage.loadTasks();
      setUpcoming(tasks.filter(t => isUpcoming(t.dueDate)));

      // Check notification permissions
      const result = await requestNotificationPermissions();
      setNotificationsEnabled(result.success);
    } catch (error) {
      console.log('Error loading notification data:', error);
    }
  };

  const handleEnableNotifications = async (enabled) => {
    if (enabled) {
      const result = await requestNotificationPermissions();
      setNotificationsEnabled(result.success);
      if (!result.success) {
        Alert.alert('Notifications', 'Please enable notifications in your device settings to receive task reminders.');
      }
    } else {
      setNotificationsEnabled(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerDescription}>
            Manage your task reminders and upcoming deadlines
          </Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Enable Notifications</Text>
              <Text style={styles.settingDescription}>
                Allow the app to send you notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleEnableNotifications}
              trackColor={{ false: '#767577', true: theme.colors.primary }}
              thumbColor={notificationsEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>

          {notificationsEnabled && (
            <>
              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Task Reminders</Text>
                  <Text style={styles.settingDescription}>
                    Get reminded about tasks due tomorrow
                  </Text>
                </View>
                <Switch
                  value={taskReminders}
                  onValueChange={setTaskReminders}
                  trackColor={{ false: '#767577', true: theme.colors.primary }}
                  thumbColor={taskReminders ? '#fff' : '#f4f3f4'}
                />
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingTextContainer}>
                  <Text style={styles.settingTitle}>Task Updates</Text>
                  <Text style={styles.settingDescription}>
                    Get notified when tasks are completed or updated
                  </Text>
                </View>
                <Switch
                  value={taskUpdates}
                  onValueChange={setTaskUpdates}
                  trackColor={{ false: '#767577', true: theme.colors.primary }}
                  thumbColor={taskUpdates ? '#fff' : '#f4f3f4'}
                />
              </View>
            </>
          )}
        </View>

        {/* Upcoming Tasks Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Tasks (Next 7 Days)</Text>
          {upcoming.length === 0 ? (
            <Text style={styles.emptyText}>
              No tasks due soon. You're all caught up!
            </Text>
          ) : (
            <View style={styles.taskContainer}>
              {upcoming.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskDue}>Due: {task.dueDate}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How it works</Text>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Enable notifications to receive task reminders
            </Text>
            <Text style={styles.infoText}>
              Get notified 1 day before tasks are due
            </Text>
            <Text style={styles.infoText}>
              Receive updates when tasks are completed or moved
            </Text>
            <Text style={styles.infoText}>
              Manage notification settings in your device settings
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  // Header Styles
  headerSection: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  headerDescription: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Section Styles
  section: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  
  // Setting Styles
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    lineHeight: 20,
  },
  
  // Task Styles
  taskContainer: {
    marginTop: 8,
  },
  taskItem: {
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  taskDue: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  
  // Info Styles
  infoContainer: {
    marginTop: 8,
  },
  infoText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
  
  // Empty State
  emptyText: {
    fontSize: 15,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
});

export default NotificationsScreen;
