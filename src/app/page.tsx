'use client';

import React from 'react';
import { collection, query } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/firebase/auth/use-user';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateProjectForm } from '@/components/create-project-form';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function ProjectList() {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => query(collection(firestore, 'projects')), [firestore]);
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleProjectCreated = () => {
    setIsDialogOpen(false);
    router.push('/dashboard');
  };
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col space-y-3">
            <Skeleton className="h-[250px] w-full rounded-xl" />
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
        <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
             <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
             <p className="text-muted-foreground mb-4">Be the first one to create a project!</p>
             {user && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create New Project
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-headline">Create a New Project</DialogTitle>
                      <DialogDescription>
                        Fill out the details below to list your project for volunteers.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateProjectForm user={user} onProjectCreated={handleProjectCreated} />
                  </DialogContent>
                </Dialog>
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
      <header className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex-grow">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
              Find Your Next Volunteer Project
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Connect with non-profits and use your tech skills for good. Browse
              projects, find your fit, and start making a difference today.
            </p>
          </div>
          {user && (
            <Button asChild size="lg">
              <Link href="/create-project">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create New Project
              </Link>
            </Button>
          )}
        </div>
      </header>
      <ProjectList />
    </div>
  );
}
