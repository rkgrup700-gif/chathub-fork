export type UserId = string;
export type MessageId = string;
export type ConversationId = string;
export type Timestamp = bigint;

export type PresenceStatus = "online" | "away" | "offline";

export interface UserProfile {
  id: UserId;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Message {
  id: MessageId;
  conversationId: ConversationId;
  senderId: UserId;
  senderName: string;
  text: string;
  timestamp: Timestamp;
}

export interface ConversationPreview {
  id: ConversationId;
  participantIds: UserId[];
  participantNames: string[];
  lastMessageText?: string;
  lastMessageTimestamp?: Timestamp;
  updatedAt: Timestamp;
}

export interface UserPresence {
  userId: UserId;
  status: PresenceStatus;
  lastSeen: Timestamp;
}

export interface SendMessageParams {
  conversationId: ConversationId;
  text: string;
}

export interface RegisterParams {
  username: string;
  displayName: string;
}
