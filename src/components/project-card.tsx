'use client';

import { useState } from 'react';
import { Heart, Clock, User, Trash2, CheckCircle } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useFirestore } from '@/firebase';
import { doc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import type { User as FirebaseUser } from 'firebase/auth';

type ProjectCardProps = {
  project: Project;
  user: FirebaseUser | null;
};

export function ProjectCard({ project, user }: ProjectCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  const firestore = useFirestore();
  const router = useRouter();

  const handleSelectProject = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in',
        description: 'You need to be logged in to select a project.',
      });
      return;
    }
    
    const projectVolunteersCol = collection(firestore, 'projectVolunteers');
    const newApplication = {
      projectId: project.id,
      volunteerId: user.uid,
      status: 'applied', // You can add a status
      appliedAt: new Date(),
    };
    
    const projectRef = doc(firestore, 'projects', project.id);

    try {
      // Create the application and update the project status
      await Promise.all([
        addDocumentNonBlocking(projectVolunteersCol, newApplication),
        updateDocumentNonBlocking(projectRef, { status: 'In Progress' })
      ]);

      toast({
        title: "Project Selected!",
        description: `You have applied to "${project.title}". It is now in progress.`,
      });

      // Redirect to the projects page, focusing the 'In Progress' tab
      router.push('/?tab=in-progress');
      router.refresh();


    } catch (error) {
       // The non-blocking functions already emit contextual errors.
       // We show a generic toast here.
       toast({
         variant: 'destructive',
         title: 'Application Failed',
         description: 'Could not apply to the project due to a permission issue.',
       });
    }
  };

  const handleCompleteProject = async () => {
    if (!user || user.uid !== project.creatorId) {
      toast({
        variant: 'destructive',
        title: 'Unauthorized',
        description: 'You are not authorized to complete this project.',
      });
      return;
    }

    const projectRef = doc(firestore, 'projects', project.id);

    try {
      await updateDocumentNonBlocking(projectRef, { status: 'Completed' });
      toast({
        title: 'Project Completed!',
        description: `"${project.title}" has been moved to completed.`,
      });
      router.push('/?tab=completed');
      router.refresh();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'Could not complete the project due to a permission issue.',
      });
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
        title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        description: `"${project.title}" has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  }

  const handleDeleteProject = () => {
    if (!user || user.uid !== project.creatorId) {
        toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'You are not authorized to delete this project.',
        });
        return;
    }

    const projectRef = doc(firestore, 'projects', project.id);
    deleteDocumentNonBlocking(projectRef)
      .then(() => {
        toast({
            title: 'Project Deleted',
            description: `"${project.title}" has been successfully deleted.`,
        });
        router.refresh();
      })
      .catch(() => {
        toast({
            variant: 'destructive',
            title: 'Deletion Failed',
            description: 'Could not delete the project due to a permission issue.',
        });
      });
  };

  const isOwner = user?.uid === project.creatorId;

  const renderFooter = () => {
    if (isOwner) {
      if (project.status === 'In Progress') {
        return (
          <Button className="w-full" onClick={handleCompleteProject}>
            <CheckCircle className="mr-2 h-4 w-4" />
            Mark as Completed
          </Button>
        );
      }
      if (project.status === 'Completed') {
        return <Button className="w-full" disabled>Project Completed</Button>;
      }
      return <Button className="w-full" disabled>This is your project</Button>;
    }

    switch (project.status) {
      case 'In Progress':
        return <Button className="w-full" disabled>Project In Progress</Button>;
      case 'Completed':
        return <Button className="w-full" disabled>Project Completed</Button>;
      case 'Open':
      default:
        return <Button className="w-full" onClick={handleSelectProject}>Select Project</Button>;
    }
  };


  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ease-in-out group">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow">
            <CardTitle className="font-headline text-xl mb-1">{project.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
                <Avatar className="h-5 w-5">
                    <AvatarImage src={project.creatorAvatarUrl} />
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              <span>{project.creatorName}</span>
            </CardDescription>
          </div>
           <div className="flex items-center shrink-0">
            {isOwner && (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete project"
                            className="rounded-full h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the project
                                "{project.title}".
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteProject} className={buttonVariants({ variant: "destructive" })}>
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleFavorite}
                aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
                className="rounded-full h-8 w-8"
            >
                <Heart
                className={cn(
                    'h-4 w-4 transition-all duration-300',
                    isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground group-hover:text-destructive'
                )}
                />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
        <div>
          <h4 className="font-semibold mb-2 text-sm">Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {(project.requiredSkills || []).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        {project.estimatedTimeCommitment && (
          <div className="flex items-center text-muted-foreground text-sm pt-2">
            <Clock className="mr-2 h-4 w-4" />
            <span>{project.estimatedTimeCommitment}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {renderFooter()}
      </CardFooter>
    </Card>
  );
}
