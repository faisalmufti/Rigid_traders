'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
    images: string[]
    title: string
}

export function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
    const [mainImage, setMainImage] = useState(images?.[0] || '')

    return (
        <div className="space-y-4 md:space-y-6">
            <div className="aspect-square bg-zinc-900 border border-zinc-800 relative overflow-hidden group rounded-sm">
                {/* Tech Overlay */}
                <div className="absolute top-4 left-4 z-10">
                </div>

                {mainImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={mainImage}
                        alt={title}
                        className="object-cover w-full h-full opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src="/no-image-placeholder.png"
                        alt="No image available"
                        className="object-cover w-full h-full opacity-60"
                    />
                )}
            </div>

            {images && images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                    {images.map((img: string, idx: number) => (
                        <div
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`aspect-square rounded-sm overflow-hidden border cursor-pointer relative bg-zinc-900 transition-all duration-200 ${mainImage === img ? 'border-primary ring-1 ring-primary/50 opacity-100' : 'border-zinc-800 hover:border-zinc-600 opacity-60 hover:opacity-100'}`}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img} alt={`${title} view ${idx + 1}`} className="object-cover w-full h-full" />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
