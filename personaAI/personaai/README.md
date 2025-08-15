## Persona AI (Next.js + Tailwind)

Two-persona chatbot with a modern black/white UI, shuttle animation when switching personas, and a shimmer loader while responses are generated. Backend lives inside the Next.js `app` directory and proxies to OpenAI. No keys are exposed to the browser.

### Features
- Two selectable personas (Hitesh Chaudhary and Piyush Garg) with server-side training data and guidance
- Clean, minimal black/white theme with subtle motion
- Shuttle transition animation when switching personas
- Shimmer loader while waiting for responses
- Server-only OpenAI API calls (no key in the client)
- Vercel-ready

### Tech stack
- Next.js 15 (App Router)
- React 19
- Tailwind CSS v4 (via `@tailwindcss/postcss`)



