# AIWCRM Workspace Architecture & Agent Enforcement Rules

## 1. Core Principles
- **No Unapproved Component Reversions**: Never alter or revert locked core components (`Universal Inbox`, `Customer 360`, `Meta Ads Manager Pro`) without explicit user instructions.
- **Zero Page-Level Overflow on Full-Screen Apps**: Pages like `/inbox` must use `overflow-hidden` at the main container level so scrollbars are exclusively internal to content scroll areas.
- **Groq Structured Output Safety**: Never pass `responseFormat: { type: 'json_schema' }` or call `generateObject` on Groq models. Always use `generateText` with manual JSON parsing and robust fallback objects.
- **Strict Import & Type Verification**: Always ensure imports are clean and typed before committing.

## 2. Tech Stack Reference
- **Frontend**: Next.js 15 App Router, React 19, TailwindCSS, Lucide React
- **Backend/DB**: Supabase PostgreSQL, Supabase Realtime, Supabase Auth
- **AI/LLM**: Groq (`llama-3.3-70b-versatile`), Vercel AI SDK (`generateText`)
