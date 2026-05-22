import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

export async function uploadImage(
  file: File,
  folder: string = 'images'
): Promise<string> {
  const filename = `${folder}/${Date.now()}-${file.name}`;
  return uploadFile(file, filename);
}
