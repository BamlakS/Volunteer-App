'use client';

import React from 'react';
import { collection, query, where } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/firebase/auth/use-user';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ProjectList({ status }: { status?: 'All' | 'Open' | 'In Progress' | 'Completed' }) {
  const firestore = useFirestore();
  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    if (status && status !== 'All') {
      return query(collection(firestore, 'projects'), where('status', '==', status));
    }
    return query(collection(firestore, 'projects'));
  }, [firestore, status]);

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
        <div className="text-center py-20 flex flex-col items-center justify-center border-2 border-dashed rounded-lg mt-8">
             <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
             <p className="text-muted-foreground mb-4">{status && status !== 'All' ? `There are no projects with the status "${status}".` : "Be the first one to create a project!"}</p>
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
        <ProjectCard key={project.id} project={project} user={user} />
      ))}
    </div>
  );
}


export default function HomePage() {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
       <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold font-headline">Projects</h1>
           {user && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Create a New Project</DialogTitle>
                    <DialogDescription>
                      Fill out the details below to list your project for volunteers.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateProjectForm user={user} onProjectCreated={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
          )}
        </div>

        <Tabs defaultValue="all">
          <TabsList className="bg-transparent p-0 border-b-0 rounded-none">
            <TabsTrigger value="all" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">All</TabsTrigger>
            <TabsTrigger value="open" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">Open</TabsTrigger>
            <TabsTrigger value="in-progress" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">In Progress</TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:shadow-none data-[state=active]:border-b-2 border-primary rounded-none">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-6">
            <ProjectList status="All" />
          </TabsContent>
          <TabsContent value="open" className="mt-6">
            <ProjectList status="Open" />
          </TabsContent>
          <TabsContent value="in-progress" className="mt-6">
            <ProjectList status="In Progress" />
          </TabsContent>
          <TabsContent value="completed" className="mt-6">
            <ProjectList status="Completed" />
          </TabsContent>
        </Tabs>
      </header>
    </div>
  );
}
