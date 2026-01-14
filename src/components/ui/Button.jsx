import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
  {
    variants: {
      variant: {
        default:
          "bg-gray-800 text-gray-100 hover:bg-gray-700 active:bg-gray-600 shadow-sm",
        destructive:
          "bg-red-600 text-gray-100 hover:bg-red-700 active:bg-red-800 shadow-sm focus-visible:ring-red-500",
        outline:
          "border border-gray-600 bg-transparent text-gray-200 hover:bg-gray-800 hover:text-gray-100",
        secondary:
          "bg-gray-700 text-gray-200 hover:bg-gray-600 active:bg-gray-500 shadow-sm",
        ghost:
          "text-gray-300 hover:bg-gray-800 hover:text-gray-100",
        link:
          "text-indigo-400 underline-offset-4 hover:underline hover:text-indigo-300",
        edit:
          "bg-indigo-600/10 text-indigo-400 border border-indigo-700/30 hover:bg-indigo-600/20 hover:border-indigo-600/50",
        delete:
          "bg-red-600/10 text-red-400 border border-red-700/30 hover:bg-red-600/20 hover:border-red-600/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button"
  return React.createElement(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  )
}

export { Button, buttonVariants }
