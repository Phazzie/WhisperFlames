# SDD Helper Prompt - For New Chat Sessions

**COPY AND PASTE THIS PROMPT TO START NEW SDD CHAT SESSIONS:**

---

You are working on a Seam-Driven Development (SDD) proof-of-concept project. Here's what you need to know:

## **📋 CONTEXT FILES - READ THESE FIRST:**
1. `PROJECT_TURNOVER.md` - Complete current state and context
2. `PROJECT_CHECKLIST.md` - 160+ item checklist (currently 91/160 complete, Phase 6B.1)
3. `LESSONS_LEARNED.md` - Critical insights about SDD methodology
4. `.github/copilot-instructions.md` - SDD guardrails and enforcement rules

## **🎯 CURRENT TASK:**
**Phase 6B.1:** Build template engine following CodeGenerationSeam.contract.v1.yml
- **CRITICAL:** Must generate stub FROM contract first, then implement
- **VIOLATION:** Previous attempt created arbitrary implementation without consulting contract
- **APPROACH:** Contract-driven development, not arbitrary interface design

## **🚧 SDD ENFORCEMENT - FOLLOW THESE RULES:**

### **BEFORE ANY CODE:**
```bash
npm run sdd:safe  # Verify compliance
```
**Ask yourself:**
1. What contracts govern this feature?
2. Do I need to generate stubs from contracts first?
3. What checklist phase are we in?
4. Am I following contract-driven workflow?

### **SDD PRINCIPLES:**
- ✅ **NO CODE UNTIL CONTRACTS EXIST** - Check contracts/ directory first
- ✅ **GENERATE FROM CONTRACTS** - Use existing contract specifications  
- ✅ **src/generated/ IS READ-ONLY** - Manual edits need Manual-Patch trailer
- ✅ **contracts/ IS IMMUTABLE** - Version up (v1→v2), never edit existing

### **RED FLAGS - STOP IF YOU SEE THESE:**
- Creating implementation without consulting existing contracts
- Arbitrary interface design instead of contract-driven development
- Editing files in src/generated/ without Manual-Patch trailer
- Skipping checklist validation steps

## **🎯 PROJECT GOAL:**
Complete 5-endpoint SDD workflow demonstrating:
- Requirements processing ✅ (complete)
- Seam detection 🔄 (in progress)  
- Contract generation 🔄 (in progress)
- Contract validation 🔄 (in progress)
- Code generation 🔄 (in progress)

## **📁 KEY DIRECTORIES:**
- `contracts/` - 5 complete YAML contracts (IMMUTABLE)
- `src/generated/` - Auto-generated code (READ-ONLY)
- `src/services/` - Business logic (editable)
- `templates/` - Mustache templates for generation

## **🚨 COMPLIANCE CHECKING:**
If asked to implement anything, first run:
1. `npm run sdd:safe` - Full compliance check
2. Check relevant contracts in contracts/ directory
3. Verify checklist phase requirements
4. Generate stubs FROM contracts if needed

## **💡 KEY INSIGHT:**
This project is discovering that **manual SDD enforcement doesn't scale**. We're completing the proof-of-concept while documenting lessons learned for automated SDD 2.0 tooling.

## **🎯 IMMEDIATE NEXT STEP:**
Read `CodeGenerationSeam.contract.v1.yml`, generate TypeScript stub from it using templates, then implement according to contract specifications (not arbitrary design).

---

**Remember: Follow SDD methodology strictly, but also document when it's impractical so we can design better automation. The goal is proving concepts work while identifying what needs to be automated for real-world adoption.**
