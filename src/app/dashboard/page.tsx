'use client';

import React from 'react';
import { collection, query, where, getDocs, doc, getDoc, limit, getCountFromServer, orderBy } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useAuth } from '@/firebase/auth/use-user';
import { Button } from '@/components/ui/button';
import { ArrowRight, Briefcase, CheckCircle, PlusCircle, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Project } from '@/lib/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { volunteers } from '@/lib/data';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

function StatCard({ title, value, description, icon: Icon }: { title: string, value: string, description: string, icon: React.ElementType }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function ActiveProjects({ user }: { user: any }) {
  const firestore = useFirestore();
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchVolunteerProjects() {
      if (!user || !firestore) {
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
            .map(docSnap => ({ id: docSnap.id, ...docSnap.data(), status: 'In Progress' } as Project & { status: string }));

          setProjects(fetchedProjects);
        } else {
          setProjects([]);
        }
      } catch (error: any) {
        const permissionError = new FirestorePermissionError({
            path: 'projectVolunteers',
            operation: 'list',
          });
        errorEmitter.emit('permission-error', permissionError);
      } finally {
        setIsLoading(false);
      }
    }
    if (user) fetchVolunteerProjects();
    else setIsLoading(false);
  }, [user, firestore]);

  if (isLoading) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>Active Projects</CardTitle>
                  <CardDescription>A view of projects that are currently in progress.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex justify-between items-center">
                              <div className="space-y-1">
                                  <Skeleton className="h-4 w-48" />
                                  <Skeleton className="h-3 w-32" />
                              </div>
                              <Skeleton className="h-6 w-24 rounded-full" />
                              <Skeleton className="h-4 w-28" />
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      );
  }

  return (
      <Card className="h-full">
          <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>A view of projects that are currently in progress.</CardDescription>
          </CardHeader>
          <CardContent>
              {projects.length === 0 ? (
                   <div className="text-center py-10 border-2 border-dashed rounded-lg">
                      <p className="text-muted-foreground">You haven't selected any projects yet.</p>
                       <Button variant="link" asChild><Link href="/">Browse projects</Link></Button>
                  </div>
              ) : (
                  <div className="space-y-6">
                      <div className="grid grid-cols-[2fr,1fr,1fr] items-center gap-4 text-xs text-muted-foreground px-4 font-medium">
                          <span>Project</span>
                          <span className="text-center">Status</span>
                          <span className="text-right">Commitment</span>
                      </div>
                       {projects.map(project => (
                          <div key={project.id} className="grid grid-cols-[2fr,1fr,1fr] items-center gap-4 border-t pt-4">
                              <div>
                                  <p className="font-semibold">{project.title}</p>
                                  <p className="text-sm text-muted-foreground">{project.creatorName}</p>
                              </div>
                              <div className="text-center">
                                  <Badge variant="secondary">{project.status || 'In Progress'}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground text-right">{project.estimatedTimeCommitment}</p>
                          </div>
                       ))}
                  </div>
              )}
          </CardContent>
      </Card>
  );
}


function NewOpportunities({ user }: { user: any }) {
    const firestore = useFirestore();
    const [projects, setProjects] = React.useState<Project[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
  
    React.useEffect(() => {
      async function fetchOtherProjects() {
        if (!user || !firestore) {
          setIsLoading(false);
          return;
        }
        try {
          setIsLoading(true);

          // Fetch the latest projects from the platform.
          const projectsQuery = query(
            collection(firestore, 'projects'),
            orderBy('createdAt', 'desc'),
            limit(10)
          );
          
          const projectsSnapshot = await getDocs(projectsQuery);
          // Filter out projects created by the current user on the client-side
          const availableProjects = projectsSnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as Project))
            .filter(project => project.creatorId !== user.uid);
          
          setProjects(availableProjects);

        } catch (error: any) {
          const permissionError = new FirestorePermissionError({
            path: 'projects',
            operation: 'list'
          });
          errorEmitter.emit('permission-error', permissionError);

        } finally {
          setIsLoading(false);
        }
      }
      if (user) fetchOtherProjects();
      else setIsLoading(false);
    }, [user, firestore]);
  
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>New Opportunities</CardTitle>
                    <CardDescription>Check out the latest projects seeking volunteers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                         <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-16 w-16 rounded-lg" />
                            <div className="flex-grow space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                            <Skeleton className="h-8 w-8 rounded-md" />
                         </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>New Opportunities</CardTitle>
                <CardDescription>Check out the latest projects seeking volunteers.</CardDescription>
            </CardHeader>
            <CardContent>
                {projects.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-muted-foreground">No new opportunities right now.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {projects.map(project => (
                            <div key={project.id} className="flex items-center gap-4">
                                <Image src={`https://picsum.photos/seed/${project.id}/150/150`} alt={project.title} width={64} height={64} className="rounded-lg object-cover" />
                                <div className="flex-grow">
                                    <p className="font-semibold">{project.title}</p>
                                    <p className="text-sm text-muted-foreground">{project.creatorName}</p>
                                </div>
                                <Button asChild variant="outline" size="icon">
                                    <Link href={`/`}>
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const firestore = useFirestore();

  const [totalProjects, setTotalProjects] = React.useState(0);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
     const fetchTotalProjects = async () => {
        if (!firestore) return;
        const projectsCol = collection(firestore, 'projects');
        try {
            const snapshot = await getCountFromServer(projectsCol);
            setTotalProjects(snapshot.data().count);
        } catch(e: any) {
            const permissionError = new FirestorePermissionError({
                path: 'projects',
                operation: 'list',
              });
            errorEmitter.emit('permission-error', permissionError);
        }
     }
     if (firestore) fetchTotalProjects();

  }, [user, loading, router, firestore]);
  
  if (loading || !user) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                    <Skeleton className="h-28 w-full" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-96 lg:col-span-2" />
                    <Skeleton className="h-96" />
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Projects" value={totalProjects.toString()} description="All projects on the platform" icon={Briefcase} />
                <StatCard title="Volunteers" value={volunteers.length.toString()} description="Ready to help" icon={Users} />
                <StatCard title="Projects Completed" value="+1" description="Successfully delivered" icon={CheckCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <ActiveProjects user={user} />
                </div>
                <div>
                    <NewOpportunities user={user} />
                </div>
            </div>
        </div>
    </div>
  );
}
