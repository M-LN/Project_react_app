import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

// Helper function to safely log events
const logAnalyticsEvent = (eventName, parameters = {}) => {
  try {
    if (analytics) {
      logEvent(analytics, eventName, parameters);
      console.log(`Analytics: ${eventName}`, parameters);
    }
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

// User Engagement Events
export const trackUserLogin = () => {
  logAnalyticsEvent('login', {
    method: 'anonymous'
  });
};

export const trackScreenView = (screenName) => {
  logAnalyticsEvent('screen_view', {
    screen_name: screenName,
    screen_class: screenName
  });
};

// Board Management Events
export const trackBoardCreated = (boardName) => {
  logAnalyticsEvent('board_created', {
    board_name: boardName
  });
};

export const trackBoardOpened = (boardId, boardName) => {
  logAnalyticsEvent('board_opened', {
    board_id: boardId,
    board_name: boardName
  });
};

export const trackBoardDeleted = () => {
  logAnalyticsEvent('board_deleted');
};

// Task Management Events
export const trackTaskCreated = (taskStatus, hasDueDate, hasDescription, hasAttachments) => {
  logAnalyticsEvent('task_created', {
    task_status: taskStatus,
    has_due_date: hasDueDate,
    has_description: hasDescription,
    has_attachments: hasAttachments
  });
};

export const trackTaskUpdated = (taskStatus, changeType) => {
  logAnalyticsEvent('task_updated', {
    task_status: taskStatus,
    change_type: changeType // 'status', 'content', 'due_date', etc.
  });
};

export const trackTaskCompleted = (timeToComplete) => {
  logAnalyticsEvent('task_completed', {
    time_to_complete: timeToComplete // in days
  });
};

export const trackTaskMoved = (fromStatus, toStatus, method) => {
  logAnalyticsEvent('task_moved', {
    from_status: fromStatus,
    to_status: toStatus,
    method: method // 'drag', 'button'
  });
};

export const trackTaskDeleted = (taskStatus) => {
  logAnalyticsEvent('task_deleted', {
    task_status: taskStatus
  });
};

// Feature Usage Events
export const trackAttachmentAdded = (attachmentType, attachmentCount) => {
  logAnalyticsEvent('attachment_added', {
    attachment_type: attachmentType,
    total_attachments: attachmentCount
  });
};

export const trackCloudSync = (syncType, success, itemCount) => {
  logAnalyticsEvent('cloud_sync', {
    sync_type: syncType, // 'manual', 'automatic'
    success: success,
    item_count: itemCount
  });
};

export const trackNotificationPermission = (granted) => {
  logAnalyticsEvent('notification_permission', {
    granted: granted
  });
};

export const trackNotificationReceived = (notificationType) => {
  logAnalyticsEvent('notification_received', {
    notification_type: notificationType // 'task_reminder', 'task_update'
  });
};

// App Performance Events
export const trackAppLaunch = () => {
  logAnalyticsEvent('app_open');
};

export const trackOfflineMode = (isOffline, duration) => {
  logAnalyticsEvent('offline_usage', {
    is_offline: isOffline,
    duration_seconds: duration
  });
};

// User Behavior Events
export const trackSearchUsage = (searchTerm, resultsCount) => {
  logAnalyticsEvent('search', {
    search_term: searchTerm,
    results_count: resultsCount
  });
};

export const trackFeatureUsage = (featureName, usageCount) => {
  logAnalyticsEvent('feature_usage', {
    feature_name: featureName,
    usage_count: usageCount
  });
};

// Custom Events for Business Insights
export const trackProductivityMetrics = (tasksCompleted, averageTaskTime, boardsActive) => {
  logAnalyticsEvent('productivity_metrics', {
    tasks_completed: tasksCompleted,
    average_task_time: averageTaskTime,
    active_boards: boardsActive
  });
};

export const trackUserEngagement = (sessionDuration, screensVisited, actionsPerformed) => {
  logAnalyticsEvent('user_engagement', {
    session_duration: sessionDuration,
    screens_visited: screensVisited,
    actions_performed: actionsPerformed
  });
};

// Error Tracking
export const trackError = (errorType, errorMessage, screen) => {
  logAnalyticsEvent('app_error', {
    error_type: errorType,
    error_message: errorMessage,
    screen: screen
  });
};

export default {
  trackUserLogin,
  trackScreenView,
  trackBoardCreated,
  trackBoardOpened,
  trackBoardDeleted,
  trackTaskCreated,
  trackTaskUpdated,
  trackTaskCompleted,
  trackTaskMoved,
  trackTaskDeleted,
  trackAttachmentAdded,
  trackCloudSync,
  trackNotificationPermission,
  trackNotificationReceived,
  trackAppLaunch,
  trackOfflineMode,
  trackSearchUsage,
  trackFeatureUsage,
  trackProductivityMetrics,
  trackUserEngagement,
  trackError
};
