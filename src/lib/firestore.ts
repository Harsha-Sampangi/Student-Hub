import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
  QueryConstraint,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import {
  mockOpportunities,
  mockEvents,
  mockBlogs,
  mockResources,
  mockTeam,
  mockStats,
  mockAchievements,
} from '@/data/mock';

// Mapping collections to static mock datasets
const mockDataMap: Record<string, any> = {
  opportunities: mockOpportunities,
  events: mockEvents,
  blogs: mockBlogs,
  resources: mockResources,
  team: mockTeam,
  stats: [mockStats],
  achievements: mockAchievements,
};

// LocalStorage persistence keys
const localStorageKeys: Record<string, string> = {
  opportunities: 'sh_opportunities',
  events: 'sh_events',
  blogs: 'sh_blogs',
  resources: 'sh_resources',
  team: 'sh_team',
  stats: 'sh_stats',
  achievements: 'sh_achievements',
};

// Retrieve collection from localStorage
function getLocalCollection<T>(collectionName: string): T[] {
  if (typeof window === 'undefined') {
    return (mockDataMap[collectionName] || []) as T[];
  }
  const key = localStorageKeys[collectionName];
  if (!key) {
    return (mockDataMap[collectionName] || []) as T[];
  }
  
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved) as T[];
    } catch (e) {
      return (mockDataMap[collectionName] || []) as T[];
    }
  } else {
    const defaultData = mockDataMap[collectionName] || [];
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData as T[];
  }
}

// Persist collection back to localStorage
function saveLocalCollection(collectionName: string, data: any[]) {
  if (typeof window === 'undefined') return;
  const key = localStorageKeys[collectionName];
  if (key) {
    localStorage.setItem(key, JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }
}

// Helper to determine if we should read/write using localStorage
export function shouldStoreLocally(): boolean {
  if (typeof window === 'undefined') return true;
  if (!isFirebaseConfigured()) return true;
  // If the admin session is running in local mock fallback mode, we must
  // consistently read and write from localStorage to ensure page sync works.
  if (localStorage.getItem('sh_mock_user')) return true;
  return false;
}

// Generic fetch all documents from a collection
export async function fetchCollection<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  if (shouldStoreLocally()) {
    return getLocalCollection<T>(collectionName);
  }
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (e) {
    console.warn(`Firestore fetchCollection failed for ${collectionName}, falling back to localStorage:`, e);
    return getLocalCollection<T>(collectionName);
  }
}

// Fetch a single document by ID or slug
export async function fetchDocument<T>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  if (shouldStoreLocally()) {
    const items = getLocalCollection<any>(collectionName);
    return items.find((item) => item.id === docId || item.slug === docId) as T || null;
  }
  try {
    const docRef = doc(db, collectionName, docId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() } as T;
    }
    
    // Fallback: If blog post page queries by slug instead of Firestore Document ID
    if (collectionName === 'blogs') {
      const q = query(collection(db, collectionName), where('slug', '==', docId));
      const qSnapshot = await getDocs(q);
      if (!qSnapshot.empty) {
        const d = qSnapshot.docs[0];
        return { id: d.id, ...d.data() } as T;
      }
    }
    return null;
  } catch (e) {
    console.warn(`Firestore fetchDocument failed for ${collectionName}/${docId}, falling back to localStorage:`, e);
    const items = getLocalCollection<any>(collectionName);
    return items.find((item) => item.id === docId || item.slug === docId) as T || null;
  }
}

// Add a new document
export async function addDocument(
  collectionName: string,
  data: DocumentData
): Promise<string> {
  if (shouldStoreLocally()) {
    const items = getLocalCollection<any>(collectionName);
    const newId = `${collectionName.slice(0, 3)}_${Date.now()}`;
    const newItem = { id: newId, ...data, createdAt: new Date().toISOString() };
    saveLocalCollection(collectionName, [newItem, ...items]);
    return newId;
  }
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (e) {
    console.warn(`Firestore addDocument failed for ${collectionName}, falling back to localStorage:`, e);
    const items = getLocalCollection<any>(collectionName);
    const newId = `${collectionName.slice(0, 3)}_${Date.now()}`;
    const newItem = { id: newId, ...data, createdAt: new Date().toISOString() };
    saveLocalCollection(collectionName, [newItem, ...items]);
    return newId;
  }
}

// Update a document
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  if (shouldStoreLocally()) {
    const items = getLocalCollection<any>(collectionName);
    const updated = items.map((item) =>
      item.id === docId ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
    );
    saveLocalCollection(collectionName, updated);
    return;
  }
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (e) {
    console.warn(`Firestore updateDocument failed for ${collectionName}/${docId}, falling back to localStorage:`, e);
    const items = getLocalCollection<any>(collectionName);
    const updated = items.map((item) =>
      item.id === docId ? { ...item, ...data, updatedAt: new Date().toISOString() } : item
    );
    saveLocalCollection(collectionName, updated);
  }
}

// Delete a document
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  if (shouldStoreLocally()) {
    const items = getLocalCollection<any>(collectionName);
    const updated = items.filter((item) => item.id !== docId);
    saveLocalCollection(collectionName, updated);
    return;
  }
  try {
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
  } catch (e) {
    console.warn(`Firestore deleteDocument failed for ${collectionName}/${docId}, falling back to localStorage:`, e);
    const items = getLocalCollection<any>(collectionName);
    const updated = items.filter((item) => item.id !== docId);
    saveLocalCollection(collectionName, updated);
  }
}

// Query helpers
export { query, where, orderBy, limit, collection };
