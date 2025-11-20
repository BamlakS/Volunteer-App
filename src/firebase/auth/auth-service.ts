'use client';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const provider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const auth = getAuth();
  try {
    const result = await signInWithPopup(auth, provider);
    // You might want to create a user profile in Firestore here
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function signUpWithEmailPassword(email: string, password: string) {
    const auth = getAuth();
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // You might want to create a user profile in Firestore here
      // and maybe set a display name
      const name = email.split('@')[0];
      await updateProfile(result.user, { displayName: name });
      return result.user;
    } catch (error) {
      console.error('Error signing up with email and password:', error);
      throw error;
    }
  }
  
  export async function signInWithEmailPassword(email: string, password: string) {
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
