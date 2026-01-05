"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

export default function ApiDocsPage() {
  const [spec, setSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSpec() {
      try {
        const response = await fetch("/api/docs/openapi");
        if (!response.ok) {
          throw new Error("Failed to fetch OpenAPI spec");
        }
        const data = await response.json();
        setSpec(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    fetchSpec();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">Loading API documentation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          <p>Error loading API documentation: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
        <div className="container mx-auto">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> To test admin endpoints, you need to{" "}
            <a
              href="/api/auth/signin"
              className="underline font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              sign in first
            </a>
            . The session cookie will be automatically included in requests.
          </p>
        </div>
      </div>
      <SwaggerUI spec={spec} />
    </div>
  );
}

