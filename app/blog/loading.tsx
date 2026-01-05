import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background font-mono relative">
      <div className="container mx-auto px-4 py-12 space-y-8">
        <div className="space-y-3 text-center max-w-3xl mx-auto">
          <Skeleton className="h-4 w-24 mx-auto" />
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-5 w-2/3 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card/50 backdrop-blur rounded-xl border border-border/50 overflow-hidden h-full">
              <div className="aspect-video bg-muted animate-pulse" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-2 flex-wrap">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
