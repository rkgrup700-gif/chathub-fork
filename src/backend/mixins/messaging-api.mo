import Types "../types/messaging";
import MessagingLib "../lib/messaging";
import Map "mo:core/Map";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";

mixin (
  profiles : Map.Map<Types.UserId, Types.UserProfileInternal>,
  presences : Map.Map<Types.UserId, Types.UserPresenceInternal>,
  conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
  messages : Map.Map<Types.ConversationId, List.List<Types.MessageInternal>>,
  typingIndicators : List.List<Types.TypingIndicatorInternal>,
) {

  var nextConversationId : Nat = 0;
  var nextMessageId : Nat = 0;

  // ── Profile management ────────────────────────────────────────────────────

  public shared ({ caller }) func registerUser(username : Text, displayName : Text) : async Types.UserProfile {
    if (caller.isAnonymous()) Runtime.trap("anonymous users cannot register");
    MessagingLib.upsertProfile(profiles, caller, username, displayName);
  };

  public query ({ caller }) func getMyProfile() : async ?Types.UserProfile {
    MessagingLib.getProfile(profiles, caller);
  };

  public query func getUserProfile(userId : Types.UserId) : async ?Types.UserProfile {
    MessagingLib.getProfile(profiles, userId);
  };

  public query ({ caller }) func searchUsers(searchTerm : Text) : async [Types.UserProfile] {
    if (caller.isAnonymous()) return [];
    MessagingLib.searchUsers(profiles, searchTerm, caller);
  };

  // ── Presence tracking ─────────────────────────────────────────────────────

  public shared ({ caller }) func setOnline() : async () {
    if (caller.isAnonymous()) Runtime.trap("anonymous caller");
    MessagingLib.setPresence(presences, caller, #online);
  };

  public shared ({ caller }) func setOffline() : async () {
    if (caller.isAnonymous()) Runtime.trap("anonymous caller");
    MessagingLib.setPresence(presences, caller, #offline);
  };

  public query func getUserPresence(userId : Types.UserId) : async Types.UserPresence {
    MessagingLib.getPresence(presences, userId);
  };

  public query func getBulkPresence(userIds : [Types.UserId]) : async [Types.UserPresence] {
    MessagingLib.getBulkPresence(presences, userIds);
  };

  // ── Conversation management ───────────────────────────────────────────────

  public shared ({ caller }) func getOrCreateConversation(otherUserId : Types.UserId) : async Types.ConversationId {
    if (caller.isAnonymous()) Runtime.trap("anonymous caller");
    if (Principal.equal(caller, otherUserId)) Runtime.trap("cannot create conversation with yourself");
    let (convId, newNextId) = MessagingLib.getOrCreateConversation(conversations, nextConversationId, caller, otherUserId);
    nextConversationId := newNextId;
    convId;
  };

  public query ({ caller }) func listConversations() : async [Types.ConversationPreview] {
    if (caller.isAnonymous()) return [];
    MessagingLib.listConversations(conversations, profiles, caller);
  };

  public query ({ caller }) func getConversation(conversationId : Types.ConversationId) : async ?Types.Conversation {
    if (caller.isAnonymous()) return null;
    MessagingLib.getConversation(conversations, conversationId);
  };

  // ── Messaging ─────────────────────────────────────────────────────────────

  public shared ({ caller }) func sendMessage(conversationId : Types.ConversationId, text : Text) : async Types.Message {
    if (caller.isAnonymous()) Runtime.trap("anonymous caller");
    if (text.size() == 0) Runtime.trap("message cannot be empty");
    let senderName = switch (MessagingLib.getProfile(profiles, caller)) {
      case (?p) p.displayName;
      case null caller.toText();
    };
    let (msg, newNextId) = MessagingLib.sendMessage(messages, conversations, nextMessageId, conversationId, caller, senderName, text);
    nextMessageId := newNextId;
    msg;
  };

  public query ({ caller }) func getMessages(conversationId : Types.ConversationId) : async [Types.Message] {
    if (caller.isAnonymous()) return [];
    MessagingLib.getMessages(messages, conversations, conversationId, caller);
  };

  // ── Typing indicators ─────────────────────────────────────────────────────

  public shared ({ caller }) func setTyping(conversationId : Types.ConversationId, isTyping : Bool) : async () {
    if (caller.isAnonymous()) Runtime.trap("anonymous caller");
    MessagingLib.setTypingIndicator(typingIndicators, conversationId, caller, isTyping);
  };

  public query func getTypingUsers(conversationId : Types.ConversationId, excludeUserId : Types.UserId) : async [Types.UserId] {
    MessagingLib.getTypingUsers(typingIndicators, conversationId, excludeUserId);
  };
};
