import { useUser } from "@clerk/expo";
import { useEffect } from "react";

import { useSupabase } from "@/providers/supabase-provider";
import { useUserStore } from "@/stores/userStore";

/** Postgres unique_violation: another run already created the row. */
const UNIQUE_VIOLATION = "23505";

/**
 * Mirrors the signed-in Clerk user into Supabase and makes sure they have a
 * default account. Every step is safe to repeat. Call it once, from the
 * signed-in layout.
 */
export function useUserSync() {
  const { user } = useUser();
  const supabase = useSupabase();

  const syncAttempt = useUserStore((state) => state.syncAttempt);
  const setCurrency = useUserStore((state) => state.setCurrency);
  const setNeedsOnboarding = useUserStore((state) => state.setNeedsOnboarding);
  const setSyncError = useUserStore((state) => state.setSyncError);
  const reset = useUserStore((state) => state.reset);

  // Primitives, so the sync re-runs only when something we store has changed.
  const userId = user?.id;
  const email = user?.primaryEmailAddress?.emailAddress;
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const imageUrl = user?.imageUrl;

  // Forget this user's data on sign-out or account switch.
  useEffect(() => reset, [userId, reset]);

  useEffect(() => {
    if (!userId || !email) return;
    let cancelled = false;

    const fail = (step: string, error: unknown) => {
      if (cancelled) return;
      console.error(`User sync failed (${step}):`, error);
      setSyncError("Could not load your data. Please try again.");
    };

    const sync = async () => {
      // Creates the row or refreshes the profile. `currency` is not in the
      // payload, so an existing choice is kept.
      const { data: profile, error: userError } = await supabase
        .from("users")
        .upsert(
          { clerk_id: userId, email, name, image_url: imageUrl },
          { onConflict: "clerk_id" },
        )
        .select("currency")
        .single();
      if (cancelled) return;
      if (userError) return fail("user", userError);

      // Checked on every sync, so a failed first attempt is repaired later.
      const { data: account, error: findError } = await supabase
        .from("accounts")
        .select("id")
        .eq("user_id", userId)
        .eq("is_default", true)
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (findError) return fail("find account", findError);

      if (!account) {
        const { error: createError } = await supabase.from("accounts").insert({
          user_id: userId,
          name: "Cash",
          type: "CASH",
          balance: 0,
          is_default: true,
        });
        if (cancelled) return;
        if (createError && createError.code !== UNIQUE_VIOLATION) {
          return fail("create account", createError);
        }
      }

      if (profile.currency) setCurrency(profile.currency);
      setNeedsOnboarding(!profile.currency);
    };

    sync().catch((error: unknown) => fail("unexpected", error));

    return () => {
      cancelled = true;
    };
  }, [
    userId,
    email,
    name,
    imageUrl,
    syncAttempt,
    supabase,
    setCurrency,
    setNeedsOnboarding,
    setSyncError,
  ]);
}
