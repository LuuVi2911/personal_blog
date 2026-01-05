import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Portfolio API",
      version: "1.0.0",
      description: "API documentation for Portfolio blog and projects management",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: process.env.NEXTAUTH_URL || "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "next-auth.session-token",
          description: "NextAuth session cookie for authentication",
        },
      },
      schemas: {
        BlogPost: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the blog post",
            },
            title: {
              type: "string",
              description: "Title of the blog post",
            },
            slug: {
              type: "string",
              description: "URL-friendly identifier",
            },
            content: {
              type: "string",
              description: "HTML content of the blog post",
            },
            excerpt: {
              type: "string",
              description: "Short excerpt or summary",
              nullable: true,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tags",
            },
            published: {
              type: "boolean",
              description: "Whether the post is published",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        BlogPostListItem: {
          type: "object",
          properties: {
            id: {
              type: "string",
            },
            title: {
              type: "string",
            },
            slug: {
              type: "string",
            },
            excerpt: {
              type: "string",
              nullable: true,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
            },
            published: {
              type: "boolean",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Project: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "Unique identifier for the project",
            },
            title: {
              type: "string",
              description: "Title of the project",
            },
            description: {
              type: "string",
              description: "Description of the project",
            },
            image: {
              type: "string",
              format: "uri",
              description: "URL to project image",
              nullable: true,
            },
            github: {
              type: "string",
              format: "uri",
              description: "GitHub repository URL",
              nullable: true,
            },
            tags: {
              type: "array",
              items: {
                type: "string",
              },
              description: "Array of tags",
            },
            date: {
              type: "string",
              format: "date-time",
              description: "Project date",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: {
              type: "string",
              description: "Error message",
            },
            details: {
              type: "array",
              items: {
                type: "object",
              },
              description: "Validation error details",
              nullable: true,
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Blog",
        description: "Blog post management endpoints",
      },
      {
        name: "Projects",
        description: "Project management endpoints",
      },
    ],
  },
  apis: [
    "./app/api/**/*.ts", // Path to the API files
  ],
};

export const swaggerSpec = swaggerJsdoc(options);

