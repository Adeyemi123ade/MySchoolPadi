"use client";

import { formatDistanceToNowStrict } from "date-fns";
import { Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useDeleteMessage } from "@/features/messages/hooks/use-messages";
import { initials } from "@/lib/format";
import type { MessageWithDetails } from "@/types";

export function MessageItem({ message }: { message: MessageWithDetails }) {
  const { profile } = useAuth();
  const remove = useDeleteMessage();
  const isAuthor = profile?.id === message.author_id;

  return (
    <div className="flex items-start gap-3 rounded-md border border-border p-4">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={message.author?.avatar_url ?? undefined} alt={message.author?.full_name ?? ""} />
        <AvatarFallback>{initials(message.author?.full_name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-body font-semibold text-foreground">{message.author?.full_name ?? "Unknown"}</p>
          {message.course && <Badge variant="outline">{message.course.code}</Badge>}
        </div>
        <p className="mt-1 whitespace-pre-wrap text-body text-foreground">{message.body}</p>
        <p className="mt-1.5 text-caption text-muted-foreground">
          {formatDistanceToNowStrict(new Date(message.created_at), { addSuffix: true })}
        </p>
      </div>

      {isAuthor && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Delete message"
          onClick={() => remove.mutate(message.id)}
          disabled={remove.isPending}
        >
          <Trash2 className="size-4" />
        </Button>
      )}
    </div>
  );
}
