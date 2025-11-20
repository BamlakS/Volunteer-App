'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HandHeart, LogOut, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useAuth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { signOut } from '@/firebase/auth/auth-service';
import { useToast } from '@/hooks/use-toast';
import { AuthForm } from './auth-form';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from './ui/dialog';
import React from 'react';

const navLinks = [
  { href: '/', label: 'Projects' },
  { href: '/create-project', label: 'Create Project', auth: true },
  { href: '/volunteers', label: 'Volunteers' },
  { href: '/messages', label: 'Messages' },
];

export function Header() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [authDialogOpen, setAuthDialogOpen] = React.useState(false);
  const router = useRouter();


  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed Out',
        description: "You've successfully signed out.",
      });
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your sign-out.',
      });
    }
  };
  
  const handleAuthSuccess = () => {
    setAuthDialogOpen(false);
    router.refresh();
  };

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
          {navLinks.map((link) => {
            if (link.auth && !user) return null;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            )
          })}
           {user && (
            <Link
              href="/dashboard"
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === '/dashboard'
                  ? 'text-foreground'
                  : 'text-foreground/60'
              )}
            >
              Dashboard
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {loading ? (
            <div className="h-8 w-8 bg-muted rounded-full animate-pulse" />
          ) : user ? (
            <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || 'User'}
                    />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/create-project">Create Project</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </>
          ) : (
            <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
              <div className="flex items-center space-x-2">
                <DialogTrigger asChild>
                  <Button variant="outline">Log In</Button>
                </DialogTrigger>
                <DialogTrigger asChild>
                  <Button>
                    Sign Up
                  </Button>
                </DialogTrigger>
              </div>
              <DialogContent className="sm:max-w-[425px]">
                <AuthForm onAuthSuccess={handleAuthSuccess} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </header>
  );
}
