'use client';
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, type Query } from 'firebase/firestore';
import { useFirestore } from '../provider';

export function useCollection<T>(path: string, q?: Query) {
  const firestore = useFirestore();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const collRef = collection(firestore, path);
    const finalQuery = q || query(collRef);

    const unsubscribe = onSnapshot(
      finalQuery,
      (snapshot) => {
        const result: T[] = [];
        snapshot.forEach((doc) => {
          result.push({ id: doc.id, ...doc.data() } as T);
        });
        setData(result);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firestore, path, q]);

  return { data, loading, error };
}
