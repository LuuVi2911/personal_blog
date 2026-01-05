"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileText, Loader2 } from "lucide-react";

export default function ResumePage() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchResumeUrl() {
      try {
        const response = await fetch("/api/resume");
        if (response.ok) {
          const data = await response.json();
          setResumeUrl(data.url);
        } else {
          setError("Resume not available");
        }
      } catch {
        setError("Failed to load resume");
      } finally {
        setLoading(false);
      }
    }

    fetchResumeUrl();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background font-mono flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-mono">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-8"
          render={<Link href="/" />}
          nativeButton={false}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Resume</h1>
            <p className="text-muted-foreground text-lg">
              Download my resume or view it online
            </p>
          </div>

          {error || !resumeUrl ? (
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-xl font-semibold mb-2">
                  Resume Not Available
                </h2>
                <p className="text-muted-foreground">
                  The resume is currently not available. Please check back
                  later.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Download button */}
              <div className="flex justify-center gap-4">
                <Button
                  size="lg"
                  className="font-mono"
                  render={
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    />
                  }
                  nativeButton={false}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="font-mono bg-transparent"
                  render={
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View in New Tab
                </Button>
              </div>

              {/* PDF Viewer */}
              <Card className="bg-card/50 backdrop-blur border-border/40 overflow-hidden">
                <CardContent className="p-0">
                  <iframe
                    src={`${resumeUrl}#toolbar=0`}
                    className="w-full h-[800px] border-0"
                    title="Resume PDF"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
