// Cloud sync helpers for tasks under each board (Firestore)
import { db } from './firebase';
import { collection, doc, setDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

// Save a task to Firestore under a board for a user
export async function saveTaskToCloud(userId, boardId, task) {
  try {
    const taskRef = doc(collection(db, 'users', userId, 'boards', boardId, 'tasks'), task.id);
    await setDoc(taskRef, task);
    return true;
  } catch (error) {
    console.error('Error saving task to cloud:', error);
    return false;
  }
}

// Load all tasks for a board from Firestore for a user
export async function loadTasksFromCloud(userId, boardId) {
  try {
    const tasksCol = collection(db, 'users', userId, 'boards', boardId, 'tasks');
    const snapshot = await getDocs(tasksCol);
    const tasks = snapshot.docs.map(doc => doc.data());
    return { success: true, tasks };
  } catch (error) {
    console.error('Error loading tasks from cloud:', error);
    return { success: false, tasks: [], error };
  }
}

// Delete a task from Firestore
export async function deleteTaskFromCloud(userId, boardId, taskId) {
  try {
    const taskRef = doc(db, 'users', userId, 'boards', boardId, 'tasks', taskId);
    await deleteDoc(taskRef);
    return true;
  } catch (error) {
    console.error('Error deleting task from cloud:', error);
    return false;
  }
}

// Update a task in Firestore
export async function updateTaskInCloud(userId, boardId, taskId, updates) {
  try {
    const taskRef = doc(db, 'users', userId, 'boards', boardId, 'tasks', taskId);
    await updateDoc(taskRef, updates);
    return true;
  } catch (error) {
    console.error('Error updating task in cloud:', error);
    return false;
  }
}

// Save a task to Firestore under a board

// Load all tasks for a board from Firestore
// ...existing code...

// Delete a task from Firestore
// ...existing code...

// Update a task in Firestore
// ...existing code...
