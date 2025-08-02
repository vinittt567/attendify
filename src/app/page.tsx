import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const GoogleIcon = () => (
    <svg className="size-5" viewBox="0 0 48 48" aria-hidden="true">
        <title>Google</title>
        <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.38 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"></path>
        <path fill="#34A853" d="M24 48c6.5 0 11.93-2.13 15.89-5.81l-7.11-5.52c-2.17 1.45-4.92 2.3-8.78 2.3-6.76 0-12.47-4.55-14.51-10.61H2.38v5.7C6.32 42.85 14.48 48 24 48z"></path>
        <path fill="#FBBC05" d="M9.49 28.19c-.45-1.32-.7-2.72-.7-4.19s.25-2.87.7-4.19v-5.7H2.38C.82 17.1.01 20.44 0 24c0 3.56.82 6.9 2.38 9.89l7.11-5.7z"></path>
        <path fill="#EA4335" d="M24 9.16c3.52 0 6.62 1.21 9.09 3.52l6.29-6.29C35.93 2.66 30.5 0 24 0 14.48 0 6.32 5.15 2.38 12.43l7.11 5.7c2.04-6.06 7.75-10.61 14.51-10.61z"></path>
        <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
);


export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/30 p-4 font-body">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-border/20 animate-fade-in-up">
          <CardHeader className="text-center p-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary mb-6 ring-8 ring-primary/10">
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </div>
            <CardTitle className="font-headline text-4xl font-bold text-primary tracking-tight">Attendify</CardTitle>
            <CardDescription className="pt-2 text-lg text-muted-foreground/80">
              The modern way to track your attendance.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Button asChild className="w-full h-14 text-lg font-semibold transform hover:scale-105 transition-transform duration-200">
              <Link href="/dashboard">
                <GoogleIcon />
                Sign in with Google
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
       <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Attendify. All rights reserved.</p>
      </footer>
    </main>
  );
}
