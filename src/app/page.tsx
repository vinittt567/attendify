
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';
import { getFirebaseAuth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const auth = getFirebaseAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const handleLogin = async () => {
    if (!auth) return;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (error) {
      console.error("Authentication failed:", error);
      // Optionally, show a toast notification to the user
    }
  };

  if (loading || user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return (
    <div
      className="relative flex size-full min-h-screen flex-col justify-center items-center group/design-root overflow-x-hidden p-4"
      style={{
        background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)',
      }}
    >
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 sm:p-12 text-center border max-w-md w-full">
            <h1 className="font-headline text-primary text-3xl sm:text-4xl font-bold">Attendify</h1>
            <h2 className="mt-2 text-xl font-semibold text-foreground">Welcome Back!</h2>
            <p className="mt-2 text-muted-foreground">Sign in to manage your attendance.</p>
            <div className="mt-8">
                <Button 
                    onClick={handleLogin} 
                    className="w-full h-12 text-base font-bold"
                    variant="outline"
                >
                    <FcGoogle className="mr-3 h-6 w-6" />
                    Sign in with Google
                </Button>
            </div>
             <p className="mt-6 text-xs text-muted-foreground">
                By signing in, you agree to our terms of service.
            </p>
        </div>
    </div>
  );
}

    