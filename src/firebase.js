import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
} from 'firebase/firestore';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import firebaseConfig from './firebase/config.js';

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);

export const ADMIN_EMAIL = 'martinaledesma2@gmail.com';

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);
export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);

const siteContentRef = doc(db, 'siteContent', 'homepage');
export const subscribeSiteContent = (callback, errorCallback) => onSnapshot(siteContentRef, callback, errorCallback);
export const saveSiteContent = async (data) => setDoc(siteContentRef, data, { merge: true });

const nosotrosContentRef = doc(db, 'siteContent', 'nosotros');
export const subscribeNosotrosContent = (callback, errorCallback) => onSnapshot(nosotrosContentRef, callback, errorCallback);
export const getNosotrosContent = async () => {
  const snapshot = await getDoc(nosotrosContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveNosotrosContent = async (data) => setDoc(nosotrosContentRef, data, { merge: true });

const sumateContentRef = doc(db, 'siteContent', 'sumate');
export const subscribeSumateContent = (callback, errorCallback) => onSnapshot(sumateContentRef, callback, errorCallback);
export const getSumateContent = async () => {
  const snapshot = await getDoc(sumateContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveSumateContent = async (data) => setDoc(sumateContentRef, data, { merge: true });

const contactoContentRef = doc(db, 'siteContent', 'contacto');
export const subscribeContactoContent = (callback, errorCallback) => onSnapshot(contactoContentRef, callback, errorCallback);
export const getContactoContent = async () => {
  const snapshot = await getDoc(contactoContentRef);
  return snapshot.exists() ? snapshot.data() : null;
};
export const saveContactoContent = async (data) => setDoc(contactoContentRef, data, { merge: true });

export const uploadImage = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};
