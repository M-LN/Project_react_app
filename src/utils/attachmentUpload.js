import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

// Uploads a file to Firebase Storage and returns the download URL
export async function uploadAttachment(userId, boardId, taskId, fileUri) {
  const storage = getStorage();
  const fileName = fileUri.split('/').pop();
  const storageRef = ref(storage, `attachments/${userId}/${boardId}/${taskId}/${Date.now()}_${fileName}`);

  // Read file as blob
  let fileBlob;
  if (Platform.OS === 'web') {
    // For web, fetch the file as blob
    fileBlob = await (await fetch(fileUri)).blob();
  } else {
    // For native, use FileSystem to read as base64 and convert to blob
    const base64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
    fileBlob = new Blob([Uint8Array.from(atob(base64), c => c.charCodeAt(0))]);
  }

  await uploadBytes(storageRef, fileBlob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
}
