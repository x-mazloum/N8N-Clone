# N8N Clone — Visual Workflow Builder

A modern workflow automation interface inspired by n8n, built with **Next.js**, **TypeScript**, **React Flow / XYFlow**, **Prisma**, **tRPC**, **TanStack Query**, and **Inngest**.

The goal of this project was to practice building a complex React application with a node-based editor, workflow data modeling, authentication, credentials, executions, and scalable full-stack TypeScript architecture.

## Live Demo
https://n8-n-clone-tau.vercel.app
Add your live demo here:

```txt
https://n8-n-clone-tau.vercel.app
```

## Tech Stack

- **Framework:** Next.js, React, TypeScript
- **UI:** Tailwind CSS, Radix UI, Base UI, shadcn-style components, Lucide React
- **Workflow Editor:** React Flow / XYFlow
- **Data Layer:** Prisma, PostgreSQL
- **API / Data Fetching:** tRPC, TanStack Query, SuperJSON
- **Background Jobs:** Inngest
- **State Management:** Jotai
- **Forms / Validation:** React Hook Form, Zod
- **Authentication:** Better Auth
- **AI Integrations:** OpenAI, Anthropic, Gemini SDKs
- **Tooling:** Biome, TypeScript, Vercel

## Main Features

- Visual workflow editor with node-based UI
- Workflow creation, listing, search, and deletion
- Node and connection data modeling
- Workflow execution system using Inngest
- Execution status tracking
- Credential management for AI providers
- Feature-based project structure
- Authentication and user-owned workflows
- Full-stack TypeScript patterns using Prisma, tRPC, and TanStack Query

## Project Architecture

The project is structured around feature modules instead of placing everything in one large components folder.

```txt
src/
  app/              App Router routes and API structure
  components/       Shared reusable UI components
  config/           Node component configuration
  features/
    auth/           Authentication UI
    credentials/    Credential management
    editor/         Workflow editor UI and editor state
    executions/     Execution views and execution logic
    subscriptions/  Subscription-related hooks
    triggers/       Trigger components
    workflows/      Workflow CRUD, hooks, server procedures
  inngest/          Background workflow execution
  lib/              Shared utilities and database setup
  trpc/             tRPC client/server setup
prisma/
  schema.prisma     Database schema for users, workflows, nodes, connections, credentials, and executions
```

## Database Model

The Prisma schema includes models for:

- `User`
- `Session`
- `Account`
- `Verification`
- `Credential`
- `Workflow`
- `Node`
- `Connection`
- `Execution`

This structure allows each user to own workflows, each workflow to contain nodes and connections, and each execution to store status, output, and error data.

## What I Learned

This project helped me strengthen:

- Building complex React/Next.js application interfaces
- Working with node-based UI using React Flow / XYFlow
- Structuring a full-stack TypeScript project
- Modeling workflows, nodes, connections, and executions
- Connecting frontend state with backend data using tRPC and TanStack Query
- Handling background execution logic with Inngest
- Designing a maintainable feature-based architecture

## Future Improvements

- Improve README screenshots and add demo GIFs
- Add workflow validation before execution
- Improve node editing UX
- Add stronger error states and empty states
- Add tests for workflow logic and UI components
- Improve mobile responsiveness for the editor
- Add more integrations and trigger types

## Running Locally

```bash
git clone https://github.com/x-mazloum/N8N-Clone.git
cd N8N-Clone
npm install
npm run dev
```

Create an `.env` file based on the services used in the project, including database, authentication, AI provider, and Inngest-related variables.

## Project Status

This is a portfolio project built to demonstrate full-stack React/Next.js architecture, visual workflow UI, and TypeScript application development.
