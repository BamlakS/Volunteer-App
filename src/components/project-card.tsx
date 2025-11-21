'use client';

import { useState } from 'react';
import { Heart, Clock, User, Trash2 } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useAuth, useFirestore } from '@/firebase';
import { doc, deleteDoc, collection } from 'firebase/firestore';
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
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { FirestorePermissionError } from '@/firebase/errors';
import { errorEmitter } from '@/firebase/error-emitter';

export function ProjectCard({ project }: { project: Project }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const firestore = useFirestore();

  const handleSelectProject = () => {
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

    addDocumentNonBlocking(projectVolunteersCol, newApplication).then(() => {
        toast({
          title: "Project Selected!",
          description: `You have applied to "${project.title}". You can track it on your dashboard.`,
        });
    }).catch(error => {
      // The non-blocking function already emits the contextual error.
      // We can show a generic toast here if we want, but the main debugging
      // error will appear in the dev overlay.
      toast({
        variant: 'destructive',
        title: 'Application Failed',
        description: 'Could not apply to the project due to a permission issue.',
      });
    });
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    toast({
        title: isFavorited ? 'Removed from favorites' : 'Added to favorites',
        description: `"${project.title}" has been ${isFavorited ? 'removed from' : 'added to'} your favorites.`,
    });
  }

  const handleDeleteProject = async () => {
    if (!user || user.uid !== project.creatorId) {
        toast({
            variant: 'destructive',
            title: 'Unauthorized',
            description: 'You are not authorized to delete this project.',
        });
        return;
    }

    const projectRef = doc(firestore, 'projects', project.id);
    deleteDocumentNonBlocking(projectRef);
    toast({
        title: 'Project Deleted',
        description: `"${project.title}" has been successfully deleted.`,
    });
  };

  const isOwner = user?.uid === project.creatorId;

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
                            className="rounded-full h-10 w-10 text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 className="h-5 w-5" />
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
                className="rounded-full h-10 w-10"
            >
                <Heart
                className={cn(
                    'h-5 w-5 transition-all duration-300 group-hover:scale-110',
                    isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'
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
          <div className="flex flex-wrap gap-1">
            {project.requiredSkills && project.requiredSkills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        {project.timeCommitment && (
          <div className="flex items-center text-muted-foreground text-sm pt-2">
            <Clock className="mr-2 h-4 w-4" />
            <span>{project.timeCommitment}</span>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSelectProject} disabled={isOwner}>
          {isOwner ? "This is your project" : "Select Project"}
        </Button>
      </CardFooter>
    </Card>
  );
}
