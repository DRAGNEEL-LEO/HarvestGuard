import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const userResult = await supabase.auth.getUser()
    // Support both possible shapes returned by supabase: { data: { user } } or { user }
    const user = (userResult as any)?.data?.user ?? (userResult as any)?.user
    const userError = (userResult as any)?.error ?? null
    if (userError || !user) {
      console.error('[api/batches] unauthorized getUser()', userError)
      return NextResponse.json({ error: "Unauthorized", details: (userError as any)?.message ?? null }, { status: 401 })
    }

    const userId = user.id
    const { data, error } = await supabase.from("crop_batches").select("*").eq("user_id", userId).order("created_at", { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const userResult = await supabase.auth.getUser()
    const user = (userResult as any)?.data?.user ?? (userResult as any)?.user
    const userError = (userResult as any)?.error ?? null
    if (userError || !user) {
      console.error('[api/batches] unauthorized POST getUser()', userError)
      return NextResponse.json({ error: "Unauthorized", details: (userError as any)?.message ?? null }, { status: 401 })
    }

    const userId = user.id
    const body = await req.json()
    const payload = {
      user_id: userId,
      crop_type: body.cropType,
      estimated_weight: body.estimatedWeight,
      harvest_date: body.harvestDate ? new Date(body.harvestDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
      storage_location: body.storageLocation,
      storage_type: body.storageType,
      moisture_level: body.moisture ?? null,
      temperature: body.temperature ?? null,
      status: body.status ?? "active",
    }

    const { data, error } = await supabase.from("crop_batches").insert([payload]).select().single()
    if (error) {
      console.error('[api/batches] insert error', error)
      return NextResponse.json({ error: error.message, details: error }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}
