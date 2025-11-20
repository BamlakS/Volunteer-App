'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { SKILLS } from '@/lib/skills';
import { Badge } from './ui/badge';
import { useRouter } from 'next/navigation';

const projectSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters.' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters.' }),
  timeCommitment: z.string().min(3, { message: 'Please provide an estimated time commitment.' }),
  skills: z.array(z.string()).min(1, { message: 'Please select at least one skill.' }),
});

type CreateProjectFormProps = {
  onProjectCreated?: () => void;
};

export function CreateProjectForm({ onProjectCreated }: CreateProjectFormProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const firestore = useFirestore();
  const router = useRouter();

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      timeCommitment: '',
      skills: [],
    },
  });

  async function onSubmit(values: z.infer<typeof projectSchema>) {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Authentication Error',
            description: 'You must be logged in to create a project.',
        });
        return;
    }
    setLoading(true);
    
    try {
        const projectsCol = collection(firestore, 'projects');
        const newProject = {
            ...values,
            creatorId: user.uid,
            creatorName: user.displayName || 'Anonymous',
            creatorAvatarUrl: user.photoURL || '',
            createdAt: new Date(),
        };

        const docRefPromise = addDocumentNonBlocking(projectsCol, newProject);
        
        toast({
            title: 'Project Created!',
            description: 'Your new project has been listed successfully.',
        });

        // Optimistically redirect
        onProjectCreated?.();
        
        // Wait for the document to be created to get the ID for the redirect
        const docRef = await docRefPromise;
        if(docRef) {
          // No redirect here, onProjectCreated handles it.
        }


    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Could not create the project.',
      });
    } finally {
      setLoading(false);
    }
  }

  const toggleSkill = (skill: string) => {
    const currentSkills = form.getValues('skills');
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter((s) => s !== skill)
      : [...currentSkills, skill];
    form.setValue('skills', newSkills, { shouldValidate: true });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Redesign Community Website" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the project, its goals, and the impact it will have."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="timeCommitment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated Time Commitment</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 5-10 hours/week for 3 months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="skills"
            render={() => (
                <FormItem>
                    <FormLabel>Required Skills</FormLabel>
                     <FormDescription>
                        Select the skills needed for this project.
                    </FormDescription>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {SKILLS.map((skill) => (
                            <Badge
                                key={skill}
                                variant={form.getValues('skills').includes(skill) ? 'default' : 'secondary'}
                                className="cursor-pointer"
                                onClick={() => toggleSkill(skill)}
                            >
                                {skill}
                            </Badge>
                        ))}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating Project...' : 'Create Project'}
        </Button>
      </form>
    </Form>
  );
}
