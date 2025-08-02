'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';

const GoogleIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24px" 
      height="24px" 
      fill="currentColor" 
      viewBox="0 0 256 256"
    >
      <path d="M224,128a96,96,0,1,1-21.95-61.09,8,8,0,1,1-12.33,10.18A80,80,0,1,0,207.6,136H128a8,8,0,0,1,0-16h88A8,8,0,0,1,224,128Z"></path>
    </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The onAuthStateChanged listener will handle the redirect
    } catch (error: any) {
      console.error("Authentication error:", error);
      
      // Avoid showing a toast if the user closes the popup
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }

      toast({
        title: "Uh Oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-slate-50 justify-between group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
    >
      <div>
        <div className="flex items-center bg-slate-50 p-4 pb-2 justify-between">
          <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12 pr-12">
            Attendance Tracker
          </h2>
        </div>
        <h3 className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
          Welcome to Attendance Tracker
        </h3>
        <div className="@container">
          <div className="@[480px]:px-4 @[480px]:py-3">
            <div
              className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden bg-slate-50 @[480px]:rounded-xl min-h-80"
              style={{
                backgroundImage: `url("https://placehold.co/600x400.png")`
              }}
              data-ai-hint="students classroom"
            ></div>
          </div>
        </div>
        <div className="p-4">
          <div
            className="bg-cover bg-center flex flex-col items-stretch justify-end rounded-xl pt-[132px]"
            style={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 100%), url("https://placehold.co/600x300.png")`
            }}
            data-ai-hint="attendance register"
          >
            <div className="flex w-full items-end justify-between gap-4 p-4">
              <p className="text-white tracking-light text-2xl font-bold leading-tight flex-1">
                Sign in with Google
              </p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex px-4 py-3 justify-center">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#e7edf3] text-[#0e141b] gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em]"
            onClick={handleSignIn}
          >
            <div className="text-[#0e141b]">
              <GoogleIcon />
            </div>
            <span className="truncate">Sign in with Google</span>
          </button>
        </div>
        <div className="h-5 bg-slate-50"></div>
      </div>
    </div>
  );
}
