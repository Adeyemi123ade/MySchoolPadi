import type { NextRequest } from "next/server";
import { messagesService } from "@/services";
import { requireUser } from "@/lib/api/auth";
import { apiErrorFromException, apiSuccess } from "@/lib/api/response";

type Params = { params: Promise<{ id: string }> };

/** DELETE /api/messages/:id — delete a message. RLS restricts this to the author or an admin. */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const { supabase } = await requireUser();

    const { error } = await messagesService.remove(supabase, id);
    if (error) throw error;

    return apiSuccess({ success: true });
  } catch (error) {
    return apiErrorFromException(error);
  }
}
