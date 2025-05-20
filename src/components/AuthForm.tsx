
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="••••••••"
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button disabled={isLoading} type="submit" className="w-full">
            {isLoading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>
      </Form>
      
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
