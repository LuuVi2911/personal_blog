"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminResumePage() {
  const [isUploading, setIsUploading] = useState(false);
  const [currentResumeUrl, setCurrentResumeUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current resume URL on mount
  useEffect(() => {
    async function fetchCurrentResume() {
      try {
        const response = await fetch("/api/resume");
        if (response.ok) {
          const data = await response.json();
          setCurrentResumeUrl(data.url);
        }
      } catch {
        // Resume not available
      }
    }
    fetchCurrentResume();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Only PDF files are allowed.");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload resume");
      }

      const data = await response.json();
      setUploadedUrl(data.url);
      toast.success("Resume uploaded successfully!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload resume";
      toast.error(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadedUrl(null);
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("URL copied to clipboard!");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Resume Management
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload and manage your resume PDF
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            href="/admin"
            className="block rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="mt-8 space-y-8">
        {/* Current Resume */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Current Resume
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                The current resume URL is stored in the{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  CLOUDINARY_RESUME_URL
                </code>{" "}
                environment variable.
              </p>
            </div>
            <div className="mt-4">
              {currentResumeUrl ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={currentResumeUrl}
                      className="flex-1 block w-full rounded-md border-gray-300 bg-gray-50 text-sm text-gray-700 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentResumeUrl)}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Copy
                    </button>
                  </div>
                  <a
                    href={currentResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 text-sm"
                  >
                    View current resume →
                  </a>
                </div>
              ) : (
                <p className="text-sm text-yellow-600">
                  No resume URL configured. Upload a resume and add the URL to
                  your environment variables.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Upload New Resume */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Upload New Resume
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Upload a new PDF resume to Cloudinary. After uploading, copy the
                URL and update your{" "}
                <code className="bg-gray-100 px-1 py-0.5 rounded">
                  CLOUDINARY_RESUME_URL
                </code>{" "}
                environment variable.
              </p>
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                />
                {isUploading && (
                  <span className="text-sm text-gray-500">Uploading...</span>
                )}
              </div>
              <p className="text-xs text-gray-500">PDF files only. Max 10MB.</p>

              {uploadedUrl && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <h4 className="text-sm font-medium text-green-800">
                    Resume Uploaded Successfully!
                  </h4>
                  <p className="mt-2 text-sm text-green-700">
                    Copy this URL and add it to your environment variables:
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={uploadedUrl}
                      className="flex-1 block w-full rounded-md border-green-300 bg-white text-sm text-gray-700 px-3 py-2"
                    />
                    <button
                      type="button"
                      onClick={() => copyToClipboard(uploadedUrl)}
                      className="inline-flex items-center px-3 py-2 border border-green-300 shadow-sm text-sm leading-4 font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="mt-3 flex gap-4">
                    <a
                      href={uploadedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-700 hover:text-green-600 text-sm font-medium"
                    >
                      View uploaded resume →
                    </a>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-blue-900">
              How to Update Resume
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ol className="list-decimal list-inside space-y-2">
                <li>Upload your new resume PDF using the form above</li>
                <li>Copy the generated Cloudinary URL</li>
                <li>
                  Update the{" "}
                  <code className="bg-blue-100 px-1 py-0.5 rounded">
                    CLOUDINARY_RESUME_URL
                  </code>{" "}
                  environment variable in your deployment settings
                </li>
                <li>Redeploy your application for changes to take effect</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
