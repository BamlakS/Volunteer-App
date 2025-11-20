'use client';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signUpWithEmailPassword(email, password) {
    const auth = getAuth();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing up with email and password:', error);
      throw error;
    }
  }
  
  export async function signInWithEmailPassword(email, password) {
    const auth = getAuth();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      console.error('Error signing in with email and password:', error);
      throw error;
    }
  }

export async function signOut() {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
