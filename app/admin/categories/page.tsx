import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Pencil } from 'lucide-react'
import { deleteCategory } from './actions'

export default async function CategoriesPage() {
    const supabase = await createClient()

    const { data: categories, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="text-red-500">Error loading categories</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-heading italic">Category <span className="text-zinc-600">Index</span></h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Product Classification</p>
                </div>
                <Link
                    href="/admin/categories/create"
                    className="bg-primary text-black px-6 py-3 rounded-sm font-bold flex items-center justify-center md:justify-start gap-2 hover:bg-white transition-all shadow-[0_0_10px_rgba(250,204,21,0.3)] uppercase tracking-wide text-xs clip-path-slant group w-full md:w-auto"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Add Category
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories?.map((category) => (
                    <div key={category.id} className="bg-zinc-900/40 p-6 rounded-sm shadow-lg border border-zinc-800 backdrop-blur-md flex justify-between items-center group hover:border-zinc-700 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></span>
                                <h3 className="font-bold text-lg text-white font-heading tracking-wide uppercase">{category.name}</h3>
                                {category.show_on_home && (
                                    <span className="text-[9px] bg-primary/20 text-primary px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider">Home</span>
                                )}
                            </div>
                            <p className="text-zinc-500 text-xs font-mono lowercase opacity-70">/{category.slug}</p>
                        </div>

                        <div className="flex items-center gap-1">
                            <Link
                                href={`/admin/categories/${category.id}/edit`}
                                className="p-2 text-zinc-600 hover:text-primary transition-colors hover:bg-zinc-800 rounded-sm"
                            >
                                <Pencil size={18} />
                            </Link>
                            <form action={async () => {
                                'use server';
                                await deleteCategory(category.id)
                            }}>
                                <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors hover:bg-zinc-800 rounded-sm">
                                    <Trash2 size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}
                {categories?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-zinc-600 bg-zinc-900/30 rounded-sm border border-zinc-800 border-dashed font-mono text-xs uppercase">
                        // System Notice: No categories registered.
                    </div>
                )}
            </div>
        </div>
    )
}
