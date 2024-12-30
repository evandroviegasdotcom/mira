// File: src/app/api/upload-cover/route.ts
import { NextResponse } from "next/server";
import { utapi } from "@/uploadthing";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  try {
    const response = await utapi.uploadFiles(file);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}