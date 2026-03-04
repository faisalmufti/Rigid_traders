import { createClient } from '@/utils/supabase/server'
import { ProductForm } from '@/components/admin/products/ProductForm'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const { id } = await params;

    // Fetch Product
    const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

    if (error || !product) {
        notFound()
    }

    // Fetch Categories
    const { data: categories } = await supabase.from('categories').select('id, name')

    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 tracking-tighter uppercase font-heading italic">System Overview <span className="text-blue-500">/ Edit Entry</span></h1>

            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-2xl">
                {/* Tech Overlay Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

                <ProductForm categories={categories || []} initialData={product} />
            </div>
        </div>
    )
}
