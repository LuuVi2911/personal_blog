"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return "Access denied. Only authorized admin accounts can sign in.";
      case "Configuration":
        return "There is a problem with the server configuration.";
      case "Verification":
        return "The verification token has expired or has already been used.";
      default:
        return "An error occurred during authentication. Please try again.";
    }
  };

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
          <div className="flex justify-center">
            <AlertCircle className="w-12 h-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">Authentication Error</CardTitle>
          <CardDescription>
            {getErrorMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-2">
            <Button
              className="w-full"
              nativeButton={false}
              render={<Link href="/auth/signin" />}
            >
              <span className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Try Again
              </span>
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              nativeButton={false}
              render={<Link href="/" />}
            >
              Go to Homepage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

