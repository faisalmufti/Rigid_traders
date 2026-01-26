'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCategory(formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const show_on_home = formData.get('show_on_home') === 'on'

    const { error } = await supabase.from('categories').insert({
        name,
        slug,
        show_on_home,
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    redirect('/admin/categories')
}

export async function deleteCategory(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    return { success: true }
}

export async function getCategory(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        return { error: error.message, category: null }
    }

    return { category: data }
}

export async function updateCategory(id: string, formData: FormData) {
    const supabase = await createClient()

    const name = formData.get('name') as string
    const slug = formData.get('slug') as string
    const show_on_home = formData.get('show_on_home') === 'on'

    const { error } = await supabase
        .from('categories')
        .update({
            name,
            slug,
            show_on_home,
        })
        .eq('id', id)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/categories')
    revalidatePath('/')
    redirect('/admin/categories')
}
