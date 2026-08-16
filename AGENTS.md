# AIWCRM — Strict Agent Guidelines & Architecture Rules

> **MANDATORY INSTRUCTION FOR ALL AI AGENTS & COPILOTS**:
> You MUST read and follow these rules strictly before modifying any files in this repository. Failure to obey these directives causes breaking UI/UX regressions.

---

## 🛑 Rule #1: Protected Core UI Components (NO UNAPPROVED REGRESSIONS)

1. **Universal Omnichannel Inbox (`src/components/inbox/`, `src/app/(dashboard)/inbox/`)**:
   - **DO NOT ALTER OR REVERT THE LAYOUT.**
   - The 3-panel layout (Left Conversation List | Center Chat Thread | Right Contact Sidebar) is **BATTLE-TESTED & LOCKED**.
   - The Right Contact Sidebar MUST retain the `Overview` & `Timeline` tabs, `AI INSIGHTS & ANALYTICS` summary generator, `MESSAGE VOLUME` metrics, and the expandable accordions (`Deals & Quotes`, `Meetings`, `Tasks & Tickets`, `Notes & Files`).
   - The Chat Header MUST retain the `VIP` badge, `Department` selector, `Agent` assignment dropdown, `Active/Closed` status toggle, and `Details` button.
   - **NEVER** replace this layout with old prototypes or simple 2-panel views unless the user explicitly requests a specific UI change.

2. **App Shell & Layout Heights (`src/components/ui/responsive-layout.tsx`, `src/app/(dashboard)/dashboard-shell.tsx`)**:
   - The Inbox uses `flush={true}` on `<main>`.
   - `<main>` MUST have `h-full flex flex-col overflow-hidden` when `flush={true}`.
   - **NEVER** allow outer page scrollbars on `/inbox`. Scrolling is strictly internal to the messages container (`scrollRef`).

---

## 🤖 Rule #2: Groq & Vercel AI SDK Integration Standards

1. **Groq Model Compatibility**:
   - Groq API does **NOT** support the `json_schema` response format mode used by Vercel AI SDK's `generateObject`.
   - **DO NOT USE `generateObject` WITH GROQ MODELS.**
   - **ALWAYS USE `generateText`** with system/user prompt instructions requesting raw JSON, followed by `JSON.parse()` inside a `try/catch` block with deterministic fallbacks.

2. **Error Handling & Fallbacks**:
   - Always wrap AI API calls in `try/catch` blocks.
   - Return graceful fallback objects if the AI API key is missing or rate-limited. NEVER throw raw LLM errors or crash the UI with toast alerts.

---

## 🛠️ Rule #3: Code Quality, Imports & Type Safety

1. **Imports & TypeScript Integrity**:
   - Always verify that all used symbols (e.g., `generateText`, `generateText` from `'ai'`, `LucideIcon` names) are explicitly imported at the top of the file.
   - NEVER leave implicit `any` parameter types in route callbacks.
   - Ensure zero build/lint errors before staging changes.

2. **Git Commit & Deployment Protocol**:
   - Only push to `main` when the feature/fix has been verified and approved by the user.
   - Use clear commit messages adhering to conventional commit standards (`fix(inbox): ...`, `feat(ai): ...`).

---

## 🎨 Tech Stack & Conventions
- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, Shadcn UI primitives, Lucide Icons
- **Database & Auth**: Supabase (Client & Server Admin)
- **AI Engine**: Groq (`llama-3.3-70b-versatile`), Vercel AI SDK (`generateText`)
- **State & Realtime**: Supabase Realtime WebSockets, Custom Presence Hooks
