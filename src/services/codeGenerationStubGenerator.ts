/**
 * Temporary Generator for CodeGenerationSeam Stub
 * 
 * This is a bootstrap generator to create the initial CodeGenerationSeam stub
 * from its contract. Once the stub is generated, we'll implement the full
 * template engine using the contract specifications.
 * 
 * SDD Compliance:
 * - Generates FROM contract, not arbitrary implementation
 * - Uses existing template system
 * - Follows contract-driven workflow
 */

import fs from 'fs';
import Mustache from 'mustache';
import path from 'path';
import yaml from 'yaml';

export function generateCodeGenerationSeamStub(): void {
  console.log('🏗️  Generating CodeGenerationSeam stub from contract...');
  
  // Read the contract
  const contractPath = 'contracts/CodeGenerationSeam.contract.v1.yml';
  const contractContent = fs.readFileSync(contractPath, 'utf8');
  const contract = yaml.parse(contractContent);
  
  // Read the TypeScript template
  const templatePath = 'templates/typescript_stub.ts.template';
  const template = fs.readFileSync(templatePath, 'utf8');
  
  // Transform contract data for Mustache template
  const templateData = {
    seamName: contract.name,
    version: contract.version,
    category: contract.category,
    description: contract.description,
    timestamp: new Date().toISOString(),
    contractFile: `contracts/${contract.name}.contract.${contract.version}.yml`,
    generatorVersion: '1.0.0',
    
    // Input types from contract
    inputProperties: [{
      propertyName: '',
      properties: Object.entries(contract.inputs.request.properties).map(([name, prop]: [string, any]) => ({
        name,
        type: mapYamlTypeToTypeScript(prop),
        optional: !contract.inputs.request.required?.includes(name),
        description: prop.description
      }))
    }],
    
    // Output types from contract
    outputProperties: [{
      propertyName: '',
      properties: Object.entries(contract.outputs.success.properties.data.properties).map(([name, prop]: [string, any]) => ({
        name,
        type: mapYamlTypeToTypeScript(prop),
        optional: true,
        description: prop.description
      }))
    }],
    
    // Error types
    errorTypes: contract.errors.map((error: any) => ({
      name: error.name.replace('Error', '').replace(contract.name, ''),
      code: error.code,
      httpStatus: error.httpStatus,
      retryable: error.retryable
    })),
    
    // Dependencies
    dependencies: contract.dependencies?.map((dep: any) => ({
      seamName: dep.seam,
      version: dep.version,
      type: dep.type,
      hasNext: false
    })) || [],
    
    // Examples from contract
    successExampleInput: JSON.stringify(contract.examples[0].input, null, 2),
    successExampleOutput: JSON.stringify(contract.examples[0].output, null, 2),
    
    errorExamples: contract.errorExamples?.map((example: any, index: number, array: any[]) => ({
      name: example.name,
      inputData: JSON.stringify(example.input, null, 2),
      errorCode: example.output.errors[0].code,
      hasNext: index < array.length - 1
    })) || []
  };
  
  // Add hasNext flags for proper comma handling
  if (templateData.errorTypes.length > 0) {
    templateData.errorTypes.forEach((error, index) => {
      (error as any).hasNext = index < templateData.errorTypes.length - 1;
    });
  }
  
  if (templateData.dependencies.length > 0) {
    templateData.dependencies.forEach((dep, index) => {
      dep.hasNext = index < templateData.dependencies.length - 1;
    });
  }
  
  // Generate the stub
  const generatedCode = Mustache.render(template, templateData);
  
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
}

function mapYamlTypeToTypeScript(yamlProperty: any): string {
  if (yamlProperty.type === 'object') {
    return 'Record<string, unknown>';
  }
  if (yamlProperty.type === 'array') {
    return 'unknown[]';
  }
  if (yamlProperty.enum) {
    return yamlProperty.enum.map((v: string) => `"${v}"`).join(' | ');
  }
  
  switch (yamlProperty.type) {
    case 'string': return 'string';
    case 'number': return 'number';
    case 'integer': return 'number';
    case 'boolean': return 'boolean';
    default: return 'unknown';
  }
}
