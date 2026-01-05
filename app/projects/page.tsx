"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Loader2 } from "lucide-react"
import { projectsApi } from "@/lib/api/client"
import type { Project } from "@/lib/api/types"
import { extractTextFromTipTap } from "@/lib/utils/tiptap"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [isSearching, setIsSearching] = useState(false)
  const [mounted, setMounted] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Debounce the search query
  const debouncedSearch = useDebounce(searchQuery, 300)

  // Track mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load tags on mount
  useEffect(() => {
    async function loadTags() {
      try {
        const tagsData = await projectsApi.getTags()
        setTags(["All", ...tagsData])
      } catch (err) {
        setTags(["All"])
      }
    }
    loadTags()
  }, [])

  // Fetch projects when filters change
  useEffect(() => {
    async function fetchProjects() {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      abortControllerRef.current = new AbortController()

      try {
        setIsSearching(true)

        const filterParams: { search?: string; tags?: string } = {}

        if (debouncedSearch.trim()) {
          filterParams.search = debouncedSearch.trim()
        }

        if (selectedTag !== "All") {
          filterParams.tags = selectedTag
        }

        // Use filter API if there are any filters, otherwise get all
        let data: Project[]
        if (filterParams.search || filterParams.tags) {
          data = await projectsApi.filter(filterParams)
        } else {
          data = await projectsApi.getAll()
        }

        // Sort by date desc
        const sorted = data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setProjects(sorted)
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') return
        setProjects([])
      } finally {
        setIsSearching(false)
        setLoading(false)
      }
    }

    fetchProjects()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedSearch, selectedTag])

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">MY WORK</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance">Projects & Open Source</h1>
            <p className="text-lg text-muted-foreground">
              A collection of my work, side projects, and open source contributions.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search projects and repos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-background/50 backdrop-blur border-border/40"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Tag Filters */}
          {mounted && (
            <div className="flex gap-2 justify-center flex-wrap max-w-5xl mx-auto">
              {tags.map((tag) => (
                <Button
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTag(tag)}
                  className="font-mono text-xs"
                >
                  {tag}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center text-sm font-bold">
            {projects.length}
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Featured Projects</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="group bg-card/50 backdrop-blur overflow-hidden h-full">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="flex flex-wrap gap-2">
                    {Array.from({ length: 3 }).map((__, idx) => (
                      <span key={idx} className="px-3 py-1 bg-muted rounded-full animate-pulse w-16 h-5" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}

          {!loading &&
            projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group hover:border-primary transition-all hover:scale-[1.02] bg-card/50 backdrop-blur overflow-hidden h-full">
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-purple-500/10" />
                    )}
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed line-clamp-3">
                      {extractTextFromTipTap(project.description)}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-mono text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

          {!loading && projects.length === 0 && (
            <p className="text-muted-foreground">No projects found.</p>
          )}
        </div>
      </section>
    </div>
  )
}
