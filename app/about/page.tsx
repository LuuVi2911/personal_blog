"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Github, Linkedin, FileText, Mail } from "lucide-react";

export default function AboutPage() {
  const skills = {
    languages: [
      { name: "JavaScript", icon: "/images/javascript.jpg" },
      { name: "TypeScript", icon: "/images/Typescript.svg" },
      { name: "Python", icon: "/images/python.png" },
      { name: "Java", icon: "/images/java.png" },
      { name: "SQL", icon: "/images/SQL.png" },
      { name: "HTML", icon: "/images/html.png" },
      { name: "CSS", icon: "/images/css.png" },
    ],
    frameworks: [
      { name: "React", icon: "/images/react.png" },
      { name: "NodeJS", icon: "/images/node.png" },
      { name: "Next.js", icon: "/images/nextjs.png" },
      { name: "NestJS", icon: "/images/nestjs.svg" },
      { name: "Express", icon: "/images/express.png" },
      { name: "Spring Boot", icon: "/images/springboot.png" },
      { name: "Prisma", icon: "/images/prisma.jpg" },
      { name: "Tailwind CSS", icon: "/images/tailwind.png" },
      { name: "shadcn/ui", icon: "/images/shadcn.png" },
    ],
    tools: [
      { name: "Git", icon: "/images/github.png" },
      { name: "GitHub Actions", icon: "/images/githubaction.png" },
      { name: "Docker", icon: "/images/docker.png" },
      { name: "Postman", icon: "/images/postman.jpg" },
      { name: "VS Code", icon: "/images/vscode.png" },
      { name: "AWS S3", icon: "/images/awss3.png" },
      { name: "Cloudinary", icon: "/images/cloudinary.png" },
    ],
    databases: [
      { name: "MongoDB", icon: "/images/mongodb.png" },
      { name: "PostgreSQL", icon: "/images/postgresql.png" },
    ],
  };

  return (
    <div className="min-h-screen bg-background font-mono">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-border shrink-0">
              <Image
                src="/images/hero.jpg"
                alt="Luu Vi"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-6 text-center md:text-left">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-4">Luu Vi</h1>
                <p className="text-xl text-muted-foreground">L.vi_</p>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Full Stack Developer • AI Enthusiast
              </p>
              <div className="flex gap-3 justify-center md:justify-start">
                <Link
                  href="https://github.com/LuuVi2911"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 hover:scale-110 transition-all"
                >
                  <Github className="w-6 h-6" />
                </Link>
                <Link
                  href="https://linkedin.com/in/luuvi2911"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-70 hover:scale-110 transition-all"
                >
                  <Linkedin className="w-6 h-6" />
                </Link>
                <Link
                  href="/resume"
                  className="hover:opacity-70 hover:scale-110 transition-all"
                >
                  <FileText className="w-6 h-6" />
                </Link>
              </div>
            </div>
          </div>

          {/* About Content */}
          <div className="space-y-8">
            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">About Me</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    Software Engineering student at Tampere University UAS with
                    experience in full-stack development using{" "}
                    <strong className="text-foreground">NestJS</strong>,{" "}
                    <strong className="text-foreground">Next.js</strong>,{" "}
                    <strong className="text-foreground">React</strong>,{" "}
                    <strong className="text-foreground">TypeScript</strong>,{" "}
                    <strong className="text-foreground">Java</strong>, and{" "}
                    <strong className="text-foreground">Python</strong>.{" "}
                    <strong className="text-foreground">
                      Winner of the Traficom Challenge at Junction 2025
                    </strong>{" "}
                    with a demonstrated ability to build scalable, user-focused
                    applications. Currently expanding skills in Machine Learning
                    and Deep Learning (LLMs), while developing real-world
                    projects and technical blogs.{" "}
                    <strong className="text-foreground">
                      Seeking opportunities to grow as a Full-Stack Developer.
                    </strong>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Languages */}
              <Card className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.languages.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-1.5 bg-card/80"
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{skill.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Frameworks and Libraries */}
              <Card className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    Frameworks and Libraries
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.frameworks.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-1.5 bg-card/80"
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{skill.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tools */}
              <Card className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Tools</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.tools.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-1.5 bg-card/80"
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{skill.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Databases */}
              <Card className="bg-card/50 backdrop-blur border-border/40">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-4">Databases</h2>
                  <div className="flex flex-wrap gap-2">
                    {skills.databases.map((skill) => (
                      <Badge
                        key={skill.name}
                        variant="outline"
                        className="flex items-center gap-2 px-3 py-1.5 bg-card/80"
                      >
                        <Image
                          src={skill.icon}
                          alt={skill.name}
                          width={16}
                          height={16}
                          className="w-4 h-4"
                        />
                        <span>{skill.name}</span>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur border-border/40">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">Education</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold">
                      Tampere University UAS
                    </h3>
                    <p className="text-muted-foreground">
                      Software Engineering
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2023 - Present
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-4 pt-8">
              <Button
                size="lg"
                className="font-mono"
                render={<Link href="/contact" />}
                nativeButton={false}
              >
                <Mail className="w-4 h-4 mr-2" />
                Get in Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="font-mono bg-transparent"
                render={<Link href="/resume" />}
                nativeButton={false}
              >
                <FileText className="w-4 h-4 mr-2" />
                View Resume
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
