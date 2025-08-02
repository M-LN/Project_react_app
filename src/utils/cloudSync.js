// Demo cloud sync functions for boards
import { db, auth } from './firebase';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import {
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

// Get the current authenticated user's UID
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No authenticated user found');
  }
  return user.uid;
};

// Save all boards to Firestore
export async function saveBoardsToCloud(boards, userId = null) {
  try {
    const uid = userId || getCurrentUserId();
    const batchPromises = boards.map(board => {
      const boardRef = doc(collection(db, 'users', uid, 'boards'), board.id);
      return setDoc(boardRef, board);
    });
    await Promise.all(batchPromises);
    return { success: true };
  } catch (error) {
    console.error('Error saving boards:', error);
    return { success: false, error };
  }
}

// Load all boards from Firestore
export async function loadBoardsFromCloud(userId = null) {
  try {
    const uid = userId || getCurrentUserId();
    const boardsCol = collection(db, 'users', uid, 'boards');
    const snapshot = await getDocs(boardsCol);
    const boards = snapshot.docs.map(doc => doc.data());
    return { success: true, boards };
  } catch (error) {
    console.error('Error loading boards:', error);
    return { success: false, boards: [], error };
  }
}

// Delete a board from Firestore
export async function deleteBoardFromCloud(boardId, userId = null) {
  try {
    const uid = userId || getCurrentUserId();
    const boardRef = doc(db, 'users', uid, 'boards', boardId);
    await deleteDoc(boardRef);
    return { success: true };
  } catch (error) {
    console.error('Error deleting board:', error);
    return { success: false, error };
  }
}

// Update a board in Firestore
export async function updateBoardInCloud(boardId, updates, userId = null) {
  try {
    const uid = userId || getCurrentUserId();
    const boardRef = doc(db, 'users', uid, 'boards', boardId);
    await updateDoc(boardRef, updates);
    return { success: true };
  } catch (error) {
    console.error('Error updating board:', error);
    return { success: false, error };
  }
}

export async function syncBoardsToCloud(boards, userId = null) {
  try {
    const uid = userId || getCurrentUserId();
    for (const board of boards) {
      await setDoc(doc(db, 'users', uid, 'boards', board.id), board);
    }
    return { success: true };
  } catch (error) {
    console.error('Error syncing boards to cloud:', error);
    return { success: false, error };
  }
}


