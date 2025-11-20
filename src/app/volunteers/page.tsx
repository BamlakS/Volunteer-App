import type { Volunteer } from '@/lib/types';
import { volunteers } from '@/lib/data';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, Calendar } from 'lucide-react';

function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden transition-transform transform hover:-translate-y-1 hover:shadow-xl duration-300 ease-in-out">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/20">
            <AvatarImage src={volunteer.avatarUrl} alt={volunteer.name} />
            <AvatarFallback>{volunteer.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-xl">{volunteer.name}</CardTitle>
            <CardDescription className="italic text-sm">{volunteer.tagline}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Skills</h4>
          <div className="flex flex-wrap gap-1">
            {volunteer.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-start text-sm">
          <Briefcase className="mr-2 h-4 w-4 mt-1 shrink-0 text-muted-foreground" />
          <p>
            <span className="font-semibold text-foreground/90">Experience: </span>{volunteer.experience}
          </p>
        </div>
        <div className="flex items-center text-sm">
          <Calendar className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <p>
            <span className="font-semibold text-foreground/90">Availability: </span>{volunteer.availability}
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Connect
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function VolunteersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">
          Our Talented Volunteers
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the skilled professionals ready to dedicate their time and expertise to your cause.
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {volunteers.map((volunteer) => (
          <VolunteerCard key={volunteer.id} volunteer={volunteer} />
        ))}
      </div>
    </div>
  );
}
