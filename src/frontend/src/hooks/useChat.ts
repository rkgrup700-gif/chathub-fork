import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ConversationId,
  ConversationPreview,
  Message,
  UserId,
  UserPresence,
  UserProfile,
} from "../types/chat";
import { useAuth } from "./useAuth";

// ─── Mock data ────────────────────────────────────────────────────────────────

const CONVERSATIONS_KEY = "chathub_conversations";
const MESSAGES_KEY = "chathub_messages";
const USERS_KEY = "chathub_users";

function readStore<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStore<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// Seed realistic mock users on first load
function seedUsers(): UserProfile[] {
  const existing = readStore<UserProfile[]>(USERS_KEY, []);
  if (existing.length > 0) return existing;

  const users: UserProfile[] = [
    {
      id: "user_samantha",
      username: "samantha_reed",
      displayName: "Samantha Reed",
    },
    {
      id: "user_alex",
      username: "alex_thompson",
      displayName: "Alex Thompson",
    },
    { id: "user_arien", username: "arien_woeon", displayName: "Arien Woeon" },
    { id: "user_jaron", username: "jaron_smith", displayName: "Jaron Smith" },
    { id: "user_cord", username: "cord_brunch", displayName: "Cord Brunch" },
    { id: "user_jaeh", username: "jaeh_berward", displayName: "Jaeh Berward" },
    { id: "user_emsa", username: "emsa_brach", displayName: "Emsa Brach" },
    { id: "user_john", username: "john_morti", displayName: "John Morti" },
    { id: "user_jassa", username: "jassa_denne", displayName: "Jassa Denne" },
    { id: "user_muraa", username: "muraa_wioin", displayName: "Muraa Wioin" },
  ];
  writeStore(USERS_KEY, users);
  return users;
}

const PRESENCE_MAP: Record<UserId, "online" | "away" | "offline"> = {
  user_samantha: "online",
  user_alex: "online",
  user_arien: "online",
  user_jaron: "online",
  user_cord: "away",
  user_jaeh: "offline",
  user_emsa: "online",
  user_john: "away",
  user_jassa: "online",
  user_muraa: "offline",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useSearchUsers(term: string) {
  return useQuery<UserProfile[]>({
    queryKey: ["searchUsers", term],
    queryFn: async () => {
      const users = seedUsers();
      if (!term.trim()) return users;
      const lower = term.toLowerCase();
      return users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(lower) ||
          u.username.toLowerCase().includes(lower),
      );
    },
    enabled: true,
    staleTime: 1000 * 30,
  });
}

export function useConversations() {
  const { principalId } = useAuth();

  return useQuery<ConversationPreview[]>({
    queryKey: ["conversations", principalId],
    queryFn: async () => {
      if (!principalId) return [];
      seedUsers();
      const all = readStore<ConversationPreview[]>(CONVERSATIONS_KEY, []);
      return all
        .filter((c) => c.participantIds.includes(principalId))
        .sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    },
    enabled: !!principalId,
    refetchInterval: 3000,
  });
}

export function useMessages(conversationId: ConversationId | null) {
  return useQuery<Message[]>({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const all = readStore<Record<ConversationId, Message[]>>(
        MESSAGES_KEY,
        {},
      );
      return (all[conversationId] ?? []).sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp),
      );
    },
    enabled: !!conversationId,
    refetchInterval: 2000,
  });
}

export function useGetOrCreateConversation() {
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<ConversationId, Error, UserId>({
    mutationFn: async (otherUserId) => {
      if (!principalId) throw new Error("Not authenticated");

      const all = readStore<ConversationPreview[]>(CONVERSATIONS_KEY, []);
      const existing = all.find(
        (c) =>
          c.participantIds.includes(principalId) &&
          c.participantIds.includes(otherUserId),
      );
      if (existing) return existing.id;

      const users = seedUsers();
      const me = { id: principalId, displayName: "You" };
      const other = users.find((u) => u.id === otherUserId) ?? {
        id: otherUserId,
        displayName: otherUserId,
      };

      const newConv: ConversationPreview = {
        id: generateId(),
        participantIds: [principalId, otherUserId],
        participantNames: [me.displayName, other.displayName],
        lastMessageText: undefined,
        lastMessageTimestamp: undefined,
        updatedAt: BigInt(Date.now()),
      };
      writeStore(CONVERSATIONS_KEY, [...all, newConv]);
      return newConv.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useSendMessage() {
  const { principalId } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<
    Message,
    Error,
    { conversationId: ConversationId; text: string }
  >({
    mutationFn: async ({ conversationId, text }) => {
      if (!principalId) throw new Error("Not authenticated");

      const profileRaw = localStorage.getItem("chathub_profile");
      const profile = profileRaw
        ? (JSON.parse(profileRaw) as UserProfile)
        : null;
      const senderName = profile?.displayName ?? "You";

      const msg: Message = {
        id: generateId(),
        conversationId,
        senderId: principalId,
        senderName,
        text,
        timestamp: BigInt(Date.now()),
      };

      const allMessages = readStore<Record<ConversationId, Message[]>>(
        MESSAGES_KEY,
        {},
      );
      allMessages[conversationId] = [
        ...(allMessages[conversationId] ?? []),
        msg,
      ];
      writeStore(MESSAGES_KEY, allMessages);

      // Update conversation preview
      const allConvs = readStore<ConversationPreview[]>(CONVERSATIONS_KEY, []);
      const updated = allConvs.map((c) =>
        c.id === conversationId
          ? {
              ...c,
              lastMessageText: `You: ${text}`,
              lastMessageTimestamp: msg.timestamp,
              updatedAt: msg.timestamp,
            }
          : c,
      );
      writeStore(CONVERSATIONS_KEY, updated);

      return msg;
    },
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

export function useUserPresence(userId: UserId | null) {
  return useQuery<UserPresence | null>({
    queryKey: ["presence", userId],
    queryFn: async () => {
      if (!userId) return null;
      return {
        userId,
        status: PRESENCE_MAP[userId] ?? "offline",
        lastSeen: BigInt(Date.now()),
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 10,
  });
}

export function useAllUsers() {
  return useQuery<UserProfile[]>({
    queryKey: ["allUsers"],
    queryFn: () => Promise.resolve(seedUsers()),
    staleTime: 1000 * 60,
  });
}

export { PRESENCE_MAP };
