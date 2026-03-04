'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, Tag, Image as ImageIcon, Settings, LogOut, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { signOut } from '@/app/login/actions'
import { useRouter } from 'next/navigation'

const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleSignOut = async () => {
        await signOut()
    }

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-zinc-800/80 bg-zinc-950/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none -z-10"></div>
                <Link href="/" className="flex items-center gap-2 group relative z-10 transition-transform duration-300 hover:scale-105 origin-left">
                    <Image
                        src="/rigid-logo-full.png"
                        alt="Rigid Traders Logo"
                        width={140}
                        height={35}
                        className="drop-shadow-[0_0_15px_rgba(37,99,235,0.6)] group-hover:drop-shadow-[0_0_25px_rgba(37,99,235,0.8)] transition-all duration-300"
                    />
                </Link>
                <div className="mt-4 flex items-center gap-2 bg-zinc-900/60 w-max px-3 py-1.5 rounded-full border border-zinc-800 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold">System Online</span>
                </div>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-2 relative">
                <div className="absolute top-1/2 -right-4 w-12 h-64 bg-blue-500/5 blur-3xl rounded-full pointer-events-none"></div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden
                                ${isActive
                                    ? 'bg-blue-500/10 text-white border border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.15)]'
                                    : 'border border-transparent text-zinc-500 hover:bg-zinc-900/80 hover:text-zinc-200 hover:border-zinc-800'
                                }`}
                        >
                            {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-linear-to-b from-blue-400 to-blue-600 rounded-l-xl"></div>}
                            {isActive && <div className="absolute inset-0 bg-linear-to-r from-blue-500/10 to-transparent pointer-events-none"></div>}
                            <item.icon size={18} className={`relative z-10 ${isActive ? 'text-blue-400' : 'group-hover:text-zinc-300 transition-colors'}`} />
                            <span className="relative z-10 font-heading uppercase tracking-wider text-xs font-bold">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            <div className="p-6 border-t border-zinc-800/80 bg-zinc-950/40">
                <button
                    onClick={handleSignOut}
                    className="flex items-center justify-center gap-3 w-full px-4 py-3.5 text-zinc-400 bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-300 border border-zinc-800 hover:border-red-500/30 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)] group relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-linear-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform relative z-10" />
                    <span className="font-mono uppercase text-xs tracking-wider font-bold relative z-10">Sign Out</span>
                </button>
            </div>
        </>
    )

    return (
        <>
            {/* Mobile Header */}
            <div className="md:hidden flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/rigid-logo-full.png" alt="Rigid Traders Logo" width={120} height={30} className="drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                </Link>
                <button onClick={() => setIsMobileMenuOpen(true)} className="text-zinc-400 hover:text-white">
                    <Menu size={24} />
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden md:flex w-72 bg-zinc-950/90 backdrop-blur-3xl border-r border-zinc-800/80 shadow-[10px_0_30px_rgba(0,0,0,0.5)] text-zinc-400 flex-col h-full fixed left-0 top-0 cursor-default select-none z-50">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    {/* Backdrop */}
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>

                    {/* Sidebar Drawer */}
                    <aside className="relative flex-col bg-zinc-950/95 backdrop-blur-xl w-72 h-full border-r border-zinc-800/80 shadow-[10px_0_30px_rgba(0,0,0,0.5)] animate-in slide-in-from-left duration-300">
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 text-zinc-500 hover:text-white p-2 bg-zinc-900 rounded-full border border-zinc-800 transition-colors z-50"
                        >
                            <X size={20} />
                        </button>
                        <SidebarContent />
                    </aside>
                </div>
            )}
        </>
    )
}
