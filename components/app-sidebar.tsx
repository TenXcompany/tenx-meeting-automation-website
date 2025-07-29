import { NavUser } from '@/components/nav-user'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Image from 'next/image'
import * as React from 'react'

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    const sessionUser = session?.user
    const user = sessionUser && sessionUser.name && sessionUser.email ? { name: sessionUser.name, email: sessionUser.email, avatar: sessionUser.image ?? '' } : undefined

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-center gap-2">
                        <Image src="/logo.svg" alt="Logo" width={0} height={0} fetchPriority={'high'} priority={true} loading={'eager'} className={'w-28 h-auto'} />
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent />
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
        </Sidebar>
    )
}
