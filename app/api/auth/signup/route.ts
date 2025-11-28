import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, preferredLanguage } = body

    let supabase
    try {
      supabase = await createClient()
    } catch (e) {
      return NextResponse.json({ error: `Supabase not configured: ${(e as Error).message}` }, { status: 500 })
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, preferred_language: preferredLanguage },
      },
    })
    // eslint-disable-next-line no-console
    console.debug('[api/auth/signup] signup result user id:', data?.user?.id)

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
