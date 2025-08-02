import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Request notification permissions
export const requestNotificationPermissions = async () => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return { success: false, error: 'Failed to get push token for push notification!' };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Schedule a notification for a task due date
export const scheduleTaskReminder = async (task) => {
  try {
    if (!task.dueDate) return { success: false, error: 'No due date set' };

    const dueDate = new Date(task.dueDate);
    const now = new Date();
    
    // Schedule notification 1 day before due date at 9 AM
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    reminderDate.setHours(9, 0, 0, 0);

    // Don't schedule if reminder date is in the past
    if (reminderDate <= now) {
      return { success: false, error: 'Reminder date is in the past' };
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder',
        body: `"${task.title}" is due tomorrow!`,
        data: { taskId: task.id, type: 'task_reminder' },
      },
      trigger: {
        date: reminderDate,
      },
    });

    return { success: true, notificationId };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Cancel a scheduled notification
export const cancelTaskReminder = async (notificationId) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Send immediate notification for task updates
export const sendTaskUpdateNotification = async (taskTitle, message) => {
  try {
    const title = '� Task Update';
    const body = message ? `${taskTitle}: ${message}` : `${taskTitle} has been updated`;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { type: 'task_update' },
      },
      trigger: null, // Send immediately
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all scheduled notifications
export const getScheduledNotifications = async () => {
  try {
    const notifications = await Notifications.getAllScheduledNotificationsAsync();
    return { success: true, notifications };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
