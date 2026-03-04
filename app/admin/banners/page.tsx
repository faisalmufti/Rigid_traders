import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Plus, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteBanner, toggleBannerStatus, updateBannerOrder } from './actions'

export default async function BannersPage() {
    const supabase = await createClient()

    const { data: banners, error } = await supabase
        .from('banners')
        .select('*')
        .order('sort_order', { ascending: true })

    if (error) {
        return <div className="text-red-500">Error loading banners</div>
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 border-b border-zinc-800 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase font-heading italic">Active <span className="text-zinc-600">Campaigns</span></h1>
                    <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-1">Hero Banners</p>
                </div>
                <Link
                    href="/admin/banners/create"
                    className="bg-primary text-black px-6 py-3 rounded-sm font-bold flex items-center justify-center md:justify-start gap-2 hover:bg-white transition-all shadow-[0_0_10px_rgba(250,204,21,0.3)] uppercase tracking-wide text-xs clip-path-slant group w-full md:w-auto"
                >
                    <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                    Add Banner
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {banners?.map((banner) => (
                    <div key={banner.id} className="bg-zinc-900/40 p-4 rounded-sm shadow-lg border border-zinc-800 backdrop-blur-md space-y-4 group hover:border-zinc-700 transition-colors">
                        <div className="relative aspect-video rounded-sm overflow-hidden bg-zinc-950 border border-zinc-800">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={banner.image_url} alt="Banner" className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur rounded-sm border border-white/10 p-1">
                                <form action={async (formData) => {
                                    'use server';
                                    await updateBannerOrder(banner.id, Number(formData.get('sort_order')));
                                }} className="flex items-center gap-1">
                                    <label className="text-[10px] uppercase font-bold text-white px-1">Pos</label>
                                    <input
                                        type="number"
                                        name="sort_order"
                                        defaultValue={banner.sort_order}
                                        className="w-12 h-6 bg-zinc-900 border border-zinc-700 text-white text-xs px-1 text-center font-mono focus:border-primary focus:outline-none"
                                    />
                                    <button type="submit" className="text-[10px] bg-primary text-black px-2 py-1 font-bold rounded-sm hover:bg-white transition-colors cursor-pointer">Set</button>
                                </form>
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-zinc-800 pt-4">
                            <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${banner.active ? 'text-green-500' : 'text-zinc-500'}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${banner.active ? 'bg-green-500 animate-pulse' : 'bg-zinc-600'}`}></span>
                                {banner.active ? 'Active' : 'Inactive'}
                            </span>

                            <div className="flex items-center gap-2">
                                <form action={async () => {
                                    'use server';
                                    await toggleBannerStatus(banner.id, banner.active)
                                }}>
                                    <button className="p-2 text-zinc-500 hover:text-blue-400 transition-colors bg-zinc-900 rounded-sm border border-zinc-800 hover:border-blue-400/30">
                                        {banner.active ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                </form>

                                <form action={async () => {
                                    'use server';
                                    await deleteBanner(banner.id)
                                }}>
                                    <button className="p-2 text-zinc-600 hover:text-red-500 transition-colors hover:bg-zinc-900 rounded-sm border border-transparent hover:border-red-500/20">
                                        <Trash2 size={16} />
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
                {banners?.length === 0 && (
                    <div className="col-span-full text-center py-12 text-zinc-600 bg-zinc-900/30 rounded-sm border border-zinc-800 border-dashed font-mono text-xs uppercase">
                        // System Notice: No campaigns active.
                    </div>
                )}
            </div>
        </div >
    )
}
