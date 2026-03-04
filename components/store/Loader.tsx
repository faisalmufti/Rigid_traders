'use client'

import Image from 'next/image'

export default function Loader() {
    return (
        <div className="fixed inset-0 z-200 bg-background flex items-center justify-center">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>

            <div className="relative flex flex-col items-center gap-6">
                <div className="relative">
                    <div className="absolute inset-0 bg-primary blur-xl opacity-30 animate-pulse rounded-full"></div>
                    <div className="relative w-16 h-16 border-2 border-primary/30 rounded-lg flex items-center justify-center">
                        <div className="w-10 h-10 border-t-2 border-r-2 border-primary rounded-lg animate-spin"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                    <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <Image
                            src="/rigid-logo-full.png"
                            alt="Rigid Traders Logo"
                            width={160}
                            height={40}
                            className="relative drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                        />
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.3em] font-mono">Loading</span>
                        <span className="flex gap-1">
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
