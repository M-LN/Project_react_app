import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_STORAGE_KEY_PREFIX = '@project_dashboard_tasks_';

// Default tasks for initial setup
const defaultTasks = [
  {
    id: '1',
    title: 'Welcome to Project Dashboard',
    description: 'This is your first task! Edit or delete it and start managing your projects.',
    status: 'todo',
    dueDate: null,
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Learn drag and drop',
    description: 'Try dragging this task to different columns to see the Kanban board in action.',
    status: 'inprogress',
    dueDate: null,
    attachments: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Explore task details',
    description: 'Tap on any task to see the detailed view where you can edit information.',
    status: 'done',
    dueDate: null,
    attachments: [],
    createdAt: new Date().toISOString(),
  },
];

export const TaskStorage = {
  // Load all tasks from storage
  async loadTasks(boardId) {
    try {
      const key = `${TASKS_STORAGE_KEY_PREFIX}${boardId}`;
      const tasksJson = await AsyncStorage.getItem(key);
      if (tasksJson) {
        return JSON.parse(tasksJson);
      } else {
        // Only first board gets default tasks, others start empty
        const initialTasks = boardId === '1' ? defaultTasks : [];
        await this.saveTasks(boardId, initialTasks);
        return initialTasks;
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      return boardId === '1' ? defaultTasks : [];
    }
  },

  // Save tasks to storage
  async saveTasks(boardId, tasks) {
    try {
      const key = `${TASKS_STORAGE_KEY_PREFIX}${boardId}`;
      const tasksJson = JSON.stringify(tasks);
      await AsyncStorage.setItem(key, tasksJson);
      return true;
    } catch (error) {
      console.error('Error saving tasks:', error);
      return false;
    }
  },

  // Add a new task
  async addTask(boardId, taskData) {
    try {
      const tasks = await this.loadTasks(boardId);
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      await this.saveTasks(boardId, tasks);
      return newTask;
    } catch (error) {
      console.error('Error adding task:', error);
      return null;
    }
  },

  // Update an existing task
  async updateTask(boardId, taskId, updates) {
    try {
      const tasks = await this.loadTasks(boardId);
      const taskIndex = tasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        await this.saveTasks(boardId, tasks);
        return tasks[taskIndex];
      }
      return null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  // Delete a task
  async deleteTask(boardId, taskId) {
    try {
      const tasks = await this.loadTasks(boardId);
      const filteredTasks = tasks.filter(task => task.id !== taskId);
      await this.saveTasks(boardId, filteredTasks);
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },

  // Clear all data (for development/testing)
  async clearAllTasks(boardId) {
    try {
      const key = `${TASKS_STORAGE_KEY_PREFIX}${boardId}`;
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error clearing tasks:', error);
      return false;
    }
  },
};
