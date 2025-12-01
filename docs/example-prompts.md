# SuperClaude Development Lifecycle (v4.1.6)

This guide outlines the standard development workflow using SuperClaude v4.1.6. It breaks the process down into four distinct stages, detailing the goals, specialized personas, and specific CLI commands for each.

## 🏗️ Stage 1: Planning & Architecture

**Goal:** Define system boundaries, database schemas, and API contracts before writing code to prevent technical debt.

**Key Personas:**

- **Architect:** High-level system design and patterns.
- **Tech Lead:** Technology choices and stack decisions.

**Recommended Commands:**

### 1. Architectural Deep Dive

Use deep reasoning to outline the core structure.

```bash
/sc:design --persona architect --think-hard "Outline the architecture for [Project Name]. Include: 1. Microservices breakdown 2. PostgreSQL Schema 3. REST API Contracts"
```

### 2. Tech Stack Research

Validate technology choices against current best practices.

```bash
/sc:analyze --persona architect --think "Compare React vs Vue for this specific use case. Search for the best open-source libraries for [Feature]."
```

## 💻 Stage 2: Implementation

**Goal:** Implement features with strict adherence to the design documents created in Stage 1.

**Key Personas:**

- **Frontend Architect:** UI/UX standards and component structure.
- **Backend Engineer:** Logic, database interactions, and API implementation.

**Recommended Commands:**

### 1. Smart Scaffolding (Frontend)

Generate accessible, styled UI components instantly.

```bash
/sc:build --persona frontend --magic "Generate a dashboard layout using Tailwind CSS with a sidebar navigation and dark mode toggle."
```

### 2. Logic Implementation (TDD)

Write tests first, then implement the business logic.

```bash
/sc:implement --persona backend --tdd "Implement the User Authentication service. 1. Middleware 2. API Routes 3. Unit Tests"
```

## 🔍 Stage 3: QA & Security

**Goal:** Review code health, ensure test coverage, and harden security posture.

**Key Personas:**

- **Security Engineer:** Vulnerability scanning and audit.
- **QA Specialist:** Test automation and coverage analysis.

**Recommended Commands:**

### 1. Deep Code Analysis

Scan for vulnerabilities and anti-patterns.

```bash
/sc:analyze --persona security --think "Scan ./src for potential SQL injection vulnerabilities, hardcoded secrets, and circular dependencies."
```

### 2. Automated Test Generation

Generate integration and end-to-end (E2E) tests.

```bash
/sc:test --persona qa --coverage "Generate integration tests for the payment flow. Ensure 80% code coverage. Use Playwright."
```

## 🚑 Stage 4: Troubleshooting

**Goal:** Fix production bugs and complex errors using structured root cause analysis.

**Key Personas:**

- **Systems Analyzer:** Debugging and forensic analysis.

**Recommended Commands:**

### 1. Deep Root Cause Analysis

Use introspection to find why a bug occurred, not just how to patch it.

```bash
/sc:troubleshoot --persona analyzer --ultrathink "I am getting error [Error Message] in [File]. Trace the data flow and propose 3 solutions (Quick Fix, Refactor, Architecture Change)."
```
