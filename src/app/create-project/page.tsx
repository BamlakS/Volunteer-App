'use client';

import React from 'react';
import { CreateProjectForm } from '@/components/create-project-form';
import { useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function CreateProjectPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-2xl space-y-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-6 w-2/3" />
          <div className="space-y-8 pt-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
       <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Create a New Project</CardTitle>
          <CardDescription>Fill out the details below to list your project for volunteers.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProjectForm onProjectCreated={() => router.push('/dashboard')} />
        </CardContent>
       </Card>
    </div>
  );
}
