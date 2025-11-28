import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = body

    let supabase
    try {
      supabase = await createClient()
    } catch (e) {
      return NextResponse.json({ error: `Supabase not configured: ${(e as Error).message}` }, { status: 500 })
    }
    // Resend a signup confirmation email
    const { data, error } = await supabase.auth.resend({ type: 'signup', email })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json({ data, message: 'Confirmation resend requested' })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
