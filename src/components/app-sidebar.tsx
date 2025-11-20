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
  PanelLeft,
} from 'lucide-react';
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
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import React from 'react';
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from './ui/sidebar';

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

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { state } = useSidebar();

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
          <div className="flex flex-col gap-2">
            <Button asChild variant="default" size="lg">
              <Link href="/create-project">
                <PlusCircle />
                <span>Create Project</span>
              </Link>
            </Button>
          </div>
        )}

        <SidebarMenu className="mt-4">
          {navLinks.map((link) => {
            // Conditionally render the "Create Project" link for authenticated users
            if (link.href === '/create-project' && !user) return null;
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
