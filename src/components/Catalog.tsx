import type { CSSProperties, InputHTMLAttributes, ReactNode } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from './Input'
import { cn } from '@/lib/utils'

export function Catalog({
  collapsed = false,
  width,
  children,
  className,
}: {
  collapsed?: boolean
  width?: number
  children: ReactNode
  className?: string
}) {
  return (
    <SidebarProvider
      open={!collapsed}
      className={cn('h-full min-h-0 w-full', className)}
      style={{
        '--sidebar-width': '100%',
        width: collapsed ? undefined : width,
      } as CSSProperties}
    >
      <Sidebar
        collapsible="none"
        className={cn(
          'h-full w-full border-none bg-sidebar px-3 py-1.5 text-sm text-ink',
          collapsed && 'items-center px-2.5 pt-[18px]',
        )}
      >
        {children}
      </Sidebar>
    </SidebarProvider>
  )
}

export function CatalogHeader({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <SidebarHeader className={cn('gap-0 p-0', className)}>
      {children}
    </SidebarHeader>
  )
}

export function CatalogSearch({
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { icon?: ReactNode }) {
  return <Input className={cn('mb-2 w-full', className)} {...rest} />
}

export function CatalogBody({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <SidebarContent className={cn('min-h-0 flex-1 gap-0 overflow-hidden', className)}>
      <ScrollArea className="h-full pr-1">
        {children}
      </ScrollArea>
    </SidebarContent>
  )
}

export function CatalogFooter({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <SidebarFooter className={cn('mt-1 gap-0 p-0', className)}>
      {children}
    </SidebarFooter>
  )
}
