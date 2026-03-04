'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createBanner(formData: FormData) {
    const supabase = await createClient()

    const image_url = formData.get('image_url') as string
    const sort_order = Number(formData.get('sort_order')) || 0
    const active = formData.get('active') === 'on'

    const { error } = await supabase.from('banners').insert({
        image_url,
        sort_order,
        active,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/banners')
    redirect('/admin/banners')
}

export async function deleteBanner(id: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('banners').delete().eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/banners')
    return { success: true }
}

export async function toggleBannerStatus(id: string, currentStatus: boolean) {
    const supabase = await createClient()
    const { error } = await supabase.from('banners').update({ active: !currentStatus }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/banners')
    return { success: true }
}

export async function updateBannerOrder(id: string, newOrder: number) {
    const supabase = await createClient()
    const { error } = await supabase.from('banners').update({ sort_order: newOrder }).eq('id', id)
    if (error) return { error: error.message }
    revalidatePath('/admin/banners')
    revalidatePath('/')
    return { success: true }
}
