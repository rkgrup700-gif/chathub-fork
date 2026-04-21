import Types "types/messaging";
import MessagingMixin "mixins/messaging-api";
import Map "mo:core/Map";
import List "mo:core/List";

actor {
  let profiles = Map.empty<Types.UserId, Types.UserProfileInternal>();
  let presences = Map.empty<Types.UserId, Types.UserPresenceInternal>();
  let conversations = Map.empty<Types.ConversationId, Types.ConversationInternal>();
  let messages = Map.empty<Types.ConversationId, List.List<Types.MessageInternal>>();
  let typingIndicators = List.empty<Types.TypingIndicatorInternal>();

  include MessagingMixin(
    profiles,
    presences,
    conversations,
    messages,
    typingIndicators,
  );
};
