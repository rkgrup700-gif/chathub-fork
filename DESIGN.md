# Design Brief

## Direction

ChatHub — Modern social messaging platform with clean, energetic cyan-accented interface inspired by Instagram, Facebook, and Twitter.

## Tone

Fresh and contemporary, leaning toward clarity and approachability with purposeful cyan accents for actions and presence indicators.

## Differentiation

Distinctive messaging bubble hierarchy combined with always-visible online presence indicators in the conversation sidebar, creating immediate social awareness.

## Color Palette

| Token      | OKLCH              | Role                          |
| ---------- | ------------------ | ----------------------------- |
| background | 0.99 0.005 260     | Clean light backdrop          |
| foreground | 0.15 0.01 260      | Strong text contrast          |
| card       | 1.0 0.0 0          | Floating messages & cards     |
| primary    | 0.5 0.22 190       | CTA buttons, message sent     |
| accent     | 0.75 0.15 190      | Online indicators, highlights |
| muted      | 0.95 0.01 260      | Secondary text, metadata      |
| destructive| 0.55 0.22 25       | Error states, leave actions   |

## Typography

- Display: Space Grotesk — bold headings, branding, dialog titles
- Body: DM Sans — conversation list, message text, UI labels
- Scale: hero 3xl bold, h2 2xl bold, label sm semibold, body base

## Elevation & Depth

Three-tier surface hierarchy: card-based elevated message bubbles with conversation shadows, subtle border dividers between sections.

## Structural Zones

| Zone         | Background        | Border         | Notes                                    |
| ------------ | ----------------- | -------------- | ---------------------------------------- |
| Header       | bg-card           | border-b       | App title, user menu                     |
| Sidebar      | bg-sidebar        | border-r       | Conversation list, search                |
| Main Content | bg-background     | —              | Active chat, message history             |
| Input Area   | bg-card           | border-t       | Message field, send button, attachments  |

## Spacing & Rhythm

Balanced 24px section gaps with 12px internal grouping. Conversation items padded 12px, message bubbles with 8px internal margin. Online indicator positioned top-right corner of avatars.

## Component Patterns

- Buttons: rounded-lg (12px), primary cyan on white, inverse on dark, hover lift with elevated shadow
- Cards: bg-card rounded-lg, subtle border, shadow-conversation on hover
- Avatars: 40px circles with 4px border, online dot positioned absolute top-right
- Message Bubbles: received (bg-secondary, rounded-3xl left), sent (bg-primary, rounded-3xl right), both with shadow-message
- Badges: inline online status as small filled circle next to names

## Motion

- Entrance: fade-in 150ms for messages and conversations on load
- Hover: shadow elevation and border color shift on cards/messages, 200ms smooth transition
- Active: smooth transition on state changes, send button flash on message submission

## Constraints

- No animations on every interaction — only on meaningful state changes
- Maintain cyan accent sparsely to avoid visual noise
- Keep sidebar max-width 320px for desktop layouts
- Message timestamps always visible on hover/focus, never hidden

## Signature Detail

Cyan presence dots persistently visible on conversation avatars — instant visual confirmation of who's online without additional clicks.


