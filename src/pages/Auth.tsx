
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

const Auth = () => {
  const { user, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate("/")
    }
  }, [user, navigate])

  return (
    <Shell className="grid h-screen place-items-center" showThemeToggle={true}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">Attack Mode</h1>
          <p className="text-muted-foreground">Manage your tasks on the go</p>
        </div>
        <AuthForm />
        <Separator className="my-6" />
        <div className="grid gap-3">
          <Link to="/auth/social" className={buttonVariants({ variant: "outline", className: "flex items-center gap-2 hover:bg-secondary transition-colors" })}>
            <Icons.gitHub className="h-5 w-5" />
            Continue with GitHub
          </Link>
          <Link to="/auth/social" className={buttonVariants({ variant: "outline", className: "flex items-center gap-2 hover:bg-secondary transition-colors" })}>
            <Icons.google className="h-5 w-5" />
            Continue with Google
          </Link>
        </div>
      </div>
    </Shell>
  )
}

export default Auth
