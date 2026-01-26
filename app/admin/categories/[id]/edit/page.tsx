'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getCategory, updateCategory } from '../../actions'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    show_on_home: boolean
}

function EditCategoryForm({ category }: { category: Category }) {
    const handleSubmit = async (formData: FormData) => {
        const result = await updateCategory(category.id, formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-lg relative z-10">
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Category Name</label>
                <input
                    name="name"
                    required
                    defaultValue={category.name}
                    className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                    placeholder="e.g. BRAKES"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Slug Identifier</label>
                <input
                    name="slug"
                    required
                    defaultValue={category.slug}
                    className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                    placeholder="e.g. brakes"
                />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-zinc-900">
                <input
                    type="checkbox"
                    name="show_on_home"
                    id="show_on_home"
                    defaultChecked={category.show_on_home}
                    className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary focus:ring-offset-zinc-900"
                />
                <label htmlFor="show_on_home" className="text-sm font-bold text-white uppercase tracking-wider">Show on Home Page (Limit 4)</label>
            </div>

            <button
                type="submit"
                className="bg-primary text-black font-black uppercase tracking-wider px-10 py-4 rounded-sm hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 clip-path-slant shadow-[0_0_10px_rgba(250,204,21,0.3)]"
            >
                Update Category
            </button>
        </form>
    )
}

export default function EditCategoryPage() {
    const params = useParams()
    const router = useRouter()
    const [category, setCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadCategory() {
            const result = await getCategory(params.id as string)
            if (result.error) {
                setError(result.error)
            } else {
                setCategory(result.category)
            }
            setLoading(false)
        }
        loadCategory()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        )
    }

    if (error || !category) {
        return (
            <div className="text-center py-12">
                <p className="text-red-500 font-mono text-sm uppercase">Error: {error || 'Category not found'}</p>
                <button
                    onClick={() => router.push('/admin/categories')}
                    className="mt-4 text-primary hover:underline font-mono text-xs uppercase"
                >
                    Return to Categories
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-heading italic">System Configuration <span className="text-zinc-600">/ Edit Category</span></h1>

            <div className="bg-zinc-900/40 border border-zinc-800 p-8 rounded-sm backdrop-blur-md relative overflow-hidden">
                {/* Tech Overlay Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/20 to-transparent"></div>
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>

                <EditCategoryForm category={category} />
            </div>
        </div>
    )
}
