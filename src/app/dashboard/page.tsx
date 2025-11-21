'use client';

import React from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useAuth } from '@/firebase/auth/use-user';
import { ProjectCard } from '@/components/project-card';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateProjectForm } from '@/components/create-project-form';

function UserCreatedProjectsList() {
  const firestore = useFirestore();
  const { user, loading: authLoading } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  
  const projectsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, 'projects'), where('creatorId', '==', user.uid));
  }, [firestore, user]);

  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const handleProjectCreated = () => {
    setIsDialogOpen(false);
  };

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
      <div className="text-center py-10 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-4">You haven't created any projects yet. Create one to get started!</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
                <PlusCircle className="mr-2 h-5 w-5" />
                Create a Project
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline">Create a New Project</DialogTitle>
              <DialogDescription>
                Fill out the details below to list your project for volunteers.
              </DialogDescription>
            </DialogHeader>
            {user && <CreateProjectForm user={user} onProjectCreated={handleProjectCreated} />}
          </DialogContent>
        </Dialog>
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

function UserVolunteerProjectsList() {
    const firestore = useFirestore();
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
  
    React.useEffect(() => {
      async function fetchVolunteerProjects() {
        if (!user) {
          setIsLoading(false);
          return;
        }
  
        try {
          setIsLoading(true);
          const projectVolunteersQuery = query(
            collection(firestore, 'projectVolunteers'),
            where('volunteerId', '==', user.uid)
          );
          const querySnapshot = await getDocs(projectVolunteersQuery);
          const projectIds = querySnapshot.docs.map(d => d.data().projectId);
          
          if (projectIds.length > 0) {
            const projectDocs = await Promise.all(
              projectIds.map(id => getDoc(doc(firestore, 'projects', id)))
            );
            
            const fetchedProjects = projectDocs
              .filter(docSnap => docSnap.exists())
              .map(docSnap => ({ id: docSnap.id, ...docSnap.data() } as Project));
            
            setProjects(fetchedProjects);
          } else {
            setProjects([]);
          }
        } catch (error) {
          console.error("Error fetching volunteer projects:", error);
        } finally {
          setIsLoading(false);
        }
      }
  
      if (!authLoading) {
        fetchVolunteerProjects();
      }
    }, [user, authLoading, firestore]);
  
    if (authLoading || isLoading) {
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
  
    if (projects.length === 0) {
      return (
        <div className="text-center py-10 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">You haven't selected any projects to volunteer for yet.</p>
          <p className="text-sm text-muted-foreground mt-1">Browse projects on the homepage to get started.</p>
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
        <header className="mb-8">
           <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
              My Dashboard
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage your created projects and view your contributions.
            </p>
          </div>
        </header>
        <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline mb-6">My Volunteer Projects</h2>
          <UserVolunteerProjectsList />
        </section>
         <section className="mt-12">
          <h2 className="text-2xl font-bold font-headline mb-6">Created By Me</h2>
          <UserCreatedProjectsList />
        </section>
    </div>
  );
}
