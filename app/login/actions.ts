'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const MIN_PASSWORD_LENGTH = 8

export async function login(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (data.password.length < MIN_PASSWORD_LENGTH + 1) {
    return `Password must be greater than ${MIN_PASSWORD_LENGTH} characters`
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return error.message
  }

  revalidatePath('/staff', 'layout')
  redirect('/staff')
}

export async function signup(
  prevState: string | null,
  formData: FormData,
): Promise<string | null> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  if (data.password.length < MIN_PASSWORD_LENGTH + 1) {
    return `Password must be greater than ${MIN_PASSWORD_LENGTH} characters`
  }

  const { data: result, error } = await supabase.auth.signUp(data)

  if (error) {
    return error.message
  }

  // prevents multiple accounts with same email
  if (result.user?.identities?.length === 0) {
    return 'This email is already registered. Please log in instead.'
  }

  if (!result.session) {
    return 'Check you email to confirm your account'
  }

  revalidatePath('/', 'layout')
  redirect('/staff')
}