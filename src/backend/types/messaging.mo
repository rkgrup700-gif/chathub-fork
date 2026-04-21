import Time "mo:core/Time";

module {
  public type UserId = Principal;
  public type ConversationId = Nat;
  public type MessageId = Nat;
  public type Timestamp = Time.Time;

  public type UserProfile = {
    id : UserId;
    username : Text;
    displayName : Text;
    avatarUrl : ?Text;
  };

  public type PresenceStatus = {
    #online;
    #offline;
  };

  public type UserPresence = {
    userId : UserId;
    status : PresenceStatus;
    lastSeen : Timestamp;
  };

  public type Message = {
    id : MessageId;
    conversationId : ConversationId;
    senderId : UserId;
    senderName : Text;
    text : Text;
    timestamp : Timestamp;
  };

  public type Conversation = {
    id : ConversationId;
    participantIds : [UserId];
    lastMessage : ?Message;
    updatedAt : Timestamp;
  };

  public type ConversationPreview = {
    id : ConversationId;
    participantIds : [UserId];
    participantNames : [Text];
    lastMessageText : ?Text;
    lastMessageTimestamp : ?Timestamp;
    updatedAt : Timestamp;
  };

  public type TypingIndicator = {
    conversationId : ConversationId;
    userId : UserId;
    isTyping : Bool;
    updatedAt : Timestamp;
  };

  // Internal types with mutable fields
  public type UserProfileInternal = {
    id : UserId;
    var username : Text;
    var displayName : Text;
    var avatarUrl : ?Text;
  };

  public type UserPresenceInternal = {
    userId : UserId;
    var status : PresenceStatus;
    var lastSeen : Timestamp;
  };

  public type MessageInternal = {
    id : MessageId;
    conversationId : ConversationId;
    senderId : UserId;
    senderName : Text;
    text : Text;
    timestamp : Timestamp;
  };

  public type ConversationInternal = {
    id : ConversationId;
    var participantIds : [UserId];
    var lastMessage : ?MessageInternal;
    var updatedAt : Timestamp;
  };

  public type TypingIndicatorInternal = {
    conversationId : ConversationId;
    userId : UserId;
    var isTyping : Bool;
    var updatedAt : Timestamp;
  };
};
