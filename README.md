# Seam-Driven Development (SDD) Proof-of-Concept

A minimal MCP server demonstrating Seam-Driven Development principles using TypeScript, Express, and pnpm.

## 🛡️ Guardrails Active

- **Pre-commit hook**: Blocks manual edits to `src/generated/` without `Manual-Patch: <SeamName>` trailer
- **CI validation**: YAML lint + contract examples check + read-only contracts
- **Strong typing**: TypeScript interfaces for all SDD entities

## 📁 Project Structure

```
sdd-poc/
├── src/
│   ├── server.ts           # Express server + 5 endpoints
│   ├── types.ts            # TypeScript interfaces
│   ├── services/           # Business logic modules
│   └── generated/          # Auto-generated stubs (🚧 read-only)
├── templates/
│   └── contract_stub.yml   # YAML template
├── contracts/              # Generated contracts (immutable)
├── blueprints/             # Generated blueprints
├── tmp/                    # PRD cache
├── scripts/
│   └── checkExamples.js    # Contract validation
└── .github/workflows/
    └── validate.yml        # CI pipeline
```

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🔄 SDD Workflow (5 Endpoints)

1. **POST /requirements** - Store PRD text
2. **POST /seams** - Detect seams with LLM
3. **POST /contracts** - Generate YAML contracts
4. **POST /validate** - Validate contracts + examples
5. **POST /generate** - Create code stubs + blueprints

## 📋 Manual-Patch Tracking

When editing files in `src/generated/`, add this trailer to your commit:

```
Manual-Patch: SeamName
```

This enables future two-strike regeneration logic.
