import { u as useNavigate, d as useParams, r as reactExports, j as jsxRuntimeExports, b as ue, S as Skeleton, c as cn } from "./index-CW3Vuo4s.js";
import { c as createLucideIcon, d as useAuth, g as AuthenticatedLayout, B as Button, I as Input, M as MessageCircle, A as Avatar, f as AvatarFallback } from "./input-B-s54t3O.js";
import { u as useConversations, a as useGetOrCreateConversation, b as useMessages, c as useSendMessage, P as PRESENCE_MAP, d as useAllUsers } from "./useChat-C3Mk1l_O.js";
import { S as Search } from "./search-DTOHwgJ9.js";
import { S as Send } from "./send-ChjlWEy9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$5 = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode$5);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2", key: "1m3agn" }],
  ["circle", { cx: "9", cy: "9", r: "2", key: "af1f0g" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21", key: "1xmnt7" }]
];
const Image = createLucideIcon("image", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2", key: "1y1vjs" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9", key: "yxxnd0" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9", key: "1p4y9e" }]
];
const Smile = createLucideIcon("smile", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",
      key: "ftymec"
    }
  ],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2", key: "158x01" }]
];
const Video = createLucideIcon("video", __iconNode);
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
function formatTimestamp(ts) {
  if (!ts) return "";
  const ms = typeof ts === "bigint" ? Number(ts) : ts;
  const now = Date.now();
  const diff = now - ms;
  if (diff < 6e4) return "now";
  if (diff < 36e5) return `${Math.floor(diff / 6e4)}m ago`;
  if (diff < 864e5) return `${Math.floor(diff / 36e5)}h ago`;
  return new Date(ms).toLocaleDateString();
}
const PRESENCE_LABEL = {
  online: "Online",
  away: "Away",
  offline: "Offline"
};
function PresenceDot({
  status,
  className
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: cn(
        "absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-card",
        status === "online" && "bg-primary",
        status === "away" && "bg-amber-400",
        status === "offline" && "bg-muted-foreground/40",
        className
      )
    }
  );
}
function TypingIndicator({ name }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2 animate-message-in", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-7 shrink-0 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-muted text-muted-foreground text-xs", children: getInitials(name) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-bl-sm bg-card border border-border shadow-message", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot bg-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot bg-muted-foreground/60" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "typing-dot bg-muted-foreground/60" })
    ] })
  ] });
}
function ConversationItem({
  conv,
  myId,
  isActive,
  onClick,
  index
}) {
  const otherId = conv.participantIds.find((id) => id !== myId) ?? conv.participantIds[0];
  const otherName = conv.participantNames[conv.participantIds.indexOf(otherId)] ?? "Unknown";
  const presence = PRESENCE_MAP[otherId] ?? "offline";
  const initials = getInitials(otherName);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      "data-ocid": `conversations.item.${index + 1}`,
      className: cn(
        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-smooth group",
        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/60 border border-transparent"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            AvatarFallback,
            {
              className: cn(
                "text-sm font-semibold",
                isActive ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              ),
              children: initials
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: presence })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-sm truncate", children: otherName }),
            conv.lastMessageTimestamp && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] text-muted-foreground shrink-0", children: formatTimestamp(conv.lastMessageTimestamp) })
          ] }),
          conv.lastMessageText && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate mt-0.5", children: conv.lastMessageText })
        ] })
      ]
    }
  );
}
function MessageBubble({
  msg,
  isMine,
  showName
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex gap-2 items-end animate-message-in",
        isMine && "flex-row-reverse"
      ),
      children: [
        !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-7 shrink-0 mb-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-muted text-muted-foreground text-xs", children: getInitials(msg.senderName) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: cn(
              "flex flex-col gap-0.5 max-w-[70%]",
              isMine && "items-end"
            ),
            children: [
              showName && !isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground px-1", children: msg.senderName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-message",
                    isMine ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-card border border-border text-foreground rounded-bl-sm"
                  ),
                  children: msg.text
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground px-1", children: formatTimestamp(msg.timestamp) })
            ]
          }
        )
      ]
    }
  );
}
function NewChatPanel({
  onSelect,
  onClose
}) {
  const [term, setTerm] = reactExports.useState("");
  const { data: users = [] } = useAllUsers();
  const filtered = users.filter(
    (u) => !term.trim() || u.displayName.toLowerCase().includes(term.toLowerCase()) || u.username.toLowerCase().includes(term.toLowerCase())
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "absolute inset-0 bg-card z-20 flex flex-col rounded-xl border border-border shadow-elevated",
      "data-ocid": "new_chat.panel",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display font-semibold text-sm", children: "New conversation" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "sm",
              onClick: onClose,
              "data-ocid": "new_chat.close_button",
              children: "Close"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-3 py-2 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "Search people…",
              value: term,
              onChange: (e) => setTerm(e.target.value),
              className: "pl-8 bg-muted border-0 focus-visible:ring-0",
              "data-ocid": "new_chat.search_input",
              autoFocus: true
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2 flex flex-col gap-0.5", children: [
          filtered.map((u) => {
            const presence = PRESENCE_MAP[u.id] ?? "offline";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                onClick: () => onSelect(u.id),
                className: "flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/60 transition-smooth text-left",
                "data-ocid": "new_chat.user.item",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative shrink-0", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-muted text-muted-foreground text-xs font-semibold", children: getInitials(u.displayName) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: presence })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: u.displayName }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate flex items-center gap-1.5", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: cn(
                            "size-1.5 rounded-full inline-block",
                            presence === "online" && "bg-primary",
                            presence === "away" && "bg-amber-400",
                            presence === "offline" && "bg-muted-foreground/40"
                          )
                        }
                      ),
                      PRESENCE_LABEL[presence],
                      " · @",
                      u.username
                    ] })
                  ] })
                ]
              },
              u.id
            );
          }),
          filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "text-center text-muted-foreground text-sm py-8",
              "data-ocid": "new_chat.empty_state",
              children: "No users found"
            }
          )
        ] })
      ]
    }
  );
}
function ConversationSidebar({
  myId,
  activeId,
  showNewChat,
  setShowNewChat,
  onSelectConversation,
  onStartChat
}) {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const { data: conversations = [], isLoading: convsLoading } = useConversations();
  const filteredConvs = conversations.filter((c) => {
    if (!searchTerm.trim()) return true;
    const idx = c.participantIds.findIndex((id) => id !== myId);
    const name = c.participantNames[idx] ?? "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "w-72 shrink-0 border-r border-border bg-card flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pt-5 pb-3 border-b border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-lg", children: "Messages" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            size: "icon",
            variant: "ghost",
            className: "size-8 hover:bg-primary/10 hover:text-primary",
            onClick: () => setShowNewChat(true),
            "data-ocid": "conversations.new_chat.open_modal_button",
            "aria-label": "New conversation",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search chats…",
            value: searchTerm,
            onChange: (e) => setSearchTerm(e.target.value),
            className: "pl-8 bg-muted border-0 focus-visible:ring-0 text-sm h-9",
            "data-ocid": "conversations.search_input"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto p-2 relative flex flex-col gap-0.5", children: [
      showNewChat && /* @__PURE__ */ jsxRuntimeExports.jsx(
        NewChatPanel,
        {
          onSelect: onStartChat,
          onClose: () => setShowNewChat(false)
        }
      ),
      convsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2", children: "Active conversations" }),
        ["s1", "s2", "s3", "s4", "s5"].map((sid) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-3 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-10 rounded-full" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3.5 w-24" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-36" })
          ] })
        ] }, sid))
      ] }) : filteredConvs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col items-center justify-center py-12 px-4 text-center",
          "data-ocid": "conversations.empty_state",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-muted flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-5 text-muted-foreground" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm mb-1", children: "No conversations yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mb-3", children: "Start chatting by tapping the + button" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                type: "button",
                size: "sm",
                className: "bg-primary text-primary-foreground hover:bg-primary/90",
                onClick: () => setShowNewChat(true),
                "data-ocid": "conversations.start_chat.primary_button",
                children: "Start a chat"
              }
            )
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2", children: "Active conversations" }),
        filteredConvs.map((conv, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ConversationItem,
          {
            conv,
            myId,
            isActive: conv.id === activeId,
            onClick: () => onSelectConversation(conv.id),
            index: i
          },
          conv.id
        ))
      ] })
    ] })
  ] });
}
function ChatArea({
  activeConv,
  myId,
  onNewChat
}) {
  const [messageText, setMessageText] = reactExports.useState("");
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const messagesEndRef = reactExports.useRef(null);
  const typingTimerRef = reactExports.useRef(null);
  const { data: messages = [], isLoading: msgsLoading } = useMessages(
    (activeConv == null ? void 0 : activeConv.id) ?? null
  );
  const sendMessage = useSendMessage();
  const otherId = activeConv ? activeConv.participantIds.find((id) => id !== myId) ?? "" : "";
  const otherName = activeConv ? activeConv.participantNames[activeConv.participantIds.indexOf(otherId)] ?? "Unknown" : "";
  const otherPresence = PRESENCE_MAP[otherId] ?? "offline";
  reactExports.useEffect(() => {
    var _a;
    if (messages.length > 0) {
      (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const lastMsg = messages[messages.length - 1];
  reactExports.useEffect(() => {
    if (!lastMsg) return;
    if (lastMsg.senderId === myId && otherPresence === "online") {
      setIsTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setIsTyping(false), 3e3);
    }
  }, [lastMsg, myId, otherPresence]);
  async function handleSend(e) {
    e == null ? void 0 : e.preventDefault();
    if (!messageText.trim() || !activeConv) return;
    const text = messageText.trim();
    setMessageText("");
    try {
      await sendMessage.mutateAsync({
        conversationId: activeConv.id,
        text
      });
    } catch {
      ue.error("Failed to send message");
    }
  }
  if (!activeConv) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 flex flex-col items-center justify-center bg-background text-center px-6",
        "data-ocid": "chat.no_selection.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-8 text-primary" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-xl mb-2", children: "Your messages" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-sm max-w-xs mb-5", children: "Select a conversation from the left, or start a new chat with someone new." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              type: "button",
              className: "bg-primary text-primary-foreground hover:bg-primary/90 gap-2",
              onClick: onNewChat,
              "data-ocid": "chat.new_chat.primary_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
                "New conversation"
              ]
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col min-w-0 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-center justify-between px-5 py-3.5 bg-card border-b border-border shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-9", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary text-sm font-semibold", children: getInitials(otherName) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(PresenceDot, { status: otherPresence })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm", children: otherName }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "p",
            {
              className: cn(
                "text-xs flex items-center gap-1",
                otherPresence === "online" ? "text-primary" : "text-muted-foreground"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: cn(
                      "size-1.5 rounded-full",
                      otherPresence === "online" && "bg-primary",
                      otherPresence === "away" && "bg-amber-400",
                      otherPresence === "offline" && "bg-muted-foreground/40"
                    )
                  }
                ),
                PRESENCE_LABEL[otherPresence]
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "size-8 text-muted-foreground hover:text-foreground",
            "aria-label": "Voice call",
            "data-ocid": "chat.header.call_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "size-8 text-muted-foreground hover:text-foreground",
            "aria-label": "Video call",
            "data-ocid": "chat.header.video_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "size-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            type: "button",
            variant: "ghost",
            size: "icon",
            className: "size-8 text-muted-foreground hover:text-foreground",
            "aria-label": "More options",
            "data-ocid": "chat.header.more_button",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "size-4" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3",
        "data-ocid": "chat.messages.list",
        children: [
          msgsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              "data-ocid": "chat.messages.loading_state",
              className: "flex flex-col gap-3",
              children: ["m1", "m2", "m3", "m4"].map((mid, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: cn("flex gap-2", i % 2 === 1 && "flex-row-reverse"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-7 rounded-full shrink-0" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Skeleton,
                      {
                        className: cn(
                          "h-10 rounded-2xl",
                          i % 2 === 1 ? "w-40" : "w-56"
                        )
                      }
                    )
                  ]
                },
                mid
              ))
            }
          ) : messages.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex-1 flex flex-col items-center justify-center text-center py-12",
              "data-ocid": "chat.messages.empty_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-full bg-primary/10 flex items-center justify-center mb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-5 text-primary" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm", children: "Say hello! 👋" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-1", children: [
                  "Start the conversation with ",
                  otherName
                ] })
              ]
            }
          ) : messages.map((msg, i) => {
            const isMine = msg.senderId === myId;
            const prevMsg = messages[i - 1];
            const showName = !isMine && (!prevMsg || prevMsg.senderId !== msg.senderId);
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              MessageBubble,
              {
                msg,
                isMine,
                showName
              },
              msg.id
            );
          }),
          isTyping && /* @__PURE__ */ jsxRuntimeExports.jsx(TypingIndicator, { name: otherName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSend,
        className: "flex items-center gap-2 px-4 py-3.5 bg-card border-t border-border",
        "data-ocid": "chat.input.form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "size-9 text-muted-foreground shrink-0 hover:text-primary",
              "aria-label": "Attach image",
              "data-ocid": "chat.attach.upload_button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Image, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              value: messageText,
              onChange: (e) => setMessageText(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              },
              placeholder: "Type a message…",
              className: "flex-1 bg-muted border-0 focus-visible:ring-0 rounded-full px-4",
              "data-ocid": "chat.message.input"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "button",
              variant: "ghost",
              size: "icon",
              className: "size-9 text-muted-foreground shrink-0 hover:text-primary",
              "aria-label": "Emoji",
              "data-ocid": "chat.emoji.button",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Smile, { className: "size-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              size: "icon",
              className: "size-9 bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 rounded-full shadow-message",
              disabled: !messageText.trim() || sendMessage.isPending,
              "data-ocid": "chat.send.primary_button",
              "aria-label": "Send message",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" })
            }
          )
        ]
      }
    )
  ] });
}
function ChatPage() {
  const { principalId } = useAuth();
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const activeId = params.conversationId ?? null;
  const [showNewChat, setShowNewChat] = reactExports.useState(false);
  const { data: conversations = [] } = useConversations();
  const getOrCreate = useGetOrCreateConversation();
  const activeConv = conversations.find((c) => c.id === activeId) ?? null;
  const myId = principalId ?? "";
  async function handleNewChat(userId) {
    try {
      const convId = await getOrCreate.mutateAsync(userId);
      setShowNewChat(false);
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: convId }
      });
    } catch {
      ue.error("Failed to start conversation");
    }
  }
  if (!principalId) {
    navigate({ to: "/" });
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 min-h-0 h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ConversationSidebar,
      {
        myId,
        activeId,
        showNewChat,
        setShowNewChat,
        onSelectConversation: (id) => navigate({
          to: "/chat/$conversationId",
          params: { conversationId: id }
        }),
        onStartChat: handleNewChat
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      ChatArea,
      {
        activeConv,
        myId,
        onNewChat: () => setShowNewChat(true)
      }
    )
  ] }) });
}
export {
  ChatPage as default
};
