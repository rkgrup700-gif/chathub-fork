import { AuthenticatedLayout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  PRESENCE_MAP,
  useAllUsers,
  useConversations,
  useGetOrCreateConversation,
  useMessages,
  useSendMessage,
} from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import type { ConversationPreview, Message } from "@/types/chat";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ImageIcon,
  MessageCircle,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Send,
  Smile,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Utilities ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTimestamp(ts: bigint | number | undefined): string {
  if (!ts) return "";
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 60_000) return "now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return new Date(ms).toLocaleDateString();
}

type PresenceStatus = "online" | "away" | "offline";

const PRESENCE_LABEL: Record<PresenceStatus, string> = {
  online: "Online",
  away: "Away",
  offline: "Offline",
};

// ─── Presence dot ─────────────────────────────────────────────────────────────

function PresenceDot({
  status,
  className,
}: { status: PresenceStatus; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card",
        status === "online" && "bg-primary",
        status === "away" && "bg-amber-400",
        status === "offline" && "bg-muted-foreground/40",
        className,
      )}
    />
  );
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ name }: { name: string }) {
  return (
    <div className="flex items-end gap-2 animate-message-in">
      <Avatar className="size-7 shrink-0 mb-0.5">
        <AvatarFallback className="bg-muted text-muted-foreground text-xs">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border shadow-message">
        <span className="typing-dot bg-muted-foreground/60" />
        <span className="typing-dot bg-muted-foreground/60" />
        <span className="typing-dot bg-muted-foreground/60" />
      </div>
    </div>
  );
}

// ─── Conversation list item ───────────────────────────────────────────────────

function ConversationItem({
  conv,
  myId,
  isActive,
  onClick,
  index,
}: {
  conv: ConversationPreview;
  myId: string;
  isActive: boolean;
  onClick: () => void;
  index: number;
}) {
  const otherId =
    conv.participantIds.find((id) => id !== myId) ?? conv.participantIds[0];
  const otherName =
    conv.participantNames[conv.participantIds.indexOf(otherId)] ?? "Unknown";
  const presence = (PRESENCE_MAP[otherId] ?? "offline") as PresenceStatus;
  const initials = getInitials(otherName);

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`conversations.item.${index + 1}`}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-smooth group",
        isActive
          ? "bg-primary/10 border border-primary/20"
          : "hover:bg-muted/60 border border-transparent",
      )}
    >
      <div className="relative shrink-0">
        <Avatar className="size-10">
          <AvatarFallback
            className={cn(
              "text-sm font-semibold",
              isActive
                ? "bg-primary/20 text-primary"
                : "bg-muted text-muted-foreground",
            )}
          >
            {initials}
          </AvatarFallback>
        </Avatar>
        <PresenceDot status={presence} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="font-medium text-sm truncate">{otherName}</span>
          {conv.lastMessageTimestamp && (
            <span className="text-[11px] text-muted-foreground shrink-0">
              {formatTimestamp(conv.lastMessageTimestamp)}
            </span>
          )}
        </div>
        {conv.lastMessageText && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">
            {conv.lastMessageText}
          </p>
        )}
      </div>
    </button>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  isMine,
  showName,
}: {
  msg: Message;
  isMine: boolean;
  showName: boolean;
}) {
  return (
    <div
      className={cn(
        "flex gap-2 items-end animate-message-in",
        isMine && "flex-row-reverse",
      )}
    >
      {!isMine && (
        <Avatar className="size-7 shrink-0 mb-0.5">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            {getInitials(msg.senderName)}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "flex flex-col gap-0.5 max-w-[70%]",
          isMine && "items-end",
        )}
      >
        {showName && !isMine && (
          <span className="text-xs text-muted-foreground px-1">
            {msg.senderName}
          </span>
        )}
        <div
          className={cn(
            "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-message",
            isMine
              ? "bg-primary text-primary-foreground rounded-br-sm"
              : "bg-card border border-border text-foreground rounded-bl-sm",
          )}
        >
          {msg.text}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTimestamp(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

// ─── New chat panel ───────────────────────────────────────────────────────────

function NewChatPanel({
  onSelect,
  onClose,
}: {
  onSelect: (userId: string) => void;
  onClose: () => void;
}) {
  const [term, setTerm] = useState("");
  const { data: users = [] } = useAllUsers();
  const filtered = users.filter(
    (u) =>
      !term.trim() ||
      u.displayName.toLowerCase().includes(term.toLowerCase()) ||
      u.username.toLowerCase().includes(term.toLowerCase()),
  );

  return (
    <div
      className="absolute inset-0 bg-card z-20 flex flex-col rounded-xl border border-border shadow-elevated"
      data-ocid="new_chat.panel"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <span className="font-display font-semibold text-sm">
          New conversation
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          data-ocid="new_chat.close_button"
        >
          Close
        </Button>
      </div>
      <div className="px-3 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search people…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="pl-8 bg-muted border-0 focus-visible:ring-0"
            data-ocid="new_chat.search_input"
            autoFocus
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-0.5">
        {filtered.map((u) => {
          const presence = (PRESENCE_MAP[u.id] ?? "offline") as PresenceStatus;
          return (
            <button
              type="button"
              key={u.id}
              onClick={() => onSelect(u.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-smooth text-left"
              data-ocid="new_chat.user.item"
            >
              <div className="relative shrink-0">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
                    {getInitials(u.displayName)}
                  </AvatarFallback>
                </Avatar>
                <PresenceDot status={presence} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{u.displayName}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-1.5 rounded-full inline-block",
                      presence === "online" && "bg-primary",
                      presence === "away" && "bg-amber-400",
                      presence === "offline" && "bg-muted-foreground/40",
                    )}
                  />
                  {PRESENCE_LABEL[presence]} · @{u.username}
                </p>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div
            className="text-center text-muted-foreground text-sm py-8"
            data-ocid="new_chat.empty_state"
          >
            No users found
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function ConversationSidebar({
  myId,
  activeId,
  showNewChat,
  setShowNewChat,
  onSelectConversation,
  onStartChat,
}: {
  myId: string;
  activeId: string | null;
  showNewChat: boolean;
  setShowNewChat: (v: boolean) => void;
  onSelectConversation: (id: string) => void;
  onStartChat: (userId: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: conversations = [], isLoading: convsLoading } =
    useConversations();

  const filteredConvs = conversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const idx = c.participantIds.findIndex((id) => id !== myId);
    const name = c.participantNames[idx] ?? "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card flex flex-col">
      <div className="px-4 pt-5 pb-3 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-display font-bold text-lg">Messages</h1>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="size-8 hover:bg-primary/10 hover:text-primary"
            onClick={() => setShowNewChat(true)}
            data-ocid="conversations.new_chat.open_modal_button"
            aria-label="New conversation"
          >
            <Plus className="size-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search chats…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-muted border-0 focus-visible:ring-0 text-sm h-9"
            data-ocid="conversations.search_input"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 relative flex flex-col gap-0.5">
        {showNewChat && (
          <NewChatPanel
            onSelect={onStartChat}
            onClose={() => setShowNewChat(false)}
          />
        )}

        {convsLoading ? (
          <>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Active conversations
            </p>
            {["s1", "s2", "s3", "s4", "s5"].map((sid) => (
              <div key={sid} className="flex items-center gap-3 px-3 py-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 flex flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
              </div>
            ))}
          </>
        ) : filteredConvs.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-12 px-4 text-center"
            data-ocid="conversations.empty_state"
          >
            <div className="size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <MessageCircle className="size-5 text-muted-foreground" />
            </div>
            <p className="font-medium text-sm mb-1">No conversations yet</p>
            <p className="text-xs text-muted-foreground mb-3">
              Start chatting by tapping the + button
            </p>
            <Button
              type="button"
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => setShowNewChat(true)}
              data-ocid="conversations.start_chat.primary_button"
            >
              Start a chat
            </Button>
          </div>
        ) : (
          <>
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
              Active conversations
            </p>
            {filteredConvs.map((conv, i) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                myId={myId}
                isActive={conv.id === activeId}
                onClick={() => onSelectConversation(conv.id)}
                index={i}
              />
            ))}
          </>
        )}
      </div>
    </aside>
  );
}

// ─── Chat area ────────────────────────────────────────────────────────────────

function ChatArea({
  activeConv,
  myId,
  onNewChat,
}: {
  activeConv: ConversationPreview | null;
  myId: string;
  onNewChat: () => void;
}) {
  const [messageText, setMessageText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: messages = [], isLoading: msgsLoading } = useMessages(
    activeConv?.id ?? null,
  );
  const sendMessage = useSendMessage();

  const otherId = activeConv
    ? (activeConv.participantIds.find((id) => id !== myId) ?? "")
    : "";
  const otherName = activeConv
    ? (activeConv.participantNames[
        activeConv.participantIds.indexOf(otherId)
      ] ?? "Unknown")
    : "";
  const otherPresence = (PRESENCE_MAP[otherId] ?? "offline") as PresenceStatus;

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Simulate typing indicator when receiving a new outgoing message
  const lastMsg = messages[messages.length - 1];
  useEffect(() => {
    if (!lastMsg) return;
    if (lastMsg.senderId === myId && otherPresence === "online") {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 3000);
    }
  }, [lastMsg, myId, otherPresence]);

  async function handleSend(e?: React.FormEvent) {
    e?.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    const text = messageText.trim();
    setMessageText("");
    try {
      await sendMessage.mutateAsync({
        conversationId: activeConv.id,
        text,
      });
    } catch {
      toast.error("Failed to send message");
    }
  }

  if (!activeConv) {
    return (
      <div
        className="flex-1 flex flex-col items-center justify-center bg-background text-center px-6"
        data-ocid="chat.no_selection.empty_state"
      >
        <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <MessageCircle className="size-8 text-primary" />
        </div>
        <h2 className="font-display font-bold text-xl mb-2">Your messages</h2>
        <p className="text-muted-foreground text-sm max-w-xs mb-5">
          Select a conversation from the left, or start a new chat with someone
          new.
        </p>
        <Button
          type="button"
          className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
          onClick={onNewChat}
          data-ocid="chat.new_chat.primary_button"
        >
          <Plus className="size-4" />
          New conversation
        </Button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-background">
      {/* Chat header */}
      <header className="flex items-center justify-between px-5 py-3.5 bg-card border-b border-border shadow-xs">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="size-9">
              <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
                {getInitials(otherName)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot status={otherPresence} />
          </div>
          <div>
            <p className="font-display font-semibold text-sm">{otherName}</p>
            <p
              className={cn(
                "text-xs flex items-center gap-1",
                otherPresence === "online"
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  otherPresence === "online" && "bg-primary",
                  otherPresence === "away" && "bg-amber-400",
                  otherPresence === "offline" && "bg-muted-foreground/40",
                )}
              />
              {PRESENCE_LABEL[otherPresence]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Voice call"
            data-ocid="chat.header.call_button"
          >
            <Phone className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="Video call"
            data-ocid="chat.header.video_button"
          >
            <Video className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-8 text-muted-foreground hover:text-foreground"
            aria-label="More options"
            data-ocid="chat.header.more_button"
          >
            <MoreVertical className="size-4" />
          </Button>
        </div>
      </header>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3"
        data-ocid="chat.messages.list"
      >
        {msgsLoading ? (
          <div
            data-ocid="chat.messages.loading_state"
            className="flex flex-col gap-3"
          >
            {(["m1", "m2", "m3", "m4"] as const).map((mid, i) => (
              <div
                key={mid}
                className={cn("flex gap-2", i % 2 === 1 && "flex-row-reverse")}
              >
                <Skeleton className="size-7 rounded-full shrink-0" />
                <Skeleton
                  className={cn(
                    "h-10 rounded-2xl",
                    i % 2 === 1 ? "w-40" : "w-56",
                  )}
                />
              </div>
            ))}
          </div>
        ) : messages.length === 0 ? (
          <div
            className="flex-1 flex flex-col items-center justify-center text-center py-12"
            data-ocid="chat.messages.empty_state"
          >
            <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <MessageCircle className="size-5 text-primary" />
            </div>
            <p className="font-display font-semibold text-sm">Say hello! 👋</p>
            <p className="text-xs text-muted-foreground mt-1">
              Start the conversation with {otherName}
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMine = msg.senderId === myId;
            const prevMsg = messages[i - 1];
            const showName =
              !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId);
            return (
              <MessageBubble
                key={msg.id}
                msg={msg}
                isMine={isMine}
                showName={showName}
              />
            );
          })
        )}
        {isTyping && <TypingIndicator name={otherName} />}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 px-4 py-3.5 bg-card border-t border-border"
        data-ocid="chat.input.form"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground shrink-0 hover:text-primary"
          aria-label="Attach image"
          data-ocid="chat.attach.upload_button"
        >
          <ImageIcon className="size-4" />
        </Button>
        <Input
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type a message…"
          className="flex-1 bg-muted border-0 focus-visible:ring-0 rounded-full px-4"
          data-ocid="chat.message.input"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-9 text-muted-foreground shrink-0 hover:text-primary"
          aria-label="Emoji"
          data-ocid="chat.emoji.button"
        >
          <Smile className="size-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="size-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full shadow-message"
          disabled={!messageText.trim() || sendMessage.isPending}
          data-ocid="chat.send.primary_button"
          aria-label="Send message"
        >
          <Send className="size-4" />
        </Button>
      </form>
    </div>
  );
}

// ─── Main ChatPage ────────────────────────────────────────────────────────────

export default function ChatPage() {
  const { principalId } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false }) as { conversationId?: string };
  const activeId = params.conversationId ?? null;
  const [showNewChat, setShowNewChat] = useState(false);

  const { data: conversations = [] } = useConversations();
  const getOrCreate = useGetOrCreateConversation();

  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const myId = principalId ?? "";

  async function handleNewChat(userId: string) {
    try {
      const convId = await getOrCreate.mutateAsync(userId);
      setShowNewChat(false);
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: convId },
      });
    } catch {
      toast.error("Failed to start conversation");
    }
  }

  if (!principalId) {
    navigate({ to: "/" });
    return null;
  }

  return (
    <AuthenticatedLayout>
      <div className="flex flex-1 min-h-0 h-full">
        <ConversationSidebar
          myId={myId}
          activeId={activeId}
          showNewChat={showNewChat}
          setShowNewChat={setShowNewChat}
          onSelectConversation={(id) =>
            navigate({
              to: "/chat/$conversationId",
              params: { conversationId: id },
            })
          }
          onStartChat={handleNewChat}
        />
        <ChatArea
          activeConv={activeConv}
          myId={myId}
          onNewChat={() => setShowNewChat(true)}
        />
      </div>
    </AuthenticatedLayout>
  );
}
