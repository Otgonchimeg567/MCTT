import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Short-lived signed link, issued as the signed-in user: RLS on employee_documents/storage decides (admin or owner). */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase.from("employee_documents").select("name, storage_path").eq("id", id).maybeSingle();
  if (!doc) return new NextResponse("Бичиг баримт олдсонгүй эсвэл танд үзэх эрх байхгүй.", { status: 404 });

  const { data, error } = await supabase.storage.from("hr-files").createSignedUrl(doc.storage_path, 60, { download: doc.name });
  if (error || !data) return new NextResponse("Татах холбоос үүсгэж чадсангүй.", { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
