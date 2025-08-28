#!/usr/bin/env node

/**
 * Bootstrap script to generate CodeGenerationSeam stub from contract
 * 
 * This follows SDD principles:
 * 1. Generate FROM contract, not arbitrary implementation
 * 2. Use existing template system
 * 3. Contract-driven workflow
 */

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

console.log('🏗️  Generating CodeGenerationSeam stub from contract...');

// Read the contract
const contractPath = 'contracts/CodeGenerationSeam.contract.v1.yml';
const contractContent = fs.readFileSync(contractPath, 'utf8');
const contract = yaml.parse(contractContent);

// Read the TypeScript template
const templatePath = 'templates/typescript_stub.ts.template';
const template = fs.readFileSync(templatePath, 'utf8');

// Simple template replacement (basic Mustache functionality)
function simpleTemplate(template, data) {
  let result = template;
  
  // Simple variable replacement
  Object.entries(data).forEach(([key, value]) => {
    const pattern = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(pattern, String(value));
  });
  
  // Handle conditional sections (simplified)
  result = result.replace(/{{#dependencies}}[\s\S]*?{{\/dependencies}}/g, '');
  result = result.replace(/{{#errorTypes}}[\s\S]*?{{\/errorTypes}}/g, '');
  result = result.replace(/{{#inputProperties}}[\s\S]*?{{\/inputProperties}}/g, `
export interface ${contract.name}Input {
  operation: "generate_stub" | "generate_blueprint" | "generate_test" | "generate_all" | "validate_template" | "preview";
  contract: Record<string, unknown>;
  templateType?: "typescript" | "markdown" | "test" | "custom";
  options?: Record<string, unknown>;
  templateData?: Record<string, unknown>;
}
`);
  
  result = result.replace(/{{#outputProperties}}[\s\S]*?{{\/outputProperties}}/g, `
export interface ${contract.name}Output {
  files: Array<{
    path: string;
    content: string;
    type: "typescript" | "markdown" | "test" | "json" | "yaml";
    size: number;
    lines: number;
    checksum: string;
  }>;
  generation: {
    templateUsed: string;
    generatedAt: string;
    duration: number;
    contractHash: string;
    generatorVersion: string;
    warnings: Array<{
      type: string;
      message: string;
      line?: number;
    }>;
  };
  validation: {
    typescript: {
      compiles: boolean;
      errors: Array<{
        file: string;
        line: number;
        message: string;
      }>;
    };
    linting: {
      score: number;
      issues: Array<{
        severity: string;
        rule: string;
        message: string;
      }>;
    };
  };
  statistics: {
    totalFiles: number;
    totalLines: number;
    totalSize: number;
    filesByType: Record<string, number>;
    complexityScore: number;
  };
}
`);

  // Handle imports - remove section for now
  result = result.replace(/{{#imports}}[\s\S]*?{{\/imports}}/g, '');
  
  // Remove remaining mustache syntax
  result = result.replace(/{{[^}]*}}/g, '');
  
  return result;
}

// Template data
const templateData = {
  seamName: contract.name,
  version: contract.version,
  category: contract.category,
  description: contract.description,
  timestamp: new Date().toISOString(),
  contractFile: `contracts/${contract.name}.contract.${contract.version}.yml`,
  generatorVersion: '1.0.0',
  inputDescription: 'Code generation request with contract and options',
  validationErrorDescription: 'Input validation failed',
  processingErrorDescription: 'Code generation processing failed',
  successExampleInput: JSON.stringify(contract.examples[0].input, null, 2),
  successExampleOutput: JSON.stringify(contract.examples[0].output, null, 2)
};

// Generate the stub
const generatedCode = simpleTemplate(template, templateData);

// Ensure output directory exists
const outputDir = 'src/generated';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the generated stub
const outputPath = path.join(outputDir, 'CodeGenerationSeam.ts');
fs.writeFileSync(outputPath, generatedCode);

console.log(`✅ Generated: ${outputPath}`);
console.log('📋 Next: Implement template engine according to contract specifications');
