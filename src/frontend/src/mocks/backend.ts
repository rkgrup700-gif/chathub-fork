import type { backendInterface } from "../backend";
import { Principal } from "@icp-sdk/core/principal";
import { PresenceStatus } from "../backend";

const principal1 = Principal.fromText("aaaaa-aa");
const principal2 = Principal.fromText("2vxsx-fae");
const principal3 = Principal.fromText("rrkah-fqaaa-aaaaa-aaaaq-cai");

const now = BigInt(Date.now()) * BigInt(1_000_000);
const oneMinAgo = now - BigInt(60_000_000_000);
const twoMinAgo = now - BigInt(120_000_000_000);
const tenMinAgo = now - BigInt(600_000_000_000);

export const mockBackend: backendInterface = {
  getBulkPresence: async (userIds) =>
    userIds.map((userId) => ({
      userId,
      status: PresenceStatus.online,
      lastSeen: now,
    })),

  getConversation: async (conversationId) => ({
    id: conversationId,
    updatedAt: now,
    participantIds: [principal1, principal2],
    lastMessage: {
      id: BigInt(1),
      text: "Hey! How are you doing?",
      conversationId,
      timestamp: oneMinAgo,
      senderName: "Samantha Reed",
      senderId: principal2,
    },
  }),

  getMessages: async (conversationId) => [
    {
      id: BigInt(1),
      text: "Hey! How are you doing? 👋",
      conversationId,
      timestamp: tenMinAgo,
      senderName: "Samantha Reed",
      senderId: principal2,
    },
    {
      id: BigInt(2),
      text: "I'm good! Thanks for asking. How about you?",
      conversationId,
      timestamp: twoMinAgo,
      senderName: "Me",
      senderId: principal1,
    },
    {
      id: BigInt(3),
      text: "Doing great! Have you seen the new features on ChatHub?",
      conversationId,
      timestamp: oneMinAgo,
      senderName: "Samantha Reed",
      senderId: principal2,
    },
    {
      id: BigInt(4),
      text: "Not yet, but I heard it's amazing! 🚀",
      conversationId,
      timestamp: now,
      senderName: "Me",
      senderId: principal1,
    },
  ],

  getMyProfile: async () => ({
    id: principal1,
    username: "alexj",
    displayName: "Alex Johnson",
    avatarUrl: undefined,
  }),

  getOrCreateConversation: async () => BigInt(1),

  getTypingUsers: async () => [],

  getUserPresence: async (userId) => ({
    userId,
    status: PresenceStatus.online,
    lastSeen: now,
  }),

  getUserProfile: async (userId) => ({
    id: userId,
    username: "samanthar",
    displayName: "Samantha Reed",
    avatarUrl: undefined,
  }),

  listConversations: async () => [
    {
      id: BigInt(1),
      updatedAt: now,
      participantIds: [principal1, principal2],
      participantNames: ["Alex Johnson", "Samantha Reed"],
      lastMessageText: "Doing great! Have you seen the new features?",
      lastMessageTimestamp: oneMinAgo,
    },
    {
      id: BigInt(2),
      updatedAt: twoMinAgo,
      participantIds: [principal1, principal3],
      participantNames: ["Alex Johnson", "Marcus Chen"],
      lastMessageText: "Let's catch up soon!",
      lastMessageTimestamp: twoMinAgo,
    },
    {
      id: BigInt(3),
      updatedAt: tenMinAgo,
      participantIds: [principal1, principal2],
      participantNames: ["Alex Johnson", "Jordan Lee"],
      lastMessageText: "Thanks for the help yesterday 🙏",
      lastMessageTimestamp: tenMinAgo,
    },
  ],

  registerUser: async (username, displayName) => ({
    id: principal1,
    username,
    displayName,
    avatarUrl: undefined,
  }),

  searchUsers: async () => [
    {
      id: principal2,
      username: "samanthar",
      displayName: "Samantha Reed",
      avatarUrl: undefined,
    },
    {
      id: principal3,
      username: "marcusc",
      displayName: "Marcus Chen",
      avatarUrl: undefined,
    },
  ],

  sendMessage: async (conversationId, text) => ({
    id: BigInt(99),
    text,
    conversationId,
    timestamp: now,
    senderName: "Me",
    senderId: principal1,
  }),

  setOffline: async () => undefined,
  setOnline: async () => undefined,
  setTyping: async () => undefined,
};
