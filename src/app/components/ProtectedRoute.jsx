'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFirebase } from '@/hooks/useFirebase';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useFirebase(); // Ensure this hook checks user auth state
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/LoginPage'); // Redirect to login if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null; // Optionally, show a loading spinner while checking auth
  }

  return children;
}
