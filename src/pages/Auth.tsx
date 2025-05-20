
import { useEffect } from "react"
import { Icons } from "@/components/icons"
import { buttonVariants } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Shell } from "@/components/Shell"
import { Logo } from "@/components/Logo"
import { AuthForm } from "@/components/AuthForm"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

const Auth = () => {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Google sign-in error",
        description: error.message || "Failed to sign in with Google"
      });
    }
  };

  return (
    <Shell className="grid h-screen place-items-center bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="mb-6 text-center">
          <Logo className="mx-auto mb-4 h-12 w-12" />
          <h1 className="text-2xl font-bold text-slate-800">Attack Mode</h1>
          <p className="text-slate-500 text-sm">Manage your tasks on the go</p>
        </div>
        
        {/* Email Authentication Form */}
        <AuthForm />
        
        <Separator className="my-6">
          <span className="px-2 text-xs text-slate-400">OR</span>
        </Separator>
        
        {/* Google Authentication Button */}
        <button 
          onClick={handleGoogleSignIn}
          className={buttonVariants({ 
            variant: "outline", 
            className: "w-full flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
          })}
        >
          <Icons.google className="h-5 w-5" />
          Sign in with Google
        </button>
      </div>
    </Shell>
  )
}

export default Auth
