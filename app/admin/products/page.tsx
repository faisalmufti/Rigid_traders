import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { deleteProduct } from './actions'
import { redirect } from 'next/navigation'

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; q?: string }>;
}) {
    const supabase = await createClient()
    const { page, q } = await searchParams;

    const currentPage = Number(page) || 1
    const pageSize = 10
    const query = q || ''

    // Fetch Products
    let queryBuilder = supabase
        .from('products')
        .select('*, categories(name)', { count: 'exact' })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)
        .order('created_at', { ascending: false })

    if (query) {
        queryBuilder = queryBuilder.ilike('title', `%${query}%`)
    }

    const { data: products, count, error } = await queryBuilder

    if (error) {
        // Silent fail

        return <div className="text-red-500">Error loading products</div>
    }

    const totalPages = count ? Math.ceil(count / pageSize) : 0

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-heading italic">Inventory <span className="text-zinc-600">Database</span></h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Manage Catalog Items</p>
                </div>
                <Link
                    href="/admin/products/create"
                    className="bg-primary text-black px-6 py-3 rounded-sm font-bold flex items-center justify-center md:justify-start gap-2 hover:bg-white transition-all shadow-[0_0_10px_rgba(250,204,21,0.3)] uppercase tracking-wide text-xs clip-path-slant group w-full md:w-auto"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Add Item
                </Link>
            </div>

            {/* Search */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 border border-zinc-800 bg-zinc-900/50 text-white placeholder-zinc-600 rounded-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all uppercase text-sm tracking-wide font-mono"
                        defaultValue={query}
                    />
                </div>
            </div>

            <div className="bg-zinc-900/40 rounded-sm shadow-xl border border-zinc-800 backdrop-blur-md overflow-hidden relative">
                {/* Tech Overlay Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-zinc-900/80 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider text-xs font-heading">
                            <tr>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">SKU</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50">
                            {products?.map((product) => (
                                <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-3">
                                            {product.images?.[0] ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={product.images[0]}
                                                    alt={product.title}
                                                    className="w-10 h-10 object-cover rounded-sm border border-zinc-700 group-hover:border-primary transition-colors"
                                                />
                                            ) : (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src="/no-image-placeholder.png"
                                                    alt="No image"
                                                    className="w-10 h-10 object-cover rounded-sm border border-zinc-700 opacity-60"
                                                />
                                            )}
                                            <span className="group-hover:text-primary transition-colors font-bold tracking-tight">{product.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-400 font-mono text-xs">{product.sku}</td>
                                    {/* @ts-ignore: categories is joined */}
                                    < td className="px-6 py-4 text-zinc-500 uppercase text-xs tracking-wider" > {product.categories?.name || '-'}</td>
                                    <td className="px-6 py-4 text-white font-bold font-mono text-lg">Rs {product.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] uppercase font-bold tracking-widest border ${product.stock > 10
                                                ? 'bg-green-500/10 text-green-500 border-green-500/20'
                                                : product.stock > 0
                                                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                                                    : 'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/products/${product.id}`}
                                                className="p-2 text-zinc-500 hover:text-primary transition-colors hover:bg-zinc-800 rounded-sm"
                                            >
                                                <Pencil size={16} />
                                            </Link>

                                            {/* Delete Button Form */}
                                            <form action={async () => {
                                                'use server';
                                                await deleteProduct(product.id)
                                            }}>
                                                <button className="p-2 text-zinc-500 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-sm">
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500 font-mono uppercase text-xs">
                                        // System Notice: No inventory items detected.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-zinc-900/30">
                    <span className="text-xs text-zinc-500 font-mono uppercase">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <Link
                            href={`?page=${Math.max(1, currentPage - 1)}`}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border border-zinc-700 rounded-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-all ${currentPage === 1 ? 'pointer-events-none opacity-50 bg-zinc-900' : 'hover:bg-zinc-800'}`}
                        >
                            Previous
                        </Link>
                        <Link
                            href={`?page=${Math.min(totalPages, currentPage + 1)}`}
                            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider border border-zinc-700 rounded-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-all ${currentPage >= totalPages ? 'pointer-events-none opacity-50 bg-zinc-900' : 'hover:bg-zinc-800'}`}
                        >
                            Next
                        </Link>
                    </div>
                </div>
            </div >
        </div >
    )
}
