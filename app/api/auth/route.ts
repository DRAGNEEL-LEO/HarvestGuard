import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    message: "Auth endpoints available: /api/auth/login, /api/auth/signup, /api/auth/reset, /api/auth/resend",
  })
}
