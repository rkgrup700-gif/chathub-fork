import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type UserId = Principal;
export interface UserPresence {
    status: PresenceStatus;
    userId: UserId;
    lastSeen: Timestamp;
}
export type Timestamp = bigint;
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    text: string;
    conversationId: ConversationId;
    timestamp: Timestamp;
    senderName: string;
    senderId: UserId;
}
export interface ConversationPreview {
    id: ConversationId;
    lastMessageTimestamp?: Timestamp;
    lastMessageText?: string;
    updatedAt: Timestamp;
    participantIds: Array<UserId>;
    participantNames: Array<string>;
}
export interface Conversation {
    id: ConversationId;
    lastMessage?: Message;
    updatedAt: Timestamp;
    participantIds: Array<UserId>;
}
export interface UserProfile {
    id: UserId;
    username: string;
    displayName: string;
    avatarUrl?: string;
}
export type ConversationId = bigint;
export enum PresenceStatus {
    offline = "offline",
    online = "online"
}
export interface backendInterface {
    getBulkPresence(userIds: Array<UserId>): Promise<Array<UserPresence>>;
    getConversation(conversationId: ConversationId): Promise<Conversation | null>;
    getMessages(conversationId: ConversationId): Promise<Array<Message>>;
    getMyProfile(): Promise<UserProfile | null>;
    getOrCreateConversation(otherUserId: UserId): Promise<ConversationId>;
    getTypingUsers(conversationId: ConversationId, excludeUserId: UserId): Promise<Array<UserId>>;
    getUserPresence(userId: UserId): Promise<UserPresence>;
    getUserProfile(userId: UserId): Promise<UserProfile | null>;
    listConversations(): Promise<Array<ConversationPreview>>;
    registerUser(username: string, displayName: string): Promise<UserProfile>;
    searchUsers(searchTerm: string): Promise<Array<UserProfile>>;
    sendMessage(conversationId: ConversationId, text: string): Promise<Message>;
    setOffline(): Promise<void>;
    setOnline(): Promise<void>;
    setTyping(conversationId: ConversationId, isTyping: boolean): Promise<void>;
}
