
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
    <Shell className="grid h-screen place-items-center">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Logo className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold">Attack Mode</h1>
          <p className="text-gray-500">Manage your tasks on the go</p>
        </div>
        <AuthForm />
        <Separator className="my-4" />
        <div className="grid gap-2">
          <Link to="/auth/social" className={buttonVariants({ variant: "outline" })}>
            <Icons.gitHub className="mr-2 h-4 w-4" />
            GitHub
          </Link>
          <Link to="/auth/social" className={buttonVariants({ variant: "outline" })}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Link>
        </div>
      </div>
    </Shell>
  )
}

export default Auth
