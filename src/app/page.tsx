'use client';

import React from 'react';
import { collection } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/firebase/auth/use-user';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';
import Link from 'next/link';

function ProjectList() {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => collection(firestore, 'projects'), [firestore]);
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);
  const { user } = useAuth();
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[200px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
        <div className="text-center py-20">
             {user && (
                <Button size="lg" asChild>
                    <Link href="/create-project">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Your First Project
                    </Link>
                </Button>
            )}
             {!user && (
                <p className="text-muted-foreground">No projects have been created yet. Log in to create one!</p>
             )}
        </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}


export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8 flex justify-between items-center">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
            Find Your Next Volunteer Project
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Connect with non-profits and use your tech skills for good. Browse
            projects, find your fit, and start making a difference today.
          </p>
        </div>
         {user && (
          <div className="mt-6">
            <Button size="lg" asChild>
                <Link href="/create-project">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Create New Project
                </Link>
            </Button>
          </div>
        )}
      </header>
      <ProjectList />
    </div>
  );
}
