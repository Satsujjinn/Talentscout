import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-[#e8dfc8] bg-[#fefefe] px-3 py-2 text-sm text-[#6a5a3f] ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#9a8558] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c23a] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
