'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HandHeart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navLinks = [
  { href: '/', label: 'Projects' },
  { href: '/volunteers', label: 'Volunteers' },
  { href: '/messages', label: 'Messages' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <HandHeart className="h-6 w-6 text-primary" />
          <span className="hidden font-bold font-headline text-lg sm:inline-block">
            VolunteerConnect
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Button variant="outline">Log In</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Sign Up</Button>
        </div>
      </div>
    </header>
  );
}
