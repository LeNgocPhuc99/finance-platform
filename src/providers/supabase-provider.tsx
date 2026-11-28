import { useClerk } from "@clerk/expo";
import { createContext, useContext, useMemo, type ReactNode } from "react";

import { createClerkSupabaseClient } from "@/lib/supabase";

type SupabaseClient = ReturnType<typeof createClerkSupabaseClient>;

const SupabaseContext = createContext<SupabaseClient | null>(null);

/** One Supabase client for the whole app. Must be rendered inside ClerkProvider. */
export function SupabaseProvider({ children }: { children: ReactNode }) {
  const clerk = useClerk();

  // `clerk.session` is read on every request, so the same client keeps working
  // across token refreshes, sign-out and switching accounts.
  const client = useMemo(
    () =>
      createClerkSupabaseClient(
        async () => (await clerk.session?.getToken()) ?? null,
      ),
    [clerk],
  );

  return (
    <SupabaseContext.Provider value={client}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const client = useContext(SupabaseContext);
  if (!client) {
    throw new Error("useSupabase must be used within <SupabaseProvider>");
  }
  return client;
}
