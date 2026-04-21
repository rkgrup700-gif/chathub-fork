import { AuthenticatedLayout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllUsers } from "@/hooks/useChat";
import { PRESENCE_MAP, useGetOrCreateConversation } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { MessageCircle, Search, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type PresenceStatus = "online" | "away" | "offline";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const STATUS_LABEL: Record<PresenceStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

const STATUS_COLOR: Record<PresenceStatus, string> = {
  online: "bg-primary",
  away: "bg-amber-400",
  offline: "bg-muted-foreground/40",
};

export default function PeoplePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "online">("all");
  const { data: users = [], isLoading } = useAllUsers();
  const getOrCreate = useGetOrCreateConversation();

  const filtered = users.filter((u) => {
    const presence = (PRESENCE_MAP[u.id] ?? "offline") as PresenceStatus;
    const matchesSearch =
      !search.trim() ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || presence === "online";
    return matchesSearch && matchesFilter;
  });

  async function handleMessage(userId: string) {
    try {
      const convId = await getOrCreate.mutateAsync(userId);
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: convId },
      });
    } catch {
      toast.error("Failed to open conversation");
    }
  }

  return (
    <AuthenticatedLayout>
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-xs">
          <div>
            <h1 className="font-display font-bold text-xl">People</h1>
            <p className="text-sm text-muted-foreground">
              Discover and connect with others
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search people…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 bg-muted border-0 focus-visible:ring-0 h-9 w-56"
                data-ocid="people.search_input"
              />
            </div>
          </div>
        </header>

        {/* Filter tabs */}
        <div className="px-6 py-3 border-b border-border bg-background flex gap-1">
          {(["all", "online"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              data-ocid={`people.filter.${f}.tab`}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-smooth",
                filter === f
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {f === "online" ? "Online now" : "All people"}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {isLoading ? (
            <div
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="people.loading_state"
            >
              {["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => (
                <div
                  key={k}
                  className="bg-card rounded-xl p-5 border border-border flex flex-col items-center gap-3"
                >
                  <Skeleton className="size-16 rounded-full" />
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full rounded-lg" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-center"
              data-ocid="people.empty_state"
            >
              <div className="size-14 rounded-full bg-muted flex items-center justify-center mb-4">
                <UserPlus className="size-6 text-muted-foreground" />
              </div>
              <p className="font-medium mb-1">No people found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filter
              </p>
            </div>
          ) : (
            <div
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="people.list"
            >
              {filtered.map((user, idx) => {
                const presence = (PRESENCE_MAP[user.id] ??
                  "offline") as PresenceStatus;
                return (
                  <div
                    key={user.id}
                    data-ocid={`people.item.${idx + 1}`}
                    className="bg-card rounded-xl p-5 border border-border shadow-conversation flex flex-col items-center gap-3 hover:shadow-elevated transition-smooth"
                  >
                    <div className="relative">
                      <Avatar className="size-16">
                        <AvatarFallback className="bg-primary/15 text-primary font-bold text-lg">
                          {getInitials(user.displayName)}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={cn(
                          "absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-card",
                          STATUS_COLOR[presence],
                        )}
                      />
                    </div>
                    <div className="text-center min-w-0 w-full">
                      <p className="font-display font-semibold text-sm truncate">
                        {user.displayName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-medium",
                        presence === "online" &&
                          "bg-primary/10 text-primary border-primary/20",
                        presence === "away" &&
                          "bg-amber-50 text-amber-600 border-amber-200",
                        presence === "offline" &&
                          "bg-muted text-muted-foreground",
                      )}
                    >
                      {STATUS_LABEL[presence]}
                    </Badge>
                    <Button
                      type="button"
                      size="sm"
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                      onClick={() => handleMessage(user.id)}
                      disabled={getOrCreate.isPending}
                      data-ocid={`people.message.button.${idx + 1}`}
                    >
                      <MessageCircle className="size-3.5" />
                      Message
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
