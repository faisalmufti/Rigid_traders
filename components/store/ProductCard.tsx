import Link from 'next/link'

interface ProductHeadingProps {
    id: string
    title: string
    price: number
    images: string[]
    categories?: { name: string } | { name: string }[] | null // handling weird Supabase join types
}

export function ProductCard({ product }: { product: ProductHeadingProps }) {
    // Safe category handling
    const categoryName = Array.isArray(product.categories)
        ? product.categories[0]?.name
        : product.categories?.name;

    return (
        <Link
            href={`/product/${product.id}`}
            className="group relative bg-zinc-900 border border-zinc-800 overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col h-full"
        >
            <div className="aspect-square bg-zinc-950 relative overflow-hidden">
                {/* Image Overlay Gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />

                {product.images?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
                    />
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src="/no-image-placeholder.png"
                        alt="No image available"
                        className="w-full h-full object-cover opacity-60"
                    />
                )}
            </div>

            <div className="p-5 flex-1 flex flex-col relative z-20 bg-zinc-900">
                <div className="flex items-start justify-between gap-4 mb-2">
                    <span className="text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20 px-2 py-0.5 rounded-sm bg-primary/5">
                        {categoryName || 'Component'}
                    </span>
                    {/* Stock Indicator could go here */}
                </div>

                <h3 className="font-bold text-white text-lg leading-tight mb-2 line-clamp-2 group-hover:text-primary transition-colors font-heading uppercase tracking-wide">
                    {product.title}
                </h3>

                <div className="mt-auto flex items-end justify-between border-t border-zinc-800 pt-4">
                    <div className="flex flex-col">
                        <span className="text-xs text-zinc-400 font-mono uppercase">Price</span>
                        <span className="text-xl font-bold text-white tracking-tight">Rs {product.price.toLocaleString()}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-400 uppercase group-hover:text-white transition-colors flex items-center gap-1 group/btn">
                        View <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-primary group-hover/btn:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6" /></svg>
                    </span>
                </div>
            </div>
        </Link >
    )
}
