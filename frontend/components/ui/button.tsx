import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-white font-bold hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(3,169,244,0.4)] hover:scale-[1.02] active:scale-[0.98]',
        destructive:
          'bg-red-500 text-white font-bold hover:bg-red-600 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-[1.02] active:scale-[0.98]',
        outline:
          'border border-white/10 bg-white/5 text-white font-bold hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-[0_0_15px_rgba(3,169,244,0.3)] hover:scale-[1.02] active:scale-[0.98]',
        secondary:
          'bg-white/10 text-white font-bold hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]',
        ghost:
          'text-white/40 font-bold hover:bg-blue-500/10 hover:text-white hover:scale-[1.02] active:scale-[0.98]',
        link: 'text-primary underline-offset-4 hover:text-blue-400 hover:underline transition-all',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
