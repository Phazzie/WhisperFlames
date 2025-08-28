# Seam-Driven Development (SDD) Proof of Concept

A TypeScript MCP server demonstrating Seam-Driven Development methodology with complete guardrails and automation.

## � SDD Workflow (ENFORCED)

### 1. **Identify Seams First**
```bash
npm run sdd:seams
# OR
curl -X POST http://localhost:3333/seams -H "Content-Type: application/json" -d '{"requirements": "your requirements"}'
```

### 2. **Generate Contracts**
```bash
npm run sdd:contracts
# OR  
curl -X POST http://localhost:3333/contracts -H "Content-Type: application/json" -d '{"seams": [...]}'
```

### 3. **Validate Everything**
```bash
npm run sdd:validate
```

### 4. **Generate Code Stubs**
```bash
npm run sdd:generate
```

## 📁 SDD Project Structure

```
src/
  generated/      🚧 READ-ONLY auto-generated stubs
  services/       ✅ Business logic implementations
contracts/        🔒 IMMUTABLE versioned YAML contracts  
templates/        📝 Contract templates
blueprints/       📋 Generated documentation
scripts/          🛠 SDD automation helpers
.vscode/          🎯 VS Code SDD tasks
```

## 🛡️ Built-in Guardrails

### **Pre-commit Hooks (Husky)**
- ❌ Blocks contract edits (forces versioning)
- ❌ Blocks manual edits to `src/generated/` without `Manual-Patch:` trailer
- ✅ Validates YAML syntax
- ✅ Validates contract examples

### **VS Code Tasks**
- `Ctrl+Shift+P` → "Tasks: Run Task"
- **SDD: Start Server** - Launches development server
- **SDD: Validate Contracts** - Runs full validation
- **SDD: Check Structure** - Validates SDD compliance

### **NPM Scripts**
```bash
npm run sdd:status      # Show defined seams
npm run sdd:check       # Validate project structure  
npm run sdd:validate    # Full contract validation
npm run sdd:help        # Show SDD commands
```

## 🚀 Quick Start

1. **Install & Setup**
   ```bash
   npm install
   npm run sdd:check
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   # Server runs on http://localhost:3333
   ```

3. **Follow SDD Workflow**
   ```bash
   npm run sdd:help
   ```

## 🔍 API Endpoints

- `POST /requirements` - Cache requirements analysis ✅
- `POST /seams` - Detect boundaries in requirements 🚧
- `POST /contracts` - Generate YAML contracts from seams 🚧  
- `POST /validate` - Validate contract schemas & examples 🚧
- `POST /generate` - Generate TypeScript stubs & docs 🚧

## 🚨 SDD Rules (AUTO-ENFORCED)

1. **Seams First** - No implementation without boundary identification
2. **Contracts Before Code** - All seams must have contracts
3. **Generation Over Editing** - Auto-generate instead of manual coding
4. **Immutable Contracts** - Version up (v2, v3...) instead of editing
5. **Validation Always** - Every commit validates contracts

## � Development

**This project uses SDD to build SDD** - we follow our own methodology:

- Identify seams before implementing endpoints
- Create contracts for each endpoint 
- Generate TypeScript stubs from contracts
- Implement business logic in services/
- Validate before every commit

## 📝 Manual Override

If you must manually edit generated files:

```bash
git commit -m "Fix: endpoint bug

Manual-Patch: YourSeamName"
```

The `Manual-Patch:` trailer tells the system this is intentional.
