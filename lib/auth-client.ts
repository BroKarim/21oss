import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const { signIn, signOut, useSession, admin } = createAuthClient({
  baseURL: "",
  plugins: [adminClient()],
});
