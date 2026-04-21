import { d as useAuth, i as useQuery, j as useMutation } from "./input-B-s54t3O.js";
import { e as useQueryClient } from "./index-CW3Vuo4s.js";
const CONVERSATIONS_KEY = "chathub_conversations";
const MESSAGES_KEY = "chathub_messages";
const USERS_KEY = "chathub_users";
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
function writeStore(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
function seedUsers() {
  const existing = readStore(USERS_KEY, []);
  if (existing.length > 0) return existing;
  const users = [
    {
      id: "user_samantha",
      username: "samantha_reed",
      displayName: "Samantha Reed"
    },
    {
      id: "user_alex",
      username: "alex_thompson",
      displayName: "Alex Thompson"
    },
    { id: "user_arien", username: "arien_woeon", displayName: "Arien Woeon" },
    { id: "user_jaron", username: "jaron_smith", displayName: "Jaron Smith" },
    { id: "user_cord", username: "cord_brunch", displayName: "Cord Brunch" },
    { id: "user_jaeh", username: "jaeh_berward", displayName: "Jaeh Berward" },
    { id: "user_emsa", username: "emsa_brach", displayName: "Emsa Brach" },
    { id: "user_john", username: "john_morti", displayName: "John Morti" },
    { id: "user_jassa", username: "jassa_denne", displayName: "Jassa Denne" },
    { id: "user_muraa", username: "muraa_wioin", displayName: "Muraa Wioin" }
  ];
  writeStore(USERS_KEY, users);
  return users;
}
const PRESENCE_MAP = {
  user_samantha: "online",
  user_alex: "online",
  user_arien: "online",
  user_jaron: "online",
  user_cord: "away",
  user_jaeh: "offline",
  user_emsa: "online",
  user_john: "away",
  user_jassa: "online",
  user_muraa: "offline"
};
function useConversations() {
  const { principalId } = useAuth();
  return useQuery({
    queryKey: ["conversations", principalId],
    queryFn: async () => {
      if (!principalId) return [];
      seedUsers();
      const all = readStore(CONVERSATIONS_KEY, []);
      return all.filter((c) => c.participantIds.includes(principalId)).sort((a, b) => Number(b.updatedAt) - Number(a.updatedAt));
    },
    enabled: !!principalId,
    refetchInterval: 3e3
  });
}
function useMessages(conversationId) {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: async () => {
      if (!conversationId) return [];
      const all = readStore(
        MESSAGES_KEY,
        {}
      );
      return (all[conversationId] ?? []).sort(
        (a, b) => Number(a.timestamp) - Number(b.timestamp)
      );
    },
    enabled: !!conversationId,
    refetchInterval: 2e3
  });
}
function useGetOrCreateConversation() {
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (otherUserId) => {
      if (!principalId) throw new Error("Not authenticated");
      const all = readStore(CONVERSATIONS_KEY, []);
      const existing = all.find(
        (c) => c.participantIds.includes(principalId) && c.participantIds.includes(otherUserId)
      );
      if (existing) return existing.id;
      const users = seedUsers();
      const me = { displayName: "You" };
      const other = users.find((u) => u.id === otherUserId) ?? {
        displayName: otherUserId
      };
      const newConv = {
        id: generateId(),
        participantIds: [principalId, otherUserId],
        participantNames: [me.displayName, other.displayName],
        lastMessageText: void 0,
        lastMessageTimestamp: void 0,
        updatedAt: BigInt(Date.now())
      };
      writeStore(CONVERSATIONS_KEY, [...all, newConv]);
      return newConv.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
}
function useSendMessage() {
  const { principalId } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, text }) => {
      if (!principalId) throw new Error("Not authenticated");
      const profileRaw = localStorage.getItem("chathub_profile");
      const profile = profileRaw ? JSON.parse(profileRaw) : null;
      const senderName = (profile == null ? void 0 : profile.displayName) ?? "You";
      const msg = {
        id: generateId(),
        conversationId,
        senderId: principalId,
        senderName,
        text,
        timestamp: BigInt(Date.now())
      };
      const allMessages = readStore(
        MESSAGES_KEY,
        {}
      );
      allMessages[conversationId] = [
        ...allMessages[conversationId] ?? [],
        msg
      ];
      writeStore(MESSAGES_KEY, allMessages);
      const allConvs = readStore(CONVERSATIONS_KEY, []);
      const updated = allConvs.map(
        (c) => c.id === conversationId ? {
          ...c,
          lastMessageText: `You: ${text}`,
          lastMessageTimestamp: msg.timestamp,
          updatedAt: msg.timestamp
        } : c
      );
      writeStore(CONVERSATIONS_KEY, updated);
      return msg;
    },
    onSuccess: (_data, { conversationId }) => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    }
  });
}
function useAllUsers() {
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: () => Promise.resolve(seedUsers()),
    staleTime: 1e3 * 60
  });
}
export {
  PRESENCE_MAP as P,
  useGetOrCreateConversation as a,
  useMessages as b,
  useSendMessage as c,
  useAllUsers as d,
  useConversations as u
};
