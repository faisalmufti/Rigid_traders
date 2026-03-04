'use client'

import { login, signup } from './actions'
import Image from 'next/image'
// import { useActionState } from 'react'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950 relative overflow-hidden text-zinc-200 font-mono">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute inset-0 bg-linear-to-b from-zinc-950/50 via-zinc-950/80 to-zinc-950"></div>
            </div>

            <div className="max-w-md w-full p-8 relative z-10">
                <div className="mb-12 text-center">
                    <div className="w-16 h-16 bg-zinc-900 mx-auto rounded-sm border border-zinc-800 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(250,204,21,0.1)] group">
                        <Image
                            src="/rigid-logo.png"
                            alt="Rigid Traders Logo"
                            width={40}
                            height={40}
                            className="rounded"
                        />
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter font-heading italic">Admin <span className="text-primary">Panel</span></h1>
                    <p className="text-zinc-500 mt-2 text-xs uppercase tracking-widest">Sign in to continue</p>
                </div>

                <div className="bg-zinc-900/40 backdrop-blur-md border border-zinc-800 p-8 rounded-sm relative overflow-hidden cursor-default">
                    {/* Corner Accents */}
                    <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-primary/30"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-primary/30"></div>

                    <form className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all rounded-sm text-sm font-mono"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Password</label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 bg-zinc-950 border border-zinc-800 text-white placeholder-zinc-700 focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all rounded-sm text-sm font-mono"
                                placeholder="••••••••"
                            />
                        </div>

                        <div className="pt-4 flex flex-col gap-4">
                            <button
                                formAction={async (formData) => {
                                    const res = await login(formData);
                                    if (res?.error) alert(res.error);
                                }}
                                className="w-full bg-primary text-black font-black uppercase tracking-wider py-4 hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all clip-path-slant shadow-[0_0_15px_rgba(250,204,21,0.3)] relative group overflow-hidden"
                            >
                                <span className="relative z-10">Sign In</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            </button>


                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[10px] text-zinc-700 font-mono uppercase">Secure Connection Established • v2.4.0</p>
                </div>
            </div>
        </div>
    )
}
