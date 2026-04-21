import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { LogOut, Menu, MessageCircle, Settings, Users, X } from "lucide-react";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { to: "/chat", icon: MessageCircle, label: "Messages", badge: 2 },
  { to: "/people", icon: Users, label: "People" },
  { to: "/settings", icon: Settings, label: "Settings" },
];

function PresenceDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 size-2.5 rounded-full bg-primary border-2 border-card",
        className,
      )}
    />
  );
}

export function AuthenticatedLayout({ children }: LayoutProps) {
  const location = useLocation();
  const { logout } = useAuth();
  const { profile } = useMyProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials = profile?.displayName
    ? profile.displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ME";

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 md:hidden cursor-default"
          onClick={() => setMobileOpen(false)}
          onKeyDown={(e) => e.key === "Escape" && setMobileOpen(false)}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-16 bg-card border-r border-border flex flex-col items-center py-4 gap-2 transition-smooth",
          "md:relative md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        {/* Logo */}
        <Link to="/chat" className="mb-4 flex items-center justify-center">
          <div className="size-9 rounded-xl bg-primary flex items-center justify-center shadow-elevated">
            <MessageCircle
              className="size-5 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
        </Link>

        {/* Nav items */}
        <nav
          className="flex flex-col gap-1 flex-1 w-full px-2"
          data-ocid="main.nav"
        >
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase()}.link`}
                className={cn(
                  "relative flex items-center justify-center size-12 mx-auto rounded-xl transition-smooth group",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
                title={label}
              >
                <Icon className="size-5" />
                {badge ? (
                  <span className="absolute top-1.5 right-1.5 size-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badge}
                  </span>
                ) : null}
                <span className="sr-only">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: avatar + logout */}
        <div className="flex flex-col items-center gap-2 px-2 mt-auto">
          <button
            type="button"
            onClick={() => logout()}
            data-ocid="nav.logout_button"
            className="flex items-center justify-center size-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth"
            title="Log out"
            aria-label="Log out"
          >
            <LogOut className="size-5" />
          </button>

          <div className="relative">
            <Avatar className="size-9 ring-2 ring-primary/30">
              <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <PresenceDot />
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <button
        type="button"
        className="md:hidden fixed top-4 left-4 z-[60] size-9 rounded-lg bg-card border border-border flex items-center justify-center shadow-conversation"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>

      {/* Content */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}

export function PublicLayout({ children }: LayoutProps) {
  const { login } = useAuth();
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-xs">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="header.logo.link"
        >
          <div className="size-8 rounded-lg bg-primary flex items-center justify-center shadow-message">
            <MessageCircle
              className="size-4 text-primary-foreground"
              strokeWidth={2.5}
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-foreground">
            Chat<span className="text-primary">Hub</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            data-ocid="header.signin.link"
            onClick={() => login()}
          >
            Sign in
          </Button>
          <Button
            size="sm"
            data-ocid="header.signup.link"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => login()}
          >
            Get started
          </Button>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-card border-t border-border py-5 px-6 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined"
                ? window.location.hostname
                : "chathub.com",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }
  return <PublicLayout>{children}</PublicLayout>;
}
