import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Short-lived signed link, issued as the signed-in user: RLS on files/storage decides whether it's allowed. */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: file } = await supabase.from("files").select("name, storage_path").eq("id", id).maybeSingle();
  if (!file) return new NextResponse("Файл олдсонгүй эсвэл танд үзэх эрх байхгүй.", { status: 404 });

  const { data, error } = await supabase.storage.from("work-files").createSignedUrl(file.storage_path, 60, { download: file.name });
  if (error || !data) return new NextResponse("Татах холбоос үүсгэж чадсангүй.", { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
