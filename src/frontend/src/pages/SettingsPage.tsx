import { AuthenticatedLayout } from "@/components/Layout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/useAuth";
import { useMyProfile } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Bell,
  Check,
  ChevronRight,
  LogOut,
  Moon,
  Shield,
  Sun,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

function SettingRow({
  label,
  description,
  children,
  ocid,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  ocid?: string;
}) {
  return (
    <div
      className="flex items-center justify-between py-4 gap-4"
      data-ocid={ocid}
    >
      <div className="min-w-0">
        <p className="font-medium text-sm">{label}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
}: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-1 mt-6 first:mt-0">
      <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="size-3.5 text-primary" />
      </div>
      <h2 className="font-display font-semibold text-sm text-foreground">
        {title}
      </h2>
    </div>
  );
}

export default function SettingsPage() {
  const { logout } = useAuth();
  const { profile } = useMyProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? "");
  const [notifications, setNotifications] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    if (!displayName.trim()) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    setIsSaving(false);
    toast.success("Profile updated successfully");
  }

  const initials =
    (profile?.displayName ?? displayName)
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "ME";

  return (
    <AuthenticatedLayout>
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 shadow-xs">
          <h1 className="font-display font-bold text-xl">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your profile and preferences
          </p>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-2">
          {/* Profile card */}
          <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4 shadow-conversation mb-2">
            <div className="relative">
              <Avatar className="size-16">
                <AvatarFallback className="bg-primary/20 text-primary font-bold text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0.5 right-0.5 size-3.5 rounded-full bg-primary border-2 border-card" />
            </div>
            <div className="min-w-0">
              <p className="font-display font-bold text-base truncate">
                {profile?.displayName ?? "Your name"}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                @{profile?.username ?? "username"}
              </p>
              <p className="text-xs text-primary mt-0.5 font-medium">Online</p>
            </div>
          </div>

          {/* Profile settings */}
          <div
            className="bg-card rounded-xl border border-border px-5 py-4 shadow-conversation"
            data-ocid="settings.profile.section"
          >
            <SectionHeader icon={User} title="Profile" />
            <form onSubmit={handleSaveProfile}>
              <div className="flex flex-col gap-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="settings-display-name">Display name</Label>
                  <Input
                    id="settings-display-name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    data-ocid="settings.display_name.input"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="settings-username">Username</Label>
                  <Input
                    id="settings-username"
                    value={profile?.username ?? ""}
                    readOnly
                    className="bg-muted text-muted-foreground"
                    data-ocid="settings.username.input"
                  />
                  <p className="text-xs text-muted-foreground">
                    Username cannot be changed
                  </p>
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className="self-start bg-primary text-primary-foreground hover:bg-primary/90 gap-1.5"
                  disabled={isSaving || !displayName.trim()}
                  data-ocid="settings.save_profile.save_button"
                >
                  {isSaving ? (
                    "Saving…"
                  ) : (
                    <>
                      <Check className="size-3.5" />
                      Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* Notifications */}
          <div
            className="bg-card rounded-xl border border-border px-5 py-2 shadow-conversation"
            data-ocid="settings.notifications.section"
          >
            <SectionHeader icon={Bell} title="Notifications" />
            <Separator className="mb-1" />
            <SettingRow
              label="Push notifications"
              description="Get notified when you receive new messages"
              ocid="settings.push_notifications.switch"
            >
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-ocid="settings.push_notifications.toggle"
                aria-label="Push notifications"
              />
            </SettingRow>
            <Separator />
            <SettingRow
              label="Sound alerts"
              description="Play a sound when messages arrive"
              ocid="settings.sound_alerts.switch"
            >
              <Switch
                checked={soundAlerts}
                onCheckedChange={setSoundAlerts}
                data-ocid="settings.sound_alerts.toggle"
                aria-label="Sound alerts"
              />
            </SettingRow>
          </div>

          {/* Appearance */}
          <div
            className="bg-card rounded-xl border border-border px-5 py-2 shadow-conversation"
            data-ocid="settings.appearance.section"
          >
            <SectionHeader icon={darkMode ? Moon : Sun} title="Appearance" />
            <Separator className="mb-1" />
            <SettingRow
              label="Dark mode"
              description="Switch to a darker color scheme"
              ocid="settings.dark_mode.switch"
            >
              <Switch
                checked={darkMode}
                onCheckedChange={setDarkMode}
                data-ocid="settings.dark_mode.toggle"
                aria-label="Dark mode"
              />
            </SettingRow>
          </div>

          {/* Privacy */}
          <div
            className="bg-card rounded-xl border border-border px-5 py-2 shadow-conversation"
            data-ocid="settings.privacy.section"
          >
            <SectionHeader icon={Shield} title="Privacy & Security" />
            <Separator className="mb-1" />
            <button
              type="button"
              className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-smooth"
              data-ocid="settings.blocked_users.link"
            >
              <div>
                <p className="font-medium text-sm">Blocked users</p>
                <p className="text-xs text-muted-foreground">
                  Manage who you have blocked
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
            <Separator />
            <button
              type="button"
              className="w-full flex items-center justify-between py-4 text-left hover:text-primary transition-smooth"
              data-ocid="settings.data_privacy.link"
            >
              <div>
                <p className="font-medium text-sm">Data & privacy</p>
                <p className="text-xs text-muted-foreground">
                  Control your data and privacy settings
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Danger zone */}
          <div
            className="bg-card rounded-xl border border-destructive/20 px-5 py-4 mt-2"
            data-ocid="settings.danger.section"
          >
            <h2 className="font-display font-semibold text-sm text-destructive mb-3">
              Account
            </h2>
            <Button
              type="button"
              variant="outline"
              className="gap-2 border-destructive/40 text-destructive hover:bg-destructive/5 hover:text-destructive"
              onClick={() => logout()}
              data-ocid="settings.logout.delete_button"
            >
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
