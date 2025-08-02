import { loadTasksFromCloud } from './TaskCloudStorage';
import { saveTaskToCloud } from './TaskCloudStorage';
import { db } from './firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import React, { createContext, useState, useContext } from 'react';
import { auth } from './firebase';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  // Store tasks per board: { [boardId]: [tasks] }
  const [tasksByBoard, setTasksByBoard] = useState({});
  // Sync status for UI feedback
  const [syncStatus, setSyncStatus] = useState('Not synced');

  // Get current user UID for cloud sync
  const [userId, setUserId] = useState(null);
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUserId(user ? user.uid : null);
    });
    return unsubscribe;
  }, []);

  // Automatically load tasks from Firestore on mount
  // Realtime Firestore listener for boards and tasks
  React.useEffect(() => {
    if (!userId) return;
    // Boards listener
    const boardsCol = collection(db, 'users', userId, 'boards');
    const boardsUnsub = onSnapshot(boardsCol, (snapshot) => {
      const boards = snapshot.docs.map(doc => doc.data());
      // Update boards in context if you have a boards state
      // For now, just log or handle as needed
      // setBoards(boards); // Uncomment if you have setBoards
      setSyncStatus(`Boards live update: ${new Date().toLocaleTimeString()}`);
    });
    // Tasks listeners for each board
    const unsubscribers = [];
    const boardIds = Object.keys(tasksByBoard).length > 0 ? Object.keys(tasksByBoard) : ['1'];
    boardIds.forEach((boardId) => {
      const tasksCol = collection(db, 'users', userId, 'boards', boardId, 'tasks');
      const unsubscribe = onSnapshot(tasksCol, (snapshot) => {
        const tasks = snapshot.docs.map(doc => doc.data());
        setTasksByBoard(prev => ({ ...prev, [boardId]: tasks }));
        setSyncStatus(`Tasks live update: ${new Date().toLocaleTimeString()}`);
      });
      unsubscribers.push(unsubscribe);
    });
    return () => {
      boardsUnsub();
      unsubscribers.forEach(unsub => unsub());
    };
  }, [userId]);

  // Automatically sync tasks to Firestore when tasksByBoard changes
  React.useEffect(() => {
    if (!userId) return;
    const syncAll = async () => {
      try {
        for (const [boardId, tasks] of Object.entries(tasksByBoard)) {
          for (const task of tasks) {
            await saveTaskToCloud(userId, boardId, task);
          }
        }
        setSyncStatus(`Synced: ${new Date().toLocaleTimeString()}`);
      } catch (error) {
        setSyncStatus('Sync failed');
      }
    };
    if (Object.keys(tasksByBoard).length > 0) {
      setSyncStatus('Syncing...');
      syncAll();
    }
  }, [tasksByBoard, userId]);

  const loadTasks = async (boardId) => {
    return tasksByBoard[boardId] || [];
  };

  const updateTask = (boardId, updatedTask) => {
    setTasksByBoard(prev => ({
      ...prev,
      [boardId]: (Array.isArray(prev[boardId]) ? prev[boardId] : []).map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  const addTask = (boardId, task) => {
    setTasksByBoard(prev => ({
      ...prev,
      [boardId]: [...(prev[boardId] || []), task]
    }));
  };

  const value = { tasksByBoard, setTasksByBoard, loadTasks, updateTask, addTask, syncStatus };
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTasks = () => useContext(TaskContext);
