import { u as useNavigate, r as reactExports, j as jsxRuntimeExports, c as cn, S as Skeleton, b as ue } from "./index-CW3Vuo4s.js";
import { c as createLucideIcon, g as AuthenticatedLayout, I as Input, A as Avatar, f as AvatarFallback, B as Button, M as MessageCircle } from "./input-B-s54t3O.js";
import { B as Badge } from "./badge-gr8zH9aY.js";
import { d as useAllUsers, a as useGetOrCreateConversation, P as PRESENCE_MAP } from "./useChat-C3Mk1l_O.js";
import { S as Search } from "./search-DTOHwgJ9.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14", key: "1bvyxn" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11", key: "1shjgl" }]
];
const UserPlus = createLucideIcon("user-plus", __iconNode);
function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}
const STATUS_LABEL = {
  online: "Online",
  away: "Away",
  offline: "Offline"
};
const STATUS_COLOR = {
  online: "bg-primary",
  away: "bg-amber-400",
  offline: "bg-muted-foreground/40"
};
function PeoplePage() {
  const navigate = useNavigate();
  const [search, setSearch] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const { data: users = [], isLoading } = useAllUsers();
  const getOrCreate = useGetOrCreateConversation();
  const filtered = users.filter((u) => {
    const presence = PRESENCE_MAP[u.id] ?? "offline";
    const matchesSearch = !search.trim() || u.displayName.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || presence === "online";
    return matchesSearch && matchesFilter;
  });
  async function handleMessage(userId) {
    try {
      const convId = await getOrCreate.mutateAsync(userId);
      navigate({
        to: "/chat/$conversationId",
        params: { conversationId: convId }
      });
    } catch {
      ue.error("Failed to open conversation");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuthenticatedLayout, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-xs", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "font-display font-bold text-xl", children: "People" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Discover and connect with others" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            placeholder: "Search people…",
            value: search,
            onChange: (e) => setSearch(e.target.value),
            className: "pl-8 bg-muted border-0 focus-visible:ring-0 h-9 w-56",
            "data-ocid": "people.search_input"
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-6 py-3 border-b border-border bg-background flex gap-1", children: ["all", "online"].map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setFilter(f),
        "data-ocid": `people.filter.${f}.tab`,
        className: cn(
          "px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-smooth",
          filter === f ? "bg-primary/10 text-primary border border-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
        ),
        children: f === "online" ? "Online now" : "All people"
      },
      f
    )) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto p-6 bg-background", children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        "data-ocid": "people.loading_state",
        children: ["a", "b", "c", "d", "e", "f", "g", "h"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "bg-card rounded-xl p-5 border border-border flex flex-col items-center gap-3",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "size-16 rounded-full" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-4 w-28" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-3 w-20" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-8 w-full rounded-lg" })
            ]
          },
          k
        ))
      }
    ) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center py-16 text-center",
        "data-ocid": "people.empty_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-14 rounded-full bg-muted flex items-center justify-center mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "size-6 text-muted-foreground" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium mb-1", children: "No people found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Try adjusting your search or filter" })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
        "data-ocid": "people.list",
        children: filtered.map((user, idx) => {
          const presence = PRESENCE_MAP[user.id] ?? "offline";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": `people.item.${idx + 1}`,
              className: "bg-card rounded-xl p-5 border border-border shadow-conversation flex flex-col items-center gap-3 hover:shadow-elevated transition-smooth",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "size-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-primary/15 text-primary font-bold text-lg", children: getInitials(user.displayName) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: cn(
                        "absolute bottom-0.5 right-0.5 size-3.5 rounded-full border-2 border-card",
                        STATUS_COLOR[presence]
                      )
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center min-w-0 w-full", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-semibold text-sm truncate", children: user.displayName }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                    "@",
                    user.username
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    variant: "secondary",
                    className: cn(
                      "text-xs font-medium",
                      presence === "online" && "bg-primary/10 text-primary border-primary/20",
                      presence === "away" && "bg-amber-50 text-amber-600 border-amber-200",
                      presence === "offline" && "bg-muted text-muted-foreground"
                    ),
                    children: STATUS_LABEL[presence]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  Button,
                  {
                    type: "button",
                    size: "sm",
                    className: "w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5",
                    onClick: () => handleMessage(user.id),
                    disabled: getOrCreate.isPending,
                    "data-ocid": `people.message.button.${idx + 1}`,
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "size-3.5" }),
                      "Message"
                    ]
                  }
                )
              ]
            },
            user.id
          );
        })
      }
    ) })
  ] }) });
}
export {
  PeoplePage as default
};
