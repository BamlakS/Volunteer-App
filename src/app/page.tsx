import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/project-card';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Find Your Next Volunteer Project
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Connect with non-profits and use your tech skills for good. Browse projects, find your fit, and start making a difference today.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
