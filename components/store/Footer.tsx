import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Twitter, Instagram } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-zinc-950 text-zinc-400 pt-20 pb-10 border-t border-zinc-900 relative overflow-hidden">
            {/* Background Mesh */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <Image
                                src="/rigid-logo.png"
                                alt="Rigid Traders Logo"
                                width={32}
                                height={32}
                                className="rounded"
                            />
                            <span className="text-xl font-black text-white tracking-tighter uppercase font-heading italic">Rigid<span className="text-primary">Traders</span></span>
                        </Link>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-xs font-mono border-l-2 border-zinc-800 pl-4">
                            ENGINEERED FOR PERFORMANCE.<br />
                            PREMIUM COMPONENTS.<br />
                            MAXIMUM DURABILITY.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs font-heading border-b border-primary/50 w-12 pb-1">Navigation</h4>
                        <ul className="space-y-4 text-sm font-medium font-mono uppercase tracking-wide">
                            <li><Link href="/" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Home</Link></li>
                            <li><Link href="/store" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Catalog</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Contact</Link></li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs font-heading border-b border-primary/50 w-12 pb-1">Categories</h4>
                        <ul className="space-y-4 text-sm font-medium font-mono uppercase tracking-wide">
                            <li><Link href="/store?category=brakes" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Brakes & Rotors</Link></li>
                            <li><Link href="/store?category=engine" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Engine Components</Link></li>
                            <li><Link href="/store?category=suspension" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Suspension Systems</Link></li>
                            <li><Link href="/store?category=accessories" className="hover:text-primary transition-colors hover:translate-x-1 inline-block duration-200">Performance Parts</Link></li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h4 className="font-bold text-white mb-6 uppercase tracking-widest text-xs font-heading border-b border-primary/50 w-12 pb-1">Connect</h4>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="w-10 h-10 rounded-none bg-zinc-900 border border-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black hover:border-primary transition-all shadow-sm group clip-path-slant">
                                    <Icon size={18} className="group-hover:scale-110 transition-transform" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono uppercase">
                    <p>&copy; {new Date().getFullYear()} Rigid Traders. <span className="text-zinc-500">System Ready.</span></p>
                    <div className="flex gap-6 mt-4 md:mt-0">
                        <Link href="/admin" className="hover:text-primary transition-colors">Admin Access</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
