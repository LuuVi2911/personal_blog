import { auth } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "lhnvi705@gmail.com";

/**
 * Check if the current user is authenticated and is the admin
 * Returns the user email if authorized, null otherwise
 */
export async function checkAdminAuth(): Promise<string | null> {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }

  if (session.user.email !== ADMIN_EMAIL) {
    return null;
  }

  return session.user.email;
}

/**
 * Verify that the request is from an authorized admin
 * Throws an error if not authorized
 */
export async function requireAdmin(): Promise<string> {
  const email = await checkAdminAuth();

  if (!email) {
    throw new Error("Unauthorized: Admin access required");
  }

  return email;
}

