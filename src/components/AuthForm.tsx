
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"

// Schema for form validation
const authFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
})

type AuthFormValues = z.infer<typeof authFormSchema>

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const { toast } = useToast()

  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: AuthFormValues) {
    setIsLoading(true)
    
    try {
      if (isSignUp) {
        // Handle sign up
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })
        
        if (error) throw error
        
        toast({
          title: "Account created",
          description: "Please check your email for verification",
        })
      } else {
        // Handle sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        })
        
        if (error) throw error
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: error.message || "Something went wrong",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...form.register("email")}
          />
          {form.formState.errors.email && (
            <p className="text-xs text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...form.register("password")}
          />
          {form.formState.errors.password && (
            <p className="text-xs text-red-500">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
        </Button>
      </form>
      <div className="text-center">
        <Button
          variant="link"
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </Button>
      </div>
    </div>
  )
}
