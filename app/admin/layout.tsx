import { AdminSidebar } from '@/components/admin/Sidebar'

export const dynamic = 'force-dynamic'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-zinc-950 text-foreground">
            <AdminSidebar />
            <main className="md:pl-72 min-h-screen">
                <div className="container mx-auto p-4 md:p-8 relative">
                    {/* Background Grid for Admin Area */}
                    <div className="fixed inset-0 z-0 text-zinc-900 pointer-events-none opacity-20">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    )
}
