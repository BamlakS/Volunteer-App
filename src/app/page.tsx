'use client';

import React from 'react';
import { collection } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateProjectForm } from '@/components/create-project-form';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';

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
        <div className="text-center py-16 bg-muted/50 rounded-lg flex flex-col items-center justify-center">
            <h3 className="text-xl font-semibold">No projects available right now.</h3>
            <p className="text-muted-foreground mt-2 mb-4">Be the first to create one!</p>
             {user && (
                <DialogTrigger asChild>
                    <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                        Create a Project
                    </Button>
                </DialogTrigger>
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
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <header className="mb-12">
          <div className="flex justify-between items-center mb-4">
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
              <DialogTrigger asChild>
                <Button className="hidden sm:inline-flex">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
              </DialogTrigger>
            )}
          </div>
          {user && (
            <DialogTrigger asChild>
              <Button className="w-full sm:hidden">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </DialogTrigger>
          )}
        </header>
        <ProjectList />
        <DialogContent className="sm:max-w-[480px]">
            <CreateProjectForm onProjectCreated={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
