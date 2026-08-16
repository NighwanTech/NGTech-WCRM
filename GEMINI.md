# MANDATORY WORKSPACE RULES FOR AIWCRM

## 🔒 PROTECTED CORE MODULES (LOCKED)
1. **Universal Omnichannel Inbox (`/inbox`, `src/components/inbox/`)**:
   - The 3-panel enterprise workspace (List | Chat | Contact Details) is strictly protected.
   - Right sidebar MUST maintain `Overview` / `Timeline` tabs, `AI INSIGHTS & ANALYTICS`, `MESSAGE VOLUME`, and the 4 accordions (`Deals & Quotes`, `Meetings`, `Tasks & Tickets`, `Notes & Files`).
   - Chat header MUST maintain `VIP` badge, `Department` selector, `Agent` assignment dropdown, `Active/Closed` status toggle, and `Details` button.
   - Do NOT revert or simplify this layout.

2. **Viewport & Layout Height Rules**:
   - `/inbox` must have zero page-level scrollbars. Main container must keep `h-full flex flex-col overflow-hidden` when `flush={true}`.

3. **Groq LLM Guidelines**:
   - Never use `generateObject` with Groq models (`json_schema` error).
   - Always use `generateText` + `JSON.parse()` with fallbacks.

4. **Build & Typecheck**:
   - Verify all imports (`generateText`, etc.) before committing. Zero TypeScript errors allowed.
