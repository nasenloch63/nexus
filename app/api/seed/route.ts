import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "No seeding needed - using static in-memory data.",
    accounts: [
      {
        email: "admin@nexussync.com",
        password: "admin123456",
        role: "admin",
        name: "Yasin Adam Aissani",
      },
      {
        email: "demo@nexussync.com",
        password: "demo123456",
        role: "user",
        name: "Demo User",
      },
    ],
  });
}
