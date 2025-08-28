import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Seam } from '../types.js';

/**
 * Generate YAML contracts from seams using the contract template
 */
export function generateContracts(seams: Seam[]): string[] {
  const templatePath = 'templates/contract_stub.yml';
  const contractsDir = 'contracts';
  const generatedFiles: string[] = [];

  if (!fs.existsSync(templatePath)) {
    throw new Error('Contract template not found');
  }

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  const template = fs.readFileSync(templatePath, 'utf8');

  for (const seam of seams) {
    const contract = template
      .replace(/<SEAM_NAME>/g, seam.name)
      .replace(/<ISO_TIMESTAMP>/g, new Date().toISOString());

    // Parse and enhance with ioHints
    const contractObj = yaml.parse(contract);
    
    // Pre-seed inputs and outputs from ioHints
    contractObj.inputs = {};
    seam.ioHints.inputs.forEach(input => {
      contractObj.inputs[input] = {
        type: 'string',
        description: `TODO: describe ${input}`
      };
    });

    contractObj.outputs = {};
    seam.ioHints.outputs.forEach(output => {
      contractObj.outputs[output] = {
        type: 'string', 
        description: `TODO: describe ${output}`
      };
    });

    // Update description
    contractObj.description = seam.description;

    const fileName = `${seam.name}.contract.v1.yml`;
    const filePath = path.join(contractsDir, fileName);
    
    fs.writeFileSync(filePath, yaml.stringify(contractObj, { indent: 2 }));
    generatedFiles.push(fileName);
  }

  return generatedFiles;
}

/**
 * Generate TypeScript code stubs for seams
 */
export function generateCodeStubs(seams: Seam[]): { generated: boolean; files: string[] } {
  const generatedDir = 'src/generated';
  const generatedFiles: string[] = [];

  if (!fs.existsSync(generatedDir)) {
    fs.mkdirSync(generatedDir, { recursive: true });
  }

  for (const seam of seams) {
    const seamDir = path.join(generatedDir, seam.name);
    if (!fs.existsSync(seamDir)) {
      fs.mkdirSync(seamDir, { recursive: true });
    }

    // Generate TypeScript interfaces
    const inputType = seam.ioHints.inputs.map(input => 
      `  ${input}: any; // TODO: define proper type`
    ).join('\n');
    
    const outputType = seam.ioHints.outputs.map(output =>
      `  ${output}: any; // TODO: define proper type`
    ).join('\n');

    const stub = `/**
 * ${seam.name} Stub  🚧 AUTO-GENERATED
 * Contract: contracts/${seam.name}.contract.v1.yml
 *
 * Add business logic ONLY inside TODO blocks.
 * Commit trailer required when patching:
 *   Manual-Patch: ${seam.name}
 */

export type ${seam.name}Input = {
${inputType}
};

export type ${seam.name}Output = {
${outputType}
};

export async function ${seam.name}(input: ${seam.name}Input): Promise<${seam.name}Output> {
  // TODO implement
  throw new Error('${seam.name} not implemented');
}
`;

    const stubPath = path.join(seamDir, 'index.ts');
    fs.writeFileSync(stubPath, stub);
    generatedFiles.push(stubPath);
  }

  return { generated: true, files: generatedFiles };
}

/**
 * Generate blueprint files for seams
 */
export function generateBlueprints(seams: Seam[]): string[] {
  const blueprintsDir = 'blueprints';
  const generatedFiles: string[] = [];

  if (!fs.existsSync(blueprintsDir)) {
    fs.mkdirSync(blueprintsDir, { recursive: true });
  }

  for (const seam of seams) {
    // Generate markdown overview
    const mdContent = `# ${seam.name} Blueprint

## Overview
${seam.description}

## Type
${seam.type}

## Inputs
${seam.ioHints.inputs.map(input => `- ${input}`).join('\n')}

## Outputs  
${seam.ioHints.outputs.map(output => `- ${output}`).join('\n')}

## Implementation Notes
TODO: Add implementation details

## Diagram
See [${seam.name}.mmd](${seam.name}.mmd) for the Mermaid diagram.
`;

    const mdPath = path.join(blueprintsDir, `${seam.name}.md`);
    fs.writeFileSync(mdPath, mdContent);
    generatedFiles.push(mdPath);

    // Generate Mermaid diagram scaffold
    const mmdContent = `graph TD
    A[Input: ${seam.ioHints.inputs.join(', ')}] --> B[${seam.name}]
    B --> C[Output: ${seam.ioHints.outputs.join(', ')}]
    
    %% TODO: Add detailed flow diagram
`;

    const mmdPath = path.join(blueprintsDir, `${seam.name}.mmd`);
    fs.writeFileSync(mmdPath, mmdContent);
    generatedFiles.push(mmdPath);
  }

  return generatedFiles;
}
