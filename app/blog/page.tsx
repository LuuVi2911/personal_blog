"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import type { BlogPostListItem } from "@/lib/api/types"
import { blogApi } from "@/lib/api/client"

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("All")
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
        const tagsData = await blogApi.getTags()
        setTags(["All", ...tagsData])
      } catch (err) {
        setTags(["All"])
      }
    }
    loadTags()
  }, [])

  // Fetch posts when filters change
  useEffect(() => {
    async function fetchPosts() {
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

        if (selectedCategory !== "All") {
          filterParams.tags = selectedCategory
        }

        // Use filter API if there are any filters, otherwise get all
        let data: BlogPostListItem[]
        if (filterParams.search || filterParams.tags) {
          data = await blogApi.filter(filterParams)
        } else {
          data = await blogApi.getAll()
        }

        // Sort by createdAt desc
        const sorted = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        setPosts(sorted)
      } catch (err) {
        // Ignore abort errors
        if (err instanceof Error && err.name === 'AbortError') return
        setPosts([])
      } finally {
        setIsSearching(false)
        setLoading(false)
      }
    }

    fetchPosts()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [debouncedSearch, selectedCategory])

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground uppercase tracking-wider">MY BLOG</p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-balance">My Stories & Ideas</h1>
            <p className="text-lg text-muted-foreground">
              The latest writings, news, technologies, and resources from me.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 bg-background/50 backdrop-blur border-border/40"
            />
            {isSearching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Category Filters */}
          {mounted && (
            <div className="flex gap-2 justify-center flex-wrap">
              {tags.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="font-mono"
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Blog Posts */}
      <section className="container mx-auto px-4 pb-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading &&
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="group bg-card/50 backdrop-blur overflow-hidden h-full">
                <div className="aspect-video bg-muted animate-pulse" />
                <CardContent className="p-6 space-y-3">
                  <div className="h-5 w-3/4 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-full bg-muted rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse" />
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}

          {!loading && posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="group hover:border-primary transition-all hover:scale-[1.02] bg-card/50 backdrop-blur overflow-hidden h-full">
                <div className="aspect-video relative overflow-hidden bg-muted">
                  <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-purple-500/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-3xl md:text-4xl font-bold text-white text-center px-4 text-balance">
                      {post.title}
                    </p>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {post.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {!loading && posts.length === 0 && (
            <p className="text-muted-foreground">No blog posts found.</p>
          )}
        </div>
      </section>
    </div>
  )
}
