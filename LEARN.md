# myself.engineer - Codebase Learning Guide

An AI-powered resume-to-website generator built with Next.js 16, React 19, and TypeScript.

---

## Recommended Reading Order

### Phase 1: Configuration & Setup (Start Here)

| File | Purpose |
|------|---------|
| `package.json` | Dependencies, scripts, project info |
| `.example.env` | Required environment variables |
| `tsconfig.json` | TypeScript configuration |
| `next.config.mjs` | Next.js settings |
| `tailwind.config.ts` | Styling configuration |
| `middleware.ts` | Auth route protection (Clerk) |

---

### Phase 2: Core Data Structures

| File | Purpose |
|------|---------|
| `lib/resume.ts` | **Critical** - Zod schemas defining resume structure |
| `lib/config.ts` | App-wide constants |
| `lib/routes.ts` | Protected route definitions |
| `lib/utils.ts` | Utility functions |

---

### Phase 3: Server Logic & Database

| File | Purpose |
|------|---------|
| `lib/server/redis.ts` | Redis client setup |
| `lib/server/redisActions.ts` | All database operations (CRUD) |
| `lib/server/cachedFunctions.ts` | Caching layer |
| `lib/server/scrapePdfContent.ts` | PDF text extraction |
| `lib/server/deleteS3File.ts` | S3 file deletion |

---

### Phase 4: AI/LLM Integration

| File | Purpose |
|------|---------|
| `lib/server/ai/generateResumeObject.ts` | **Core AI** - Qwen 2.5 72B resume parsing |
| `lib/server/ai/isFileContentBad.ts` | Llama Guard safety check |

---

### Phase 5: API Routes

| File | Purpose |
|------|---------|
| `app/api/resume/route.ts` | GET/POST resume data |
| `app/api/username/route.ts` | Username management |
| `app/api/check-username/route.ts` | Username availability check |
| `app/api/s3-upload/route.ts` | S3 upload endpoint |

---

### Phase 6: App Pages (User Flow)

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout, providers, global setup |
| `app/page.tsx` | Landing page (/) |
| `app/(private)/upload/page.tsx` + `client.tsx` | Upload page (/upload) |
| `app/(private)/preview/page.tsx` | LLM processing (/preview) |
| `app/[username]/page.tsx` | Public profile display |
| `app/[username]/utils.ts` | Profile utilities |
| `app/[username]/og/route.tsx` | OpenGraph image generation |

---

### Phase 7: Client Hooks

| File | Purpose |
|------|---------|
| `hooks/useUserActions.tsx` | **Important** - All API calls, React Query |
| `hooks/use-toast.ts` | Toast notifications |
| `hooks/use-mobile.tsx` | Responsive detection |

---

### Phase 8: Resume Display Components

| File | Purpose |
|------|---------|
| `components/resume/FullResume.tsx` | Main resume wrapper |
| `components/resume/Header.tsx` | Name, contacts, skills section |
| `components/resume/Summary.tsx` | Professional summary |
| `components/resume/WorkExperience.tsx` | Jobs section |
| `components/resume/Education.tsx` | Education section |
| `components/resume/Skills.tsx` | Skills display |
| `components/resume/resumeUtils.ts` | Resume helper functions |

---

### Phase 9: Resume Editing Components

| File | Purpose |
|------|---------|
| `components/resume/editing/EditResume.tsx` | Edit form wrapper |
| `components/resume/editing/WorkExperienceField.tsx` | Job editor |
| `components/resume/editing/EducationField.tsx` | Education editor |
| `components/resume/editing/SkillField.tsx` | Skills editor |
| `components/resume/editing/AddSkillDialog.tsx` | Add skill modal |

---

### Phase 10: Shared Components

| File | Purpose |
|------|---------|
| `components/TopMenu.tsx` | Navigation bar |
| `components/Footer.tsx` | Footer |
| `components/theme-provider.tsx` | Dark/light theme |
| `components/ReactQueryClientProvider.tsx` | React Query setup |

---

### Phase 11: UI Components (shadcn/ui)

Browse `components/ui/` for pre-built components like `button.tsx`, `dialog.tsx`, `dropzone.tsx`, etc.

---

### Phase 12: Styling

| File | Purpose |
|------|---------|
| `app/globals.css` | CSS variables, theme colors, animations |

---

## Data Flow Summary

```
User uploads PDF --> S3 Storage
                        |
                        v
               Preview page fetches PDF
                        |
                        v
               Qwen 2.5 72B parses resume
                        |
                        v
               Llama Guard safety check
                        |
                        v
               Store in Upstash Redis
                        |
                        v
               Redirect to /[username]
                        |
                        v
               Public website live!
```

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16, React 19 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS, shadcn/ui |
| Auth | Clerk |
| Database | Upstash Redis |
| File Storage | AWS S3 |
| AI/LLM | Together.ai (Qwen 2.5 72B) |
| Safety | Llama Guard |
| Analytics | Plausible |
| Observability | Helicone |

---

## Directory Structure

```
myself.engineer/
├── app/                          # Next.js App Router
│   ├── (private)/               # Protected routes
│   │   ├── upload/              # Resume upload
│   │   ├── preview/             # LLM processing
│   │   └── pdf/                 # PDF viewing
│   ├── api/                     # API routes
│   ├── [username]/              # Public profiles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   └── globals.css              # Global styles
│
├── components/                   # React components
│   ├── resume/                  # Resume display
│   │   └── editing/             # Resume editing
│   ├── ui/                      # shadcn/ui library
│   └── icons/                   # Custom icons
│
├── hooks/                        # Custom React hooks
│
├── lib/                          # Utilities & server logic
│   └── server/                  # Server-only code
│       └── ai/                  # LLM integration
│
└── public/                       # Static assets
```

---

## Environment Variables

Required variables (see `.example.env`):

```
S3_UPLOAD_REGION
S3_UPLOAD_KEY
S3_UPLOAD_SECRET
S3_UPLOAD_BUCKET
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
TOGETHER_API_KEY
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
HELICONE_API_KEY
```

---

## Key Concepts

### Resume Schema (lib/resume.ts)

The resume is structured as:

```typescript
{
  header: {
    name: string
    shortAbout: string
    location?: string
    contacts: { website?, email?, phone?, twitter?, linkedin?, github? }
    skills: string[]
  }
  summary: string
  workExperience: [{
    company, link, location, contract, title, start, end?, description
  }]
  education: [{
    school, degree, start, end
  }]
}
```

### Redis Storage Structure

```typescript
{
  status: 'live' | 'draft'
  file: { name, url?, size, bucket, key }
  fileContent?: string
  resumeData?: ResumeDataSchemaType
}
```

### Protected vs Public Routes

- **Protected** (require auth): `/upload`, `/preview`, `/pdf`, `/api/*`
- **Public**: `/`, `/[username]`

---

## Scripts

```bash
pnpm dev      # Development server
pnpm build    # Production build
pnpm start    # Production server
pnpm lint     # Run linting
```
 