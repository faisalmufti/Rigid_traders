import { createClient } from '@/utils/supabase/server'
import { AlertCircle, Package, Layers } from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch Stats
    const { count: totalProducts } = await supabase.from('products').select('*', { count: 'exact', head: true })

    // Calculate Total Stock (Sum)
    // Supabase doesn't have a direct sum aggregate in JS client easily without RPC, 
    // but for now we can fetch "stock" column and sum it up in JS (fine for small-medium scale).
    // For large scale, RPC is better.
    const { data: stockData } = await supabase.from('products').select('stock')
    const totalQuantity = stockData?.reduce((acc, curr) => acc + (curr.stock || 0), 0) || 0

    // Fetch Low Stock Items (< 10)
    const { data: lowStockItems } = await supabase
        .from('products')
        .select('*')
        .lt('stock', 10)
        .order('stock', { ascending: true })
        .limit(10)

    const lowStockCount = lowStockItems?.length || 0

    return (
        <div className="space-y-10 relative z-10 px-4 md:px-8 py-8">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-800 pb-6 relative">
                <div>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-white via-blue-100 to-zinc-500 tracking-tighter uppercase font-heading italic">Mission <span className="text-blue-500">Control</span></h1>
                    <p className="text-blue-400 font-mono text-xs uppercase tracking-[0.3em] mt-2 font-semibold">System Overview</p>
                </div>

                <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800 backdrop-blur-md px-4 py-2 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-mono text-xs font-bold tracking-widest uppercase shadow-green-500/50 drop-shadow-md">LIVE SERVER</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Products Card */}
                <div className="group relative overflow-hidden rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 shadow-2xl transition-all duration-500 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] hover:-translate-y-1">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-blue-400 transition-colors">Total Products</h3>
                            <div className="p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800 group-hover:border-blue-500/30 group-hover:bg-blue-500/10 transition-colors">
                                <Package className="text-blue-500/70 group-hover:text-blue-400 transition-colors" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-5xl font-black text-white font-heading italic tracking-tighter drop-shadow-md group-hover:scale-105 origin-left transition-transform duration-300">{totalProducts || 0}</p>
                            <p className="text-[10px] font-mono text-zinc-500 mt-2 tracking-wider">ACTIVE INVENTORY</p>
                        </div>
                    </div>
                </div>

                {/* Total Quantity Card */}
                <div className="group relative overflow-hidden rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 shadow-2xl transition-all duration-500 hover:border-indigo-500/50 hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] hover:-translate-y-1">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-indigo-400 transition-colors">Total Quantity</h3>
                            <div className="p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-colors">
                                <Layers className="text-indigo-500/70 group-hover:text-indigo-400 transition-colors" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-5xl font-black text-white font-heading italic tracking-tighter drop-shadow-md group-hover:scale-105 origin-left transition-transform duration-300">{totalQuantity}</p>
                            <p className="text-[10px] font-mono text-zinc-500 mt-2 tracking-wider">TOTAL STOCK UNITS</p>
                        </div>
                    </div>
                </div>

                {/* Low Stock Card */}
                <div className="group relative overflow-hidden rounded-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 shadow-2xl transition-all duration-500 hover:border-red-500/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.15)] hover:-translate-y-1">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all duration-500"></div>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-linear-to-r from-red-600 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-[0.2em] group-hover:text-red-400 transition-colors">Low Stock Alerts</h3>
                            <div className="p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-colors">
                                <AlertCircle className="text-red-500/70 group-hover:text-red-400 transition-colors" size={24} />
                            </div>
                        </div>
                        <div>
                            <p className="text-5xl font-black text-white font-heading italic tracking-tighter drop-shadow-md group-hover:scale-105 origin-left transition-transform duration-300">{lowStockCount}</p>
                            <p className="text-[10px] font-mono text-red-500/70 mt-2 tracking-wider uppercase font-bold">Requires Attention ({'< 10 units'})</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Needs Attention Section */}
            <div className="space-y-6 pt-6">
                <div className="flex items-center gap-4 bg-zinc-900/30 p-4 rounded-xl border border-zinc-800/50 backdrop-blur-sm shadow-inner w-full sm:w-max">
                    <div className="w-1.5 h-8 bg-linear-to-b from-red-500 to-red-600 rounded-full"></div>
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase tracking-wider font-heading italic drop-shadow-sm flex items-center gap-2">
                            Needs Inquiries
                            <span className="flex items-center justify-center bg-red-500/20 text-red-500 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold border border-red-500/30">
                                {lowStockCount}
                            </span>
                        </h2>
                        <p className="text-zinc-500 text-xs font-mono uppercase mt-1">Items below minimum threshold</p>
                    </div>
                </div>

                <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
                    <div className="absolute inset-0 bg-linear-to-b from-blue-900/5 to-transparent pointer-events-none"></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead>
                                <tr className="bg-zinc-950/80 border-b border-zinc-800/80 text-[10px] uppercase font-bold text-zinc-500 tracking-widest backdrop-blur-md">
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5">Product Target</th>
                                    <th className="px-8 py-5">System ID (SKU)</th>
                                    <th className="px-8 py-5 text-right">Available Stock</th>
                                    <th className="px-8 py-5 text-right">Unit Price</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800/50">
                                {lowStockItems && lowStockItems.length > 0 ? (
                                    lowStockItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-800/40 transition-all duration-300 group">
                                            <td className="px-8 py-5">
                                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20">
                                                    <span className="relative flex h-1.5 w-1.5">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
                                                    </span>
                                                    <span className="text-red-400 font-bold text-[10px] font-mono tracking-widest">CRITICAL</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors block text-sm max-w-xs truncate">{item.title}</span>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="font-mono text-zinc-500 text-xs bg-zinc-950 px-2 py-1 rounded border border-zinc-800 group-hover:border-zinc-700 transition-colors">{item.sku}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <div className="inline-flex flex-col items-end">
                                                    <span className="font-mono font-black text-red-400 text-base">{item.stock}</span>
                                                    <span className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">Units</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className="font-mono text-zinc-400 text-xs">Rs. <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{item.price.toLocaleString()}</span></span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-16">
                                            <div className="flex flex-col items-center justify-center gap-4 text-zinc-500">
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
                                                    <Package className="text-blue-500/50 relative z-10" size={48} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="uppercase tracking-[0.2em] text-sm font-black text-white/50 mb-1">System Nominal</p>
                                                    <p className="text-xs font-mono">Inventory parameters are within optimal operational range.</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
