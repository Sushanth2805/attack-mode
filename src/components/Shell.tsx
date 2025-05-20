
import { cn } from "@/lib/utils"
import { MoonIcon, SunIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/hooks/useTheme"

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {
  showThemeToggle?: boolean
}

export function Shell({ 
  children, 
  className, 
  showThemeToggle = false,
  ...props 
}: ShellProps) {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className={cn("container px-4 md:px-8 relative", className)} {...props}>
      {showThemeToggle && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 right-4 rounded-full"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
        </Button>
      )}
      {children}
    </div>
  )
}
