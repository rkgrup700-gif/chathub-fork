import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RegisterParams, UserProfile } from "../types/chat";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity != null;
  const isLoading =
    loginStatus === "initializing" || loginStatus === "logging-in";

  return {
    identity,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
    principalId: identity?.getPrincipal().toText(),
  };
}

// Mock profile store for demo purposes (real data flows through backend actor)
const PROFILE_STORAGE_KEY = "chathub_profile";

function getStoredProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

function storeProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function useMyProfile() {
  const { isAuthenticated, principalId } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery<UserProfile | null>({
    queryKey: ["myProfile", principalId],
    queryFn: async () => {
      if (!isAuthenticated || !principalId) return null;
      // Return stored profile if available
      const stored = getStoredProfile();
      if (stored) return stored;
      return null;
    },
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5,
  });

  const registerMutation = useMutation<UserProfile, Error, RegisterParams>({
    mutationFn: async ({ username, displayName }) => {
      if (!principalId) throw new Error("Not authenticated");
      const profile: UserProfile = {
        id: principalId,
        username,
        displayName,
        avatarUrl: undefined,
      };
      storeProfile(profile);
      return profile;
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(["myProfile", principalId], profile);
    },
  });

  return {
    profile: query.data ?? null,
    isLoading: query.isLoading,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
  };
}
