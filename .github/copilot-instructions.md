# Seam-Driven Development (SDD) Copilot Instructions

## 🚧 CRITICAL SDD GUARDRAILS - ENFORCE ALWAYS

### ⚠️ **MANDATORY PRE-IMPLEMENTATION CHECK**
**BEFORE ANY CODE:** Ask these questions in this order:
1. "What contracts govern this feature/seam?"
2. "Do I need to generate stubs from contracts first?"
3. "What checklist phase are we in and what does it require?"
4. "Have I run `npm run sdd:safe` to verify compliance?"

### 1. SEAM-FIRST DEVELOPMENT
- **BEFORE any implementation**: Identify ALL boundaries (APIs, DB queries, file I/O, external services)
- **Name every seam explicitly** - hidden boundaries are bugs
- **Never write code that crosses unnamed boundaries**
- If user requests implementation without seams defined, ask: "What are the seams (boundaries) in this feature?"

### 2. CONTRACT-DRIVEN WORKFLOW
- **NO code until contracts exist** - contracts come before implementation, always
- **Contract format**: YAML files in `/contracts/` following template in `/templates/contract_stub.yml`
- **Required fields**: name, version, versionDate, inputs, outputs, errors, examples (≥1)
- **Immutable rule**: Never edit existing contracts - create new versions (v2, v3...)

### 3. GENERATION-OVER-EDITING
- **Auto-generate code stubs** from contracts using `/src/services/generator.ts`
- **Files in `src/generated/` are READ-ONLY** - manual edits require `Manual-Patch: <SeamName>` trailer
- **Regenerate instead of patching** whenever possible

### 4. VALIDATION ALWAYS
- **Before any commit**: Run contract validation (`npm run check:examples`)
- **Validate schema**: name, version, examples exist and examples.length ≥ 1
- **YAML lint**: All contracts must parse cleanly

## 🎯 SDD WORKFLOW ENFORCEMENT

### When user asks for new features:
1. **"What seams does this feature cross?"** (identify boundaries first)
2. **"Let's define contracts for each seam"** (contracts before code)
3. **"Generate stubs from contracts"** (automated generation)
4. **"Validate contracts"** (schema + examples check)
5. **Only then implement business logic**

### When editing existing code:
- **Check if it's in `src/generated/`** - if yes, require `Manual-Patch:` trailer or regenerate
- **Update contracts first**, then regenerate stubs
- **Never break existing contract interfaces** - version up instead

### Project Structure Compliance:
```
src/
  generated/      # 🚧 READ-ONLY auto-generated stubs
  services/       # ✅ Business logic implementations
contracts/        # 🔒 IMMUTABLE versioned YAML contracts  
templates/        # 📝 Contract templates
blueprints/       # 📋 Generated documentation
```

## 🛠 TECHNICAL GUIDELINES

### Code Generation:
- Use existing `src/services/generator.ts` for creating stubs
- Always include contract reference in generated file headers
- Generate TypeScript types from contract inputs/outputs

### Error Handling:
- Follow contract error specifications exactly
- Return structured error responses: `{ok: false, errors: [...]}`

### File Management:
- **Never manually create files in `/contracts/`** - use generator service
- **Use absolute paths** in Windows terminal commands
- **Respect .gitignore** - never commit `node_modules/`, `tmp/`, generated artifacts

## 🚨 RED FLAGS - STOP IMMEDIATELY IF:
- User wants to edit a contract instead of versioning
- Implementation starts before contracts are defined
- Manual editing of `src/generated/` files without proper trailer
- Seams are discovered mid-implementation (should be identified up-front)

## 💡 SDD ENFORCEMENT PHRASES:
- "Let's identify the seams first..."
- "We need a contract before implementing this..."
- "That file is auto-generated - let's regenerate instead..."
- "What boundaries does this feature cross?"

**Remember: This project IS the SDD tooling - we use SDD to build SDD. Lead by example!**
