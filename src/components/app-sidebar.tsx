'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  HandHeart,
  LogOut,
  PlusCircle,
  LayoutDashboard,
  FolderKanban,
  Users,
  MessageSquare,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import { useAuth } from '@/firebase/auth/use-user';
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import React from 'react';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';
import { Input } from './ui/input';
import { CreateProjectForm } from './create-project-form';

const navLinks = [
  { href: '/', label: 'Projects', icon: FolderKanban },
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
  { href: '/volunteers', label: 'Volunteers', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare, auth: true },
];

function AuthState() {
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

  if (loading) {
    return <div className="h-9 w-full bg-muted rounded-md animate-pulse" />;
  }

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="w-full justify-start p-2 h-auto text-left">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
              <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-none truncate text-sidebar-foreground">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground truncate">{user.email}</p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName}</p>
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
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
    );
  }

  return (
    <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
      <div className="flex flex-col space-y-2">
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            Log In
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button className="w-full">Sign Up</Button>
        </DialogTrigger>
      </div>
      <DialogContent className="sm:max-w-[425px]">
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      </DialogContent>
    </Dialog>
  );
}

export function TopBar() {
    const { user } = useAuth();
    return (
        <div className="flex items-center justify-between h-16 px-4 border-b bg-card">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search projects..." className="pl-10" />
            </div>
            {user && (
                <Avatar>
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase() || 'VC'}</AvatarFallback>
                </Avatar>
            )}
        </div>
    )
}

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { state } = useSidebar();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Link href="/" className="flex-1 flex items-center space-x-2 overflow-hidden">
            <HandHeart className="h-7 w-7 text-primary" />
            <span className="font-bold font-headline text-xl truncate">VolunteerConnect</span>
          </Link>
          {state === 'expanded' && <SidebarTrigger className="hidden md:flex" />}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        { user && (
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
               <Button variant="default" size="lg" className="w-full">
                  <PlusCircle />
                  <span>Create Project</span>
              </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-headline">Create a New Project</DialogTitle>
                <DialogDescription>
                  Fill out the details below to list your project for volunteers.
                </DialogDescription>
              </DialogHeader>
              <CreateProjectForm user={user} onProjectCreated={() => setIsDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

        <SidebarMenu className="mt-4">
          {navLinks.map((link) => {
            if (link.auth && !user) return null;
            const isActive = pathname === link.href;
            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={link.href}>
                    <link.icon />
                    <span>{link.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <AuthState />
      </SidebarFooter>
    </>
  );
}
