import Types "../types/messaging";
import List "mo:core/List";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Order "mo:core/Order";

module {
  // ── Conversion helpers ────────────────────────────────────────────────────

  public func toPublicProfile(internal : Types.UserProfileInternal) : Types.UserProfile {
    {
      id = internal.id;
      username = internal.username;
      displayName = internal.displayName;
      avatarUrl = internal.avatarUrl;
    };
  };

  public func toPublicMessage(internal : Types.MessageInternal) : Types.Message {
    {
      id = internal.id;
      conversationId = internal.conversationId;
      senderId = internal.senderId;
      senderName = internal.senderName;
      text = internal.text;
      timestamp = internal.timestamp;
    };
  };

  public func toPublicConversation(internal : Types.ConversationInternal) : Types.Conversation {
    {
      id = internal.id;
      participantIds = internal.participantIds;
      lastMessage = switch (internal.lastMessage) {
        case (?m) ?toPublicMessage(m);
        case null null;
      };
      updatedAt = internal.updatedAt;
    };
  };

  // ── Profile helpers ───────────────────────────────────────────────────────

  public func getProfile(
    profiles : Map.Map<Types.UserId, Types.UserProfileInternal>,
    userId : Types.UserId,
  ) : ?Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?internal) ?toPublicProfile(internal);
      case null null;
    };
  };

  public func upsertProfile(
    profiles : Map.Map<Types.UserId, Types.UserProfileInternal>,
    userId : Types.UserId,
    username : Text,
    displayName : Text,
  ) : Types.UserProfile {
    switch (profiles.get(userId)) {
      case (?existing) {
        existing.username := username;
        existing.displayName := displayName;
        toPublicProfile(existing);
      };
      case null {
        let internal : Types.UserProfileInternal = {
          id = userId;
          var username = username;
          var displayName = displayName;
          var avatarUrl = null;
        };
        profiles.add(userId, internal);
        toPublicProfile(internal);
      };
    };
  };

  public func searchUsers(
    profiles : Map.Map<Types.UserId, Types.UserProfileInternal>,
    searchTerm : Text,
    caller : Types.UserId,
  ) : [Types.UserProfile] {
    let lower = searchTerm.toLower();
    let results = List.empty<Types.UserProfile>();
    for ((_, p) in profiles.entries()) {
      if (
        not Principal.equal(p.id, caller) and (
          p.username.toLower().contains(#text lower) or
          p.displayName.toLower().contains(#text lower)
        )
      ) {
        results.add(toPublicProfile(p));
      };
    };
    results.toArray();
  };

  // ── Presence helpers ──────────────────────────────────────────────────────

  public func setPresence(
    presences : Map.Map<Types.UserId, Types.UserPresenceInternal>,
    userId : Types.UserId,
    status : Types.PresenceStatus,
  ) : () {
    let now = Time.now();
    switch (presences.get(userId)) {
      case (?existing) {
        existing.status := status;
        existing.lastSeen := now;
      };
      case null {
        presences.add(
          userId,
          {
            userId = userId;
            var status = status;
            var lastSeen = now;
          },
        );
      };
    };
  };

  public func getPresence(
    presences : Map.Map<Types.UserId, Types.UserPresenceInternal>,
    userId : Types.UserId,
  ) : Types.UserPresence {
    switch (presences.get(userId)) {
      case (?p) { { userId = p.userId; status = p.status; lastSeen = p.lastSeen } };
      case null { { userId = userId; status = #offline; lastSeen = 0 } };
    };
  };

  public func getBulkPresence(
    presences : Map.Map<Types.UserId, Types.UserPresenceInternal>,
    userIds : [Types.UserId],
  ) : [Types.UserPresence] {
    userIds.map<Types.UserId, Types.UserPresence>(func(uid) { getPresence(presences, uid) });
  };

  // ── Conversation helpers ──────────────────────────────────────────────────

  public func getOrCreateConversation(
    conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
    nextId : Nat,
    participantA : Types.UserId,
    participantB : Types.UserId,
  ) : (Types.ConversationId, Nat) {
    // Check if a conversation between these two participants already exists
    for ((id, conv) in conversations.entries()) {
      let parts = conv.participantIds;
      if (
        parts.size() == 2 and (
          (Principal.equal(parts[0], participantA) and Principal.equal(parts[1], participantB)) or
          (Principal.equal(parts[0], participantB) and Principal.equal(parts[1], participantA))
        )
      ) {
        return (id, nextId);
      };
    };
    // Create new conversation
    let newId = nextId;
    conversations.add(
      newId,
      {
        id = newId;
        var participantIds = [participantA, participantB];
        var lastMessage : ?Types.MessageInternal = null;
        var updatedAt = Time.now();
      },
    );
    (newId, nextId + 1);
  };

  public func getConversation(
    conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
    conversationId : Types.ConversationId,
  ) : ?Types.Conversation {
    switch (conversations.get(conversationId)) {
      case (?c) ?toPublicConversation(c);
      case null null;
    };
  };

  public func listConversations(
    conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
    profiles : Map.Map<Types.UserId, Types.UserProfileInternal>,
    userId : Types.UserId,
  ) : [Types.ConversationPreview] {
    let results = List.empty<Types.ConversationPreview>();
    for ((_, conv) in conversations.entries()) {
      if (conv.participantIds.any(func(pid : Types.UserId) : Bool { Principal.equal(pid, userId) })) {
        let names = conv.participantIds.map(
          func(pid) {
            switch (profiles.get(pid)) {
              case (?p) p.displayName;
              case null pid.toText();
            };
          }
        );
        let preview : Types.ConversationPreview = {
          id = conv.id;
          participantIds = conv.participantIds;
          participantNames = names;
          lastMessageText = switch (conv.lastMessage) {
            case (?m) ?m.text;
            case null null;
          };
          lastMessageTimestamp = switch (conv.lastMessage) {
            case (?m) ?m.timestamp;
            case null null;
          };
          updatedAt = conv.updatedAt;
        };
        results.add(preview);
      };
    };
    // Sort by updatedAt descending (most recent first)
    let sorted = results.sort(
      func(a, b) { Int.compare(b.updatedAt, a.updatedAt) }
    );
    sorted.toArray();
  };

  // ── Message helpers ───────────────────────────────────────────────────────

  public func sendMessage(
    messages : Map.Map<Types.ConversationId, List.List<Types.MessageInternal>>,
    conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
    nextId : Nat,
    conversationId : Types.ConversationId,
    senderId : Types.UserId,
    senderName : Text,
    text : Text,
  ) : (Types.Message, Nat) {
    let conv = switch (conversations.get(conversationId)) {
      case (?c) c;
      case null Runtime.trap("conversation not found");
    };
    // Verify sender is a participant
    if (not conv.participantIds.any(func(pid : Types.UserId) : Bool { Principal.equal(pid, senderId) })) {
      Runtime.trap("not a participant");
    };

    let now = Time.now();
    let msg : Types.MessageInternal = {
      id = nextId;
      conversationId = conversationId;
      senderId = senderId;
      senderName = senderName;
      text = text;
      timestamp = now;
    };

    // Append to message list
    let msgList = switch (messages.get(conversationId)) {
      case (?existing) existing;
      case null {
        let newList = List.empty<Types.MessageInternal>();
        messages.add(conversationId, newList);
        newList;
      };
    };
    msgList.add(msg);

    // Update conversation's last message and updatedAt
    conv.lastMessage := ?msg;
    conv.updatedAt := now;

    (toPublicMessage(msg), nextId + 1);
  };

  public func getMessages(
    messages : Map.Map<Types.ConversationId, List.List<Types.MessageInternal>>,
    conversations : Map.Map<Types.ConversationId, Types.ConversationInternal>,
    conversationId : Types.ConversationId,
    requesterId : Types.UserId,
  ) : [Types.Message] {
    let conv = switch (conversations.get(conversationId)) {
      case (?c) c;
      case null return [];
    };
    if (not conv.participantIds.any(func(pid : Types.UserId) : Bool { Principal.equal(pid, requesterId) })) {
      return [];
    };

    switch (messages.get(conversationId)) {
      case (?msgList) {
        msgList.map<Types.MessageInternal, Types.Message>(func(m) { toPublicMessage(m) }).toArray()
      };
      case null [];
    };
  };

  // ── Typing indicator helpers ──────────────────────────────────────────────
  // Uses a List to avoid tuple-key Map comparison issues

  public func setTypingIndicator(
    typingIndicators : List.List<Types.TypingIndicatorInternal>,
    conversationId : Types.ConversationId,
    userId : Types.UserId,
    isTyping : Bool,
  ) : () {
    let now = Time.now();
    switch (typingIndicators.find(func(t : Types.TypingIndicatorInternal) : Bool {
      t.conversationId == conversationId and Principal.equal(t.userId, userId)
    })) {
      case (?existing) {
        existing.isTyping := isTyping;
        existing.updatedAt := now;
      };
      case null {
        typingIndicators.add({
          conversationId = conversationId;
          userId = userId;
          var isTyping = isTyping;
          var updatedAt = now;
        });
      };
    };
  };

  public func getTypingUsers(
    typingIndicators : List.List<Types.TypingIndicatorInternal>,
    conversationId : Types.ConversationId,
    excludeUserId : Types.UserId,
  ) : [Types.UserId] {
    let results = List.empty<Types.UserId>();
    for (indicator in typingIndicators.values()) {
      if (
        indicator.conversationId == conversationId and
        indicator.isTyping and
        not Principal.equal(indicator.userId, excludeUserId)
      ) {
        results.add(indicator.userId);
      };
    };
    results.toArray();
  };
};
