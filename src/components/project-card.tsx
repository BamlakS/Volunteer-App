'use client';

import { useState } from 'react';
import { Heart, Clock, Users } from 'lucide-react';
import type { Project } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function ProjectCard({ project }: { project: Project }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleSelectProject = () => {
    toast({
      title: "Project Selected!",
      description: `You have been added to "${project.title}". Check your messages for details.`,
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

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ease-in-out group">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-grow">
            <CardTitle className="font-headline text-xl mb-1">{project.title}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4" />
              {project.nonprofit}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className="shrink-0 rounded-full h-10 w-10"
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all duration-300 group-hover:scale-110',
                isFavorited ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              )}
            />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
        <div>
          <h4 className="font-semibold mb-2 text-sm">Required Skills</h4>
          <div className="flex flex-wrap gap-1">
            {project.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center text-muted-foreground text-sm pt-2">
          <Clock className="mr-2 h-4 w-4" />
          <span>{project.timeCommitment}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleSelectProject}>
          Select Project
        </Button>
      </CardFooter>
    </Card>
  );
}
