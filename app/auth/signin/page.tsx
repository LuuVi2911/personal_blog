import { signIn } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Chrome } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

interface SignInPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl || "/admin";

  async function handleSignIn() {
    "use server";
    await signIn("google", { redirectTo: callbackUrl });
  }

  return (
    <div className="min-h-screen bg-background font-mono flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card/50 backdrop-blur border-border/40">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <Image
              src="/images/gemini-generated-image-9ss3jn9ss3jn9ss3.png"
              alt="L.Vi Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Sign In</CardTitle>
          <CardDescription>
            Sign in with your Google account to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {params.error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
              {params.error === "AccessDenied"
                ? "Access denied. Only authorized admin accounts can sign in."
                : "An error occurred during authentication. Please try again."}
            </div>
          )}

          <form action={handleSignIn}>
            <Button
              type="submit"
              className="w-full"
              size="lg"
              nativeButton={true}
            >
              <span className="flex items-center gap-2">
                <Chrome className="w-5 h-5" />
                Sign in with Google
              </span>
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Only authorized admin accounts can access this area
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

