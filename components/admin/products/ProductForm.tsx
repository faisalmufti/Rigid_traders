'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { uploadImage } from '@/app/actions/upload'
import { createProduct, updateProduct } from '@/app/admin/products/actions'
import { Loader2, Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

// Schema
const productSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    price: z.coerce.number().min(0.01, 'Price must be greater than 0'),
    sku: z.string().min(2, 'SKU is required'),
    stock: z.coerce.number().int().min(0, 'Stock cannot be negative'),
    category_id: z.string().uuid('Please select a category'),
    featured: z.boolean().default(false),
    compatible_models: z.string().optional(),
    oem_part_number: z.string().optional(),
    material: z.string().optional(),
    warranty: z.string().optional(),
    weight_dimensions: z.string().optional(),
})

type ProductFormValues = z.infer<typeof productSchema>

interface Category {
    id: string
    name: string
}

interface ProductFormProps {
    categories: Category[]
    initialData?: any // TODO: Type this properly with Database Types
}

export function ProductForm({ categories, initialData }: ProductFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [images, setImages] = useState<string[]>(initialData?.images || [])

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            title: initialData?.title || '',
            description: initialData?.description || '',
            price: initialData?.price || 0,
            sku: initialData?.sku || '',
            stock: initialData?.stock || 0,
            category_id: initialData?.category_id || '',
            featured: initialData?.featured || false,
            compatible_models: initialData?.compatible_models || '',
            oem_part_number: initialData?.oem_part_number || '',
            material: initialData?.material || '',
            warranty: initialData?.warranty || '',
            weight_dimensions: initialData?.weight_dimensions || '',
        },
    })

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)
            if (!e.target.files || e.target.files.length === 0) return

            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)

            const { success, url, error } = await uploadImage(formData)

            if (!success || error) throw new Error(error || 'Upload failed')

            setImages((prev) => [...prev, url])
            toast.success('Image uploaded')
        } catch (error: any) {
            toast.error('Error uploading image: ' + error.message)
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (indexToRemove: number) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove))
    }

    const onSubmit = async (data: ProductFormValues) => {
        try {
            setLoading(true)

            const payload = {
                ...data,
                images,
            }

            let error
            if (initialData) {
                // Update
                const result = await updateProduct(initialData.id, payload)
                if (result.error) error = { message: result.error }
            } else {
                // Create
                const result = await createProduct(payload)
                if (result.error) error = { message: result.error }
            }

            if (error) throw error

            toast.success(initialData ? 'Product updated' : 'Product created')
            router.push('/admin/products')
            router.refresh()
        } catch (error: any) {
            toast.error('Error saving product: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Product Title</label>
                        <input
                            {...register('title')}
                            className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            placeholder="e.g. BRAKE PADS (CERAMIC)"
                        />
                        {errors.title && <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Error: {errors.title.message}</p>}
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">SKU Identifier</label>
                        <input
                            {...register('sku')}
                            className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            placeholder="e.g. BP-001-CER"
                        />
                        {errors.sku && <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Error: {errors.sku.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Price (Rs.)</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            />
                            {errors.price && <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Error: {errors.price.message}</p>}
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Stock Level</label>
                            <input
                                type="number"
                                {...register('stock')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            />
                            {errors.stock && <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Error: {errors.stock.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Category Classification</label>
                        <select
                            {...register('category_id')}
                            className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                        >
                            <option value="">SELECT CLASSIFICATION</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-xs text-red-500 font-bold uppercase tracking-wide">Error: {errors.category_id.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                        <input
                            type="checkbox"
                            id="featured"
                            {...register('featured')}
                            className="h-5 w-5 rounded border-zinc-700 bg-zinc-900 text-primary focus:ring-primary focus:ring-offset-zinc-900"
                        />
                        <label htmlFor="featured" className="text-sm font-bold text-white uppercase tracking-wider">Mark as Featured Unit</label>
                    </div>
                </div>

                <div className="space-y-6 border-t border-zinc-800 pt-8">
                    <h3 className="text-lg font-bold text-white uppercase tracking-widest font-heading italic">Product Specifications</h3>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Compatible Bike Models / Fitment</label>
                        <textarea
                            {...register('compatible_models')}
                            rows={3}
                            className="flex w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            placeholder="e.g. Yamaha R1 (2020+), Kawasaki Ninja ZX-10R"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">OEM / Part Number</label>
                            <input
                                {...register('oem_part_number')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                placeholder="e.g. 4569-88-A"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Material / Build Quality</label>
                            <input
                                {...register('material')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                placeholder="e.g. T6 Aluminum Alloy"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Warranty Information</label>
                            <input
                                {...register('warranty')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                placeholder="e.g. 2 Years Manufacturer"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Weight & Dimensions</label>
                            <input
                                {...register('weight_dimensions')}
                                className="flex h-12 w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                                placeholder="e.g. 500g / 15x10x5 cm"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Technical Specifications (Description)</label>
                        <textarea
                            {...register('description')}
                            rows={8}
                            className="flex w-full rounded-sm border border-zinc-800 bg-zinc-950 px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all font-mono text-sm"
                            placeholder="Data entry..."
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Visual Assets</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {images.map((url, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-sm overflow-hidden border border-zinc-700 bg-zinc-900">
                                    <Image src={url} alt="Product" fill className="object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}

                            <label className="flex flex-col items-center justify-center aspect-square rounded-sm border border-dashed border-zinc-700 hover:border-primary hover:bg-zinc-900/50 cursor-pointer transition-all group">
                                {uploading ? (
                                    <Loader2 className="animate-spin text-primary" />
                                ) : (
                                    <Upload className="text-zinc-600 group-hover:text-primary transition-colors" />
                                )}
                                <span className="text-[10px] text-zinc-500 mt-2 uppercase tracking-wider font-bold group-hover:text-white">Upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-zinc-800">
                <button
                    type="submit"
                    disabled={loading || uploading}
                    className="bg-primary text-black font-black uppercase tracking-wider px-10 py-4 rounded-sm hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2 clip-path-slant disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    {initialData ? 'Update System Entry' : 'Create System Entry'}
                </button>
            </div>
        </form>
    )
}
