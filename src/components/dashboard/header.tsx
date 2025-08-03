
'use client';

import { Button } from "@/components/ui/button";
import { PlusCircle, BookOpen, LogOut, CalendarDays, LayoutDashboard } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

type HeaderProps = {
  onAddSubject: () => void;
};

export function Header({ onAddSubject }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isTimetablePage = pathname === '/dashboard/timetable';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-7 w-7 text-primary" />
        <h1 className="font-headline text-2xl font-bold tracking-tight text-primary sm:text-3xl">
          Attendify
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {isTimetablePage ? (
          <>
            <Button variant="outline" onClick={() => router.push('/dashboard')} className="hidden sm:flex">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="outline" size="icon" onClick={() => router.push('/dashboard')} className="flex sm:hidden">
              <LayoutDashboard className="h-4 w-4" />
              <span className="sr-only">Dashboard</span>
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => router.push('/dashboard/timetable')} className="hidden sm:flex">
              <CalendarDays className="mr-2 h-4 w-4" />
              Timetable
            </Button>
             <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/timetable')} className="flex sm:hidden">
              <CalendarDays className="h-4 w-4" />
               <span className="sr-only">Timetable</span>
            </Button>
          </>
        )}
        
        <Button onClick={onAddSubject} className="hidden sm:flex">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Subject
        </Button>
        <Button onClick={onAddSubject} size="icon" className="flex sm:hidden">
          <PlusCircle className="h-4 w-4" />
          <span className="sr-only">Add Subject</span>
        </Button>
        <Button variant="outline" onClick={() => router.push('/')}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
        </Button>
      </div>
    </header>
  );
}
