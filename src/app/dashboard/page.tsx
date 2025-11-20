'use client';

import React from 'react';
import { collection, query, where } from 'firebase/firestore';
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
import { useRouter } from 'next/navigation';

function UserProjectList({ onOpenCreateDialog }: { onOpenCreateDialog: () => void }) {
  const firestore = useFirestore();
  const { user, loading: authLoading } = useAuth();
  
  const projectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'projects'), where('creatorId', '==', user.uid));
  }, [firestore, user]);

  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  if (authLoading || (user && projectsLoading)) {
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
            <h3 className="text-xl font-semibold">No projects yet!</h3>
            <p className="text-muted-foreground mt-2 mb-4">You haven't created any projects. Get started by creating one.</p>
            <Button onClick={onOpenCreateDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Your First Project
            </Button>
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


export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);
  
  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-4">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-6 w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
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
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <header className="mb-12">
           <div className="flex justify-between items-start">
            <div className="text-left">
              <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
                My Dashboard
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Manage your created projects and view your contributions.
              </p>
            </div>
            <DialogTrigger asChild>
                <Button className="hidden sm:inline-flex">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Project
                </Button>
            </DialogTrigger>
          </div>
           <DialogTrigger asChild>
            <Button className="w-full sm:hidden mt-4">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Project
            </Button>
          </DialogTrigger>
        </header>
        <section>
          <h2 className="text-2xl font-bold font-headline mb-6">My Projects</h2>
          <UserProjectList onOpenCreateDialog={() => setDialogOpen(true)} />
        </section>
        <DialogContent className="sm:max-w-[480px]">
          <CreateProjectForm onProjectCreated={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
