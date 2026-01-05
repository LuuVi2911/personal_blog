import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "lhnvi705@gmail.com";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Only allow the admin email to sign in
      if (user.email === ADMIN_EMAIL) {
        return true;
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
});

/**
 * Check if the current user is the admin
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.email === ADMIN_EMAIL;
}

/**
 * Get the current user's email
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  const session = await auth();
  return session?.user?.email || null;
}

