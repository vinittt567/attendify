
'use client';

import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/context/auth-provider';
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
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);


  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // The auth provider will handle the redirect
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      
      console.error("Authentication error:", error);
      toast({
        title: "Uh Oh! Something went wrong.",
        description: "There was a problem with your request.",
        variant: "destructive",
      });
    }
  };
  
  if (loading || user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col justify-between group/design-root overflow-x-hidden"
      style={{
        fontFamily: 'Manrope, "Noto Sans", sans-serif',
        background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--primary)) 100%)',
      }}
    >
      <div>
        <div className="flex items-center p-4 pb-2 justify-between">
          <h2 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pl-12 pr-12">
            Attendance Tracker
          </h2>
        </div>
        <h3 className="text-[#0e141b] tracking-light text-2xl font-bold leading-tight px-4 text-center pb-2 pt-5">
          Welcome to Attendance Tracker
        </h3>
        <div className="p-4 sm:p-8">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-8 space-y-8 border">
                <div className="flex items-start gap-4">
                <div className="text-3xl">📚</div>
                <div>
                    <h4 className="font-bold text-lg text-slate-800">Create Subjects</h4>
                    <p className="text-slate-600 mt-1">Easily create and manage your subjects with custom names and color tags.</p>
                </div>
                </div>
                <div className="flex items-start gap-4">
                <div className="text-3xl">🗓️</div>
                <div>
                    <h4 className="font-bold text-lg text-slate-800">Mark Daily Attendance</h4>
                    <p className="text-slate-600 mt-1">Quickly mark your attendance every day using an intuitive calendar view.</p>
                </div>
                </div>
                <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div>
                    <h4 className="font-bold text-lg text-slate-800">View Attendance Stats</h4>
                    <p className="text-slate-600 mt-1">Get insightful AI-powered summaries and statistics for each of your subjects.</p>
                </div>
                </div>
            </div>
        </div>
      </div>
      <div>
        <div className="flex px-4 py-3 justify-center">
          <button
            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-5 bg-[#e7edf3] text-[#0e141b] gap-2 pl-5 text-base font-bold leading-normal tracking-[0.015em] shadow-md hover:shadow-lg transition-shadow"
            onClick={handleSignIn}
          >
            <div className="text-[#0e141b]">
              <GoogleIcon />
            </div>
            <span className="truncate">Sign in with Google</span>
          </button>
        </div>
        <div className="h-5"></div>
      </div>
    </div>
  );
}
