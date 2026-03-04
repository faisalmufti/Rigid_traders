'use client'

import { useState } from 'react'
import { createBanner } from '../actions'
import { uploadImage } from '@/app/actions/upload'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'

// Simple form component
function BannerForm() {
    const [imageUrl, setImageUrl] = useState('')
    const [uploading, setUploading] = useState(false)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)

            const { success, url, error } = await uploadImage(formData)

            if (!success || error) throw new Error(error || 'Upload failed')

            setImageUrl(url)
            toast.success('Banner uploaded')
        } catch (error: any) {
            toast.error('Error uploading banner: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const handleSubmit = async (formData: FormData) => {
        const result = await createBanner(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            // Success matches redirect in action, or we can toast here if no redirect
            // But createBanner redirects on success, so this might not run unless we remove redirect?
            // Actually createBanner redirects, so we won't get here on success usually.
            // But if it returns success: true (without redirect path?), we handle it.
            // In our action it redirects.
        }
    }

    return (
        <form action={handleSubmit} className="space-y-8 max-w-lg relative z-10">
            <div className="space-y-4">
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Banner Visual Asset</label>
                <div className="relative aspect-video bg-zinc-900 border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center hover:bg-blue-500/5 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all group cursor-pointer shadow-inner">
                    {imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity rounded-xl" />
                    ) : (
                        <div className="text-center p-6">
                            {uploading ? <Loader2 className="animate-spin text-blue-500 mx-auto" /> : <Upload className="text-zinc-600 group-hover:text-blue-500 mx-auto mb-2 transition-colors" />}
                            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold group-hover:text-white transition-colors">Click to upload signal</span>
                        </div>
                    )}
                    <input type="file" required={!imageUrl} accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <input type="hidden" name="image_url" value={imageUrl} />
            </div>

            <div className="space-y-3">
                <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Sequence Priority (Sort Order)</label>
                <input
                    type="number"
                    name="sort_order"
                    defaultValue={0}
                    className="flex h-12 w-full rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono text-sm shadow-inner hover:border-zinc-700 backdrop-blur-sm"
                />
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <input
                    type="checkbox"
                    name="active"
                    defaultChecked
                    className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-zinc-900"
                />
                <label className="text-sm font-bold text-white uppercase tracking-wider">System Active Status</label>
            </div>

            <button
                type="submit"
                disabled={!imageUrl || uploading}
                className="bg-blue-600 text-white font-black uppercase tracking-wider px-10 py-4 rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-blue-400/20"
            >
                Deploy Banner Unit
            </button>
        </form >
    )
}

export default function CreateBannerPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 tracking-tighter uppercase font-heading italic">System Configuration <span className="text-blue-500">/ Add Banner</span></h1>

            <div className="bg-zinc-900/60 border border-zinc-800 p-8 rounded-2xl backdrop-blur-xl relative overflow-hidden shadow-2xl">
                {/* Tech Overlay Lines */}
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-blue-500/40 to-transparent"></div>
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/10 blur-3xl rounded-full pointer-events-none"></div>
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none"></div>

                <BannerForm />
            </div>
        </div>
    )
}
