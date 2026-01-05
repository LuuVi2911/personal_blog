# Portfolio Website

A modern, full-stack portfolio website built with Next.js 16, featuring a blog system, project showcase, resume management, and admin panel for content management.

## 🚀 Features

- **Portfolio Showcase**: Display your projects with tags, descriptions, GitHub links, and images
- **Blog System**: Rich text blog posts with image uploads, tags, and publish/unpublish functionality
- **Resume Management**: Upload and display your resume PDF
- **Admin Panel**: Secure admin interface for managing blog posts, projects, and resume
- **Authentication**: Google OAuth authentication with email-based access control
- **Rich Text Editor**: TipTap-based WYSIWYG editor for blog and project content
- **Image Management**: Cloudinary integration for secure, reliable image hosting
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Dark Mode**: Theme toggle support with next-themes
- **Responsive Design**: Mobile-first, modern UI with Tailwind CSS
- **Contact Page**: Contact form and social links

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.1 (App Router with Turbopack)
- **Language**: TypeScript 5
- **Database**: PostgreSQL 16 with Prisma ORM 7.2
- **Authentication**: NextAuth.js v5 (Google OAuth)
- **UI Components**: Radix UI, Base UI, shadcn/ui
- **Styling**: Tailwind CSS 4
- **Rich Text**: TipTap 3.14
- **Image Hosting**: Cloudinary
- **API Docs**: Swagger/OpenAPI
- **Deployment**: Vercel-ready

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ and npm
- **Docker** and Docker Compose (for local database)
- **Google OAuth Credentials** (for authentication)
- **Cloudinary Account** (for image hosting)

## 🔧 Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd portfolio
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://portfolio:portfolio123@localhost:5432/portfolio_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate with: openssl rand -base64 32

# Google OAuth (Get from https://console.cloud.google.com/)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Admin Email (only this email can access admin panel)
ADMIN_EMAIL="your-admin@email.com"

# Cloudinary Configuration (Get from https://cloudinary.com/console)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Optional: Resume URL (stored in Cloudinary)
CLOUDINARY_RESUME_URL=""

# Optional: Database configuration (if different from defaults)
POSTGRES_USER=portfolio
POSTGRES_PASSWORD=portfolio123
POSTGRES_DB=portfolio_db
POSTGRES_PORT=5432
```

4. **Start the database**

```bash
npm run db:up
```

This starts a PostgreSQL container using Docker Compose.

5. **Run database migrations**

```bash
npm run db:migrate
```

6. **Generate Prisma Client**

```bash
npm run db:generate
```

## 🚀 Running the Project

### Development Mode

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:up` | Start PostgreSQL Docker container |
| `npm run db:down` | Stop PostgreSQL Docker container |
| `npm run db:migrate` | Run database migrations |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## 📁 Project Structure

```
portfolio/
├── app/                      # Next.js App Router
│   ├── admin/               # Admin panel pages
│   │   ├── blog/            # Blog management
│   │   ├── projects/        # Project management
│   │   └── resume/          # Resume management
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── blog/            # Blog API endpoints
│   │   ├── projects/        # Projects API endpoints
│   │   ├── resume/          # Resume API endpoints
│   │   └── docs/            # API documentation
│   ├── api-docs/            # Swagger UI page
│   ├── auth/                # Authentication pages
│   ├── blog/                # Public blog pages
│   ├── projects/            # Public project pages
│   ├── about/               # About page
│   ├── contact/             # Contact page
│   ├── resume/              # Resume page
│   └── page.tsx             # Homepage
├── components/              # React components
│   ├── ui/                 # Reusable UI components
│   ├── header.tsx          # Site header
│   ├── footer.tsx          # Site footer
│   └── theme-toggle.tsx    # Dark mode toggle
├── lib/                     # Utility libraries
│   ├── api/                # API clients and hooks
│   ├── auth.ts             # NextAuth configuration
│   ├── auth-utils.ts       # Auth helper functions
│   ├── cloudinary/         # Cloudinary configuration
│   ├── prisma/             # Prisma client
│   ├── swagger/            # Swagger/OpenAPI config
│   └── utils/              # Utility functions
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma       # Prisma schema
│   └── migrations/         # Database migrations
├── public/                  # Static assets
│   ├── images/            # Static images
│   └── uploads/           # Legacy uploads (deprecated, using Cloudinary)
├── generated/              # Generated files
│   └── prisma/             # Generated Prisma Client
└── docker-compose.yml      # Docker Compose configuration
```

## 🔐 Authentication & Admin Access

The admin panel is protected by authentication. To access:

1. **Set up Google OAuth**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
   - For production, add your production URL

2. **Configure Admin Email**:
   - Set `ADMIN_EMAIL` in your `.env` file
   - Only this email address can sign in and access the admin panel

3. **Access Admin Panel**:
   - Navigate to `/admin`
   - Click "Log In" and sign in with your Google account (must match `ADMIN_EMAIL`)

## 📝 API Documentation

Interactive API documentation is available at `/api-docs` when running the development server.

The API includes:
- **Blog Endpoints**: CRUD operations for blog posts
- **Project Endpoints**: CRUD operations for projects
- **Resume Endpoints**: Upload and retrieve resume
- **Image Upload**: Upload images to Cloudinary for blog posts and projects
- **Tags**: Get available tags for filtering

All endpoints are documented with OpenAPI/Swagger specifications.

## 🎨 Admin Features

### Blog Management
- Create, edit, and delete blog posts
- Rich text editor with TipTap
- Image upload to Cloudinary
- Tag management
- Publish/unpublish posts
- Slug-based URLs
- Excerpt support

### Project Management
- Create, edit, and delete projects
- Rich text descriptions with TipTap
- Image upload to Cloudinary
- Add GitHub links
- Tag projects
- Set project dates

### Resume Management
- Upload resume PDF to Cloudinary
- Display resume on public page
- Download resume functionality

## 🖼️ Image Management with Cloudinary

All images (blog posts, projects) are hosted on Cloudinary for:
- **Reliability**: No local storage issues
- **Performance**: CDN delivery and optimization
- **Scalability**: Automatic image transformations
- **Security**: Secure upload endpoints

### Image Upload Flow

1. **Blog Images**: Uploaded via `/api/blog/images/upload`
2. **Project Images**: Uploaded via `/api/projects/images/upload`
3. **Resume PDF**: Uploaded via `/api/resume/upload`

All uploads:
- Validate file type and size (max 10MB)
- Require admin authentication
- Return Cloudinary URLs
- Are organized in folders (`portfolio/blog`, `portfolio/projects`, `portfolio/resume`)

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. The database schema includes:

- **Blog**: Blog posts with TipTap JSON content, tags, and publish status
- **Project**: Projects with TipTap JSON descriptions, tags, images, and GitHub links

### Accessing the Database

**Prisma Studio** (Visual Database Browser):
```bash
npm run db:studio
```

**Direct Database Access**:
```bash
# Connect to PostgreSQL container
docker exec -it portfolio-postgres psql -U portfolio -d portfolio_db
```

## 🚢 Deployment

### Vercel Deployment

1. **Push to GitHub**

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Configure environment variables

3. **Set Environment Variables** in Vercel:
   - `DATABASE_URL` (use a production PostgreSQL database)
   - `NEXTAUTH_URL` (your production URL, e.g., `https://yourdomain.com`)
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ADMIN_EMAIL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLOUDINARY_RESUME_URL` (optional)

4. **Update Google OAuth Redirect URI**:
   - Add your production URL to Google Cloud Console: `https://yourdomain.com/api/auth/callback/google`

### Database Options for Production

- **Vercel Postgres**: Integrated with Vercel
- **Supabase**: Free tier available
- **Railway**: Easy PostgreSQL hosting
- **Neon**: Serverless PostgreSQL
- **Render**: Simple PostgreSQL hosting

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if Docker container is running
docker ps

# View container logs
docker logs portfolio-postgres

# Restart database
npm run db:down
npm run db:up
```

### Prisma Client Issues

```bash
# Regenerate Prisma Client
npm run db:generate
```

### Authentication Issues

- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Check that redirect URI matches in Google Cloud Console
- Ensure `ADMIN_EMAIL` matches your Google account email
- Verify `NEXTAUTH_URL` matches your current environment

### Cloudinary Issues

- Verify all Cloudinary environment variables are set
- Check Cloudinary dashboard for upload limits
- Ensure API keys have proper permissions

### TipTap SSR Issues

If you see SSR hydration errors:
- The editor is configured with `immediatelyRender: false` to prevent hydration mismatches
- Ensure the component is marked with `"use client"`

## 🔒 Security Considerations

- Admin routes are protected by authentication
- Image uploads validate file types and sizes
- All API endpoints validate input with Zod schemas
- Environment variables should never be committed
- Use strong `NEXTAUTH_SECRET` in production

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [TipTap Documentation](https://tiptap.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Cloudinary Documentation](https://cloudinary.com/documentation)

## 📄 License

This project is private and proprietary.

---

Built with ❤️ using Next.js and modern web technologies.
