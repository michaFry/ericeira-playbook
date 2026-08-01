import { NextResponse } from "next/server";
import { listApprovedServices, listCategories } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    categories: listCategories(),
    services: listApprovedServices(),
  });
}
