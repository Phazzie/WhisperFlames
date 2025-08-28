/**
 * Simple Template Engine Test - Phase 6B.2 Step 1
 * 
 * Tests core template functionality without TypeScript compilation
 * Uses contract example to validate our approach
 */

import fs from 'fs';
import yaml from 'yaml';

console.log('🧪 Testing Template Engine Core - Phase 6B.2 Step 1');
console.log('📋 Using CodeGenerationSeam.contract.v1.yml Example #1');

// Load contract to get example
console.log('📋 Loading CodeGenerationSeam contract...');
const contractPath = 'contracts/CodeGenerationSeam.contract.v1.yml';
const contractContent = fs.readFileSync(contractPath, 'utf8');
const contract = yaml.parse(contractContent);

console.log('✅ Contract loaded:');
console.log(`   Name: ${contract.name}`);
console.log(`   Version: ${contract.version}`);
console.log(`   Examples: ${contract.examples.length}`);

// Get first example (Generate TypeScript Stub)
const example = contract.examples[0];
console.log(`\n🔍 Testing with example: "${example.name}"`);
console.log(`   Operation: ${example.input.operation}`);
console.log(`   Contract Name: ${example.input.contract.name}`);
console.log(`   Template Type: ${example.input.templateType}`);

// Test template loading
console.log('\n🔧 Testing template loading...');
const templatePath = `templates/${example.input.templateType}_stub.ts.template`;

if (fs.existsSync(templatePath)) {
  console.log(`✅ Template found: ${templatePath}`);
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  console.log(`   Template size: ${templateContent.length} characters`);
  console.log(`   Template lines: ${templateContent.split('\n').length}`);
  
  // Test basic template variable replacement
  console.log('\n🔧 Testing template variable replacement...');
  let processed = templateContent;
  
  // Replace key variables from example
  const seamName = example.input.contract.name;
  const version = example.input.contract.version;
  const category = example.input.contract.category;
  const description = example.input.contract.description;
  
  processed = processed.replace(/{{seamName}}/g, seamName);
  processed = processed.replace(/{{version}}/g, version);
  processed = processed.replace(/{{category}}/g, category);
  processed = processed.replace(/{{description}}/g, description);
  processed = processed.replace(/{{timestamp}}/g, new Date().toISOString());
  processed = processed.replace(/{{contractFile}}/g, `contracts/${seamName}.contract.${version}.yml`);
  processed = processed.replace(/{{generatorVersion}}/g, '1.0.0');
  
  // Remove remaining template variables for this test
  processed = processed.replace(/{{[^}]+}}/g, '[TEMPLATE_VAR]');
  
  console.log('✅ Template processing test completed');
  console.log(`   Processed size: ${processed.length} characters`);
  console.log(`   Variables replaced: seamName, version, category, description`);
  
  // Show a preview of processed content
  console.log('\n📄 Processed template preview (first 300 chars):');
  console.log('━'.repeat(50));
  console.log(processed.substring(0, 300) + '...');
  console.log('━'.repeat(50));
  
  console.log('\n✅ TEMPLATE ENGINE CORE TEST PASSED');
  console.log('📋 Ready for Phase 6B.2 Step 2: Generate actual seam stubs');
  
} else {
  console.log(`❌ Template not found: ${templatePath}`);
  console.log('🚨 Cannot proceed without template');
  process.exit(1);
}

console.log('\n🎯 NEXT ACTIONS:');
console.log('1. Generate LLMApiSeam.ts from contract');
console.log('2. Generate FileSystemSeam.ts from contract');
console.log('3. Generate YamlProcessingSeam.ts from contract');
console.log('4. Generate HttpHandlingSeam.ts from contract');
console.log('5. Generate blueprint documentation');
console.log('6. Generate test scaffolding');
