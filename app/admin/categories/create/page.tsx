'use client'

import { createCategory } from '../actions'
import { toast } from 'sonner'

// Simple form component
function CategoryForm() {
    const handleSubmit = async (formData: FormData) => {
        const result = await createCategory(formData)
        if (result?.error) {
            toast.error(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-lg relative z-10">
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Category Name</label>
                <input
                    name="name"
                    required
                    className="flex h-12 w-full rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm shadow-inner hover:border-zinc-700 backdrop-blur-sm"
                    placeholder="e.g. BRAKES"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Slug Identifier</label>
                <input
                    name="slug"
                    required
                    className="flex h-12 w-full rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm shadow-inner hover:border-zinc-700 backdrop-blur-sm"
                    placeholder="e.g. brakes"
                />
            </div>

            <div className="flex items-center gap-3 pt-2 border-t border-zinc-900">
                <input
                    type="checkbox"
                    name="show_on_home"
                    className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <label htmlFor="show_on_home" className="text-sm font-bold text-white uppercase tracking-wider">Show on Home Page (Limit 4)</label>
            </div>

            <button
                type="submit"
                className="bg-blue-600 text-white font-black uppercase tracking-wider px-10 py-4 rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2 border border-blue-400/20"
            >
                Initialize Category
            </button>
        </form>
    )
}

export default function CreateCategoryPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 tracking-tighter uppercase font-heading italic">System Configuration <span className="text-blue-500">/ Add Category</span></h1>

            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-2xl">
                {/* Tech Overlay Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

                <CategoryForm />
            </div>
        </div>
    )
}
