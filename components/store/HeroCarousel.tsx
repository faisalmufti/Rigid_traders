'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Banner {
    id: string
    image_url: string
}

export function HeroCarousel({ banners }: { banners: Banner[] }) {
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (banners.length <= 1) return
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [banners.length])

    const next = () => setCurrent((prev) => (prev + 1) % banners.length)
    const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length)

    if (!banners || banners.length === 0) return null

    return (
        <div className="relative w-full h-[600px] md:h-[700px] overflow-hidden bg-gray-900 group">
            {banners.map((banner, idx) => (
                <div
                    key={banner.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                >
                    <div className="absolute inset-0 bg-black/20 z-10" />
                    <div className="absolute inset-0 bg-linear-to-r from-black via-black/20 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 w-full h-44 bg-linear-to-t from-background to-transparent z-20" />
                    <img
                        src={banner.image_url}
                        alt="Hero Banner"
                        className="absolute right-0 w-full h-full object-cover bg-black object-center"
                    />
                    <div className="absolute inset-0 flex items-center justify-start z-20 pl-6 md:pl-20 pb-20 md:pb-32">
                        <div className="max-w-4xl space-y-6">
                            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                                <span className="text-primary text-xs font-bold uppercase tracking-[0.2em] italic font-mono">Ready for ride</span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white leading-[0.9] drop-shadow-2xl font-heading">
                                <span className="block text-primary transform -skew-x-12 origin-left">Precision</span>
                                <span className="block transform -skew-x-12 origin-left">Engineering</span>
                            </h1>
                            <p className="text-sm md:text-2xl text-gray-300 font-medium tracking-wide max-w-2xl border-l-4 border-primary pl-4 md:pl-6 py-2 bg-linear-to-r from-black/50 to-transparent backdrop-blur-sm">
                                Upgrade your machine with premium high-performance components.
                            </p>
                            <div className="pt-4 md:pt-8 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
                                <Link href={"/store"} className="group relative bg-primary text-black font-black text-sm md:text-lg px-6 py-3 md:px-10 md:py-5 clip-path-slant hover:bg-white transition-all shadow-[0_0_20px_rgba(250,204,21,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] -skew-x-12">
                                    <span className="relative z-10 flex items-center gap-2 uppercase tracking-widest font-heading italic skew-x-12">
                                        Shop Now <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                {/* <button className="text-white font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 group text-xs md:text-base">
                                    <span className="w-8 h-[2px] bg-white group-hover:bg-primary transition-colors"></span>
                                    View Specs
                                </button> */}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {banners.length > 1 && (
                <>
                    <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 text-white rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                        <ChevronLeft size={28} />
                    </button>
                    <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 bg-black/50 text-white rounded-full hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                        <ChevronRight size={28} />
                    </button>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                        {banners.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`w-3 h-3 rounded-full transition-all ${idx === current ? 'bg-primary w-8' : 'bg-white/50 hover:bg-white'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
