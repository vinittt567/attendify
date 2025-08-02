'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

type HeaderProps = {
  onAddSubject: () => void;
};

export function Header({ onAddSubject }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const user = auth.currentUser;

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Attendify
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <Button onClick={onAddSubject} className="hidden sm:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
        <Button onClick={onAddSubject} size="icon" className="flex sm:hidden">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add Subject</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer">
              <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100.png"} alt="User" data-ai-hint="user avatar" />
              <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.displayName ?? 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
