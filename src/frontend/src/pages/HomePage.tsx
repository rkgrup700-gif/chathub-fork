import { PublicLayout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useAuth";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Globe,
  MessageCircle,
  Search,
  Send,
  Shield,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant messaging",
    desc: "Real-time chat that feels like talking face-to-face. Zero delay.",
    badge: "Fast",
  },
  {
    icon: Globe,
    title: "Meet new people",
    desc: "Discover and connect with strangers from around the world instantly.",
    badge: "Social",
  },
  {
    icon: Shield,
    title: "Private & secure",
    desc: "Your conversations stay between you and the people you choose to chat with.",
    badge: "Safe",
  },
];

const TESTIMONIALS = [
  {
    name: "Samantha Reed",
    handle: "@samantha_r",
    text: "ChatHub changed how I connect with people online. The interface is so clean and modern!",
    avatar: "SR",
    time: "2h ago",
  },
  {
    name: "Alex Thompson",
    handle: "@alex_t",
    text: "Super clean interface. I use it every day to chat with new friends from around the world.",
    avatar: "AT",
    time: "5h ago",
  },
  {
    name: "Jordan Myles",
    handle: "@jordan_m",
    text: "Finally a messaging app that doesn't feel outdated. Love the social features!",
    avatar: "JM",
    time: "1d ago",
  },
];

const MOCK_CONVERSATIONS = [
  {
    name: "Samantha R.",
    msg: "Hey! How are you doing today?",
    time: "2m",
    online: true,
    avatar: "SR",
  },
  {
    name: "Alex T.",
    msg: "Did you see the latest news?",
    time: "10m",
    online: true,
    avatar: "AT",
  },
  {
    name: "Jordan M.",
    msg: "Let's catch up soon!",
    time: "1h",
    online: false,
    avatar: "JM",
  },
  {
    name: "Casey L.",
    msg: "Thanks for the recommendation",
    time: "3h",
    online: true,
    avatar: "CL",
  },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"
      />
    </svg>
  );
}

function ChatMockup() {
  return (
    <div className="relative w-full max-w-sm mx-auto lg:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-card border-b border-border">
        <div className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-yellow-400/70" />
          <span className="size-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="flex items-center gap-2 mx-auto">
          <div className="size-6 rounded-md bg-primary flex items-center justify-center">
            <MessageCircle
              className="size-3.5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-display font-bold text-sm">
            Chat<span className="text-primary">Hub</span>
          </span>
        </div>
      </div>

      {/* Body: sidebar + chat */}
      <div className="flex h-72">
        {/* Sidebar */}
        <div className="w-36 border-r border-border bg-muted/30 flex flex-col">
          <div className="px-2 py-2">
            <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-muted/50">
              <Search className="size-3 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Search…</span>
            </div>
          </div>
          <div className="flex flex-col gap-0.5 px-1 overflow-hidden">
            {MOCK_CONVERSATIONS.map((c, i) => (
              <div
                key={c.name}
                className={`flex items-center gap-2 px-1.5 py-1.5 rounded-lg cursor-pointer ${i === 0 ? "bg-primary/10" : "hover:bg-muted/50"}`}
              >
                <div className="relative shrink-0">
                  <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[9px] font-bold text-primary">
                    {c.avatar}
                  </div>
                  {c.online && (
                    <span className="absolute bottom-0 right-0 size-1.5 rounded-full bg-primary border border-card" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold truncate">{c.name}</p>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {c.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Chat header */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border">
            <div className="relative">
              <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                SR
              </div>
              <span className="absolute bottom-0 right-0 size-1.5 rounded-full bg-primary border border-card" />
            </div>
            <div>
              <p className="text-[11px] font-semibold">Samantha Reed</p>
              <p className="text-[9px] text-primary">● Online</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 flex flex-col gap-2 px-3 py-2 overflow-hidden">
            <div className="self-start max-w-[75%] bg-muted rounded-xl rounded-tl-sm px-2.5 py-1.5">
              <p className="text-[10px]">Hey! How are you doing? 👋</p>
            </div>
            <div className="self-end max-w-[75%] bg-primary rounded-xl rounded-tr-sm px-2.5 py-1.5">
              <p className="text-[10px] text-primary-foreground">
                I'm great! Just discovered ChatHub 😊
              </p>
            </div>
            <div className="self-start max-w-[75%] bg-muted rounded-xl rounded-tl-sm px-2.5 py-1.5">
              <p className="text-[10px]">
                It's amazing right? Love the interface!
              </p>
            </div>
            <div className="self-end max-w-[75%] bg-primary rounded-xl rounded-tr-sm px-2.5 py-1.5">
              <p className="text-[10px] text-primary-foreground">
                Totally! Already met so many people 🌍
              </p>
            </div>
          </div>

          {/* Input */}
          <div className="flex items-center gap-1.5 px-2 py-2 border-t border-border">
            <div className="flex-1 bg-muted rounded-full px-3 py-1.5 text-[10px] text-muted-foreground">
              Type a message…
            </div>
            <div className="size-6 rounded-full bg-primary flex items-center justify-center">
              <Send className="size-3 text-primary-foreground" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OnboardingDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const { register, isRegistering } = useMyProfile();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim() || !username.trim()) return;
    try {
      await register({
        displayName: displayName.trim(),
        username: username.trim(),
      });
      toast.success("Welcome to ChatHub! 🎉");
      onClose();
      navigate({ to: "/chat" });
    } catch {
      toast.error("Failed to set up profile. Please try again.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md" data-ocid="onboarding.dialog">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Set up your profile
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="displayName">Display name</Label>
            <Input
              id="displayName"
              data-ocid="onboarding.display_name.input"
              placeholder="e.g. Samantha Reed"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              data-ocid="onboarding.username.input"
              placeholder="e.g. samantha_reed"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value.toLowerCase().replace(/\s+/g, "_"))
              }
              required
            />
          </div>
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              data-ocid="onboarding.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={
                isRegistering || !displayName.trim() || !username.trim()
              }
              data-ocid="onboarding.submit_button"
            >
              {isRegistering ? "Setting up…" : "Start chatting"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function HomePage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const { profile } = useMyProfile();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);

  async function handleLogin() {
    if (isAuthenticated) {
      if (profile) {
        navigate({ to: "/chat" });
      } else {
        setShowOnboarding(true);
      }
      return;
    }
    await login();
    if (!profile) {
      setShowOnboarding(true);
    } else {
      navigate({ to: "/chat" });
    }
  }

  if (isAuthenticated && profile) {
    navigate({ to: "/chat" });
    return null;
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section
        className="relative flex flex-col lg:flex-row items-center justify-between gap-12 px-6 md:px-12 py-20 md:py-28 bg-background overflow-hidden min-h-[90vh]"
        data-ocid="hero.section"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          aria-hidden
        >
          <img
            src="/assets/generated/hero-chathub.dim_1200x600.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute -top-40 -right-40 size-[500px] rounded-full bg-primary/6 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-[400px] rounded-full bg-primary/4 blur-3xl" />
        </div>

        {/* Left column */}
        <div className="relative flex flex-col gap-7 max-w-xl flex-1">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium w-fit">
            <span className="size-1.5 rounded-full bg-primary animate-pulse" />
            Real-time messaging — always online
          </div>

          <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-foreground">
            Connect with <span className="text-primary">anyone,</span>
            <br />
            anywhere.
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
            ChatHub is the modern social messaging platform where conversations
            come alive. Meet new people, build connections, and stay in touch —
            all in real time.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {["SR", "AT", "JM", "CL", "MR"].map((init) => (
                <div
                  key={init}
                  className="size-8 rounded-full border-2 border-background bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary"
                >
                  {init}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">10,000+</span>{" "}
              people chatting right now
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              variant="outline"
              className="gap-3 font-semibold h-12 px-6 border-border bg-card hover:bg-muted transition-smooth shadow-conversation"
              onClick={handleLogin}
              disabled={isLoading}
              data-ocid="hero.google_signin.primary_button"
            >
              <GoogleIcon />
              {isLoading ? "Signing in…" : "Sign in with Google"}
            </Button>
            <Button
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-conversation h-12 px-6 font-semibold gap-2 transition-smooth"
              onClick={handleLogin}
              disabled={isLoading}
              data-ocid="hero.signin.primary_button"
            >
              {isLoading ? "Loading…" : "Get started free"}
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            {["Free forever", "No credit card", "Instant access"].map(
              (item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <Check className="size-3.5 text-primary" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>

        {/* Right column — chat mockup */}
        <div className="relative flex-1 w-full max-w-sm lg:max-w-md">
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-xl" />
          <ChatMockup />
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-card border-y border-border py-6 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-3 divide-x divide-border">
          {[
            { val: "10K+", label: "Active users" },
            { val: "1M+", label: "Messages sent" },
            { val: "99.9%", label: "Uptime" },
          ].map(({ val, label }) => (
            <div key={label} className="flex flex-col items-center gap-1 px-6">
              <span className="font-display font-bold text-2xl text-primary">
                {val}
              </span>
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <section
        id="features"
        className="bg-muted/30 border-b border-border py-20 px-6"
        data-ocid="features.section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 mb-4"
            >
              Why ChatHub?
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Everything you need to connect
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Simple, fast, and social — ChatHub makes staying connected
              effortless.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, badge }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-6 shadow-conversation border border-border flex flex-col gap-4 hover:border-primary/30 transition-smooth group"
              >
                <div className="flex items-start justify-between">
                  <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-smooth">
                    <Icon className="size-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {badge}
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-lg">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        className="bg-background py-20 px-6"
        data-ocid="howitworks.section"
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="border-primary/30 text-primary bg-primary/5 mb-4"
            >
              Simple as 1-2-3
            </Badge>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Start chatting in seconds
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Users,
                title: "Create your account",
                desc: "Sign up with one click using your Google account. No forms, no hassle.",
              },
              {
                step: "02",
                icon: Search,
                title: "Find people to chat",
                desc: "Search for users by name or username, or discover people in your area.",
              },
              {
                step: "03",
                icon: MessageCircle,
                title: "Start the conversation",
                desc: "Send your first message and build real connections with people worldwide.",
              },
            ].map(({ step, icon: Icon, title, desc }) => (
              <div
                key={step}
                className="flex flex-col gap-4 items-center text-center"
              >
                <div className="relative">
                  <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="size-7 text-primary" />
                  </div>
                  <span className="absolute -top-2 -right-2 size-6 rounded-full bg-primary text-primary-foreground text-[11px] font-bold flex items-center justify-center">
                    {step.slice(1)}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-lg">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section
        className="bg-muted/30 border-y border-border py-20 px-6"
        data-ocid="testimonials.section"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              Loved by chatters everywhere
            </h2>
            <p className="text-muted-foreground">
              See what people are saying about ChatHub
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {TESTIMONIALS.map(({ name, handle, text, avatar, time }) => (
              <div
                key={name}
                className="bg-card rounded-2xl p-5 border border-border shadow-conversation flex flex-col gap-3 hover:border-primary/20 transition-smooth"
              >
                <p className="text-sm text-foreground leading-relaxed">
                  "{text}"
                </p>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                        {avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-xs font-semibold">{name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {handle}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-background py-20 px-6" data-ocid="cta.section">
        <div className="max-w-2xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-card p-10 text-center flex flex-col items-center gap-6 shadow-conversation">
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-64 rounded-full bg-primary/8 blur-3xl" />
            </div>
            <div className="relative size-16 rounded-2xl bg-primary flex items-center justify-center shadow-conversation">
              <MessageCircle className="size-8 text-primary-foreground" />
            </div>
            <div className="relative">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-3">
                Ready to start chatting?
              </h2>
              <p className="text-muted-foreground">
                Join thousands of people already connecting on ChatHub. It's
                free, fast, and fun.
              </p>
            </div>
            <div className="relative flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                variant="outline"
                className="gap-3 font-semibold h-12 px-6 border-border bg-background hover:bg-muted transition-smooth"
                onClick={handleLogin}
                disabled={isLoading}
                data-ocid="cta.google_signin.button"
              >
                <GoogleIcon />
                {isLoading ? "Signing in…" : "Sign in with Google"}
              </Button>
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-conversation h-12 px-8 font-semibold gap-2 transition-smooth"
                onClick={handleLogin}
                disabled={isLoading}
                data-ocid="cta.signin.primary_button"
              >
                {isLoading ? "Loading…" : "Get started free"}
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <OnboardingDialog
        open={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </PublicLayout>
  );
}
