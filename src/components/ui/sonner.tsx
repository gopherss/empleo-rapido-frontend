import { Toaster as SonnerToaster } from 'sonner'
import type { ComponentProps } from 'react'

function Toaster(props: ComponentProps<typeof SonnerToaster>) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      theme="system"
      toastOptions={{
        classNames: {
          toast: 'rounded-lg border border-border',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
