import { createClient } from '@/utils/supabase/server'
import { HeroCarousel } from '@/components/store/HeroCarousel'
import { ProductCard } from '@/components/store/ProductCard'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const revalidate = 60 // Revalidate every minute

export default async function HomePage() {
    const supabase = await createClient()

    const { data: banners } = await supabase
        .from('banners')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true })

    const { data: homeCategories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .eq('show_on_home', true)
        .limit(4)

    const { data: featuredProducts } = await supabase
        .from('products')
        .select('*, categories(name)')
        .eq('featured', true)
        .limit(8)
        .order('created_at', { ascending: false })

    return (
        <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
            {/* Tech Background Grid */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent"></div>
            </div>

            {/* Hero Section */}
            <section className="relative z-10">
                <HeroCarousel banners={banners || []} />
            </section>

            {/* Categories Grid (Static for visuals, dynamic handled in filters) */}
            <section className="py-24 container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 md:mb-12 gap-4">
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase font-heading italic">
                        <span className="text-primary">Shop</span> by Category
                    </h2>
                    <div className="hidden md:block h-px bg-zinc-800 flex-1 ml-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {homeCategories?.map((category) => (
                        <Link
                            key={category.id}
                            href={`/store?category=${category.slug}`}
                            className="group relative overflow-hidden rounded-none aspect-4/3 bg-zinc-800/60 border border-zinc-700/70 hover:border-primary/50 transition-all duration-300 flex items-center justify-center clip-path-slant"
                        >
                            <div className="absolute inset-0 bg-zinc-900/40 group-hover:bg-transparent transition-colors duration-500" />
                            <span className="text-xl md:text-2xl font-black text-white group-hover:text-primary group-hover:scale-110 transition-all duration-300 z-10 font-heading italic uppercase tracking-wider text-center px-2">{category.name}</span>

                            {/* Technical Corner Accents */}
                            <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-zinc-600 group-hover:border-primary transition-colors" />
                            <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-zinc-600 group-hover:border-primary transition-colors" />
                        </Link>
                    ))}
                    {(!homeCategories || homeCategories.length === 0) && (
                        <div className="col-span-full py-12 text-center text-zinc-400 font-mono text-sm uppercase">
                            No categories available
                        </div>
                    )}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 border-t border-zinc-900 relative z-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 gap-6">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter uppercase font-heading italic">Featured <span className="text-zinc-500">Inventory</span></h2>
                            <p className="text-zinc-300 mt-3 font-mono text-xs md:text-sm tracking-wide max-w-md uppercase border-l-2 border-primary pl-4">
                                Precision-engineered components selected for maximum performance.
                            </p>
                        </div>
                        <Link href="/store" className="text-primary font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:gap-4 transition-all border border-zinc-800 bg-zinc-900/50 px-6 py-3 hover:bg-primary hover:text-black hover:shadow-[0_0_15px_rgba(250,204,21,0.4)] w-full md:w-auto justify-center md:justify-start">
                            View Catalog <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {featuredProducts?.map((product) => (
                            // @ts-ignore
                            <ProductCard key={product.id} product={product} />
                        ))}
                        {(!featuredProducts || featuredProducts.length === 0) && (
                            <div className="col-span-full py-12 text-center text-zinc-400 font-mono text-sm uppercase">
                                // System Notice: No featured products available.
                            </div>
                        )}
                    </div>
                </div>
            </section >
        </div >
    )
}
