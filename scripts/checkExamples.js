#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const contractsDir = 'contracts';

function checkExamples() {
  if (!fs.existsSync(contractsDir)) {
    console.log('No contracts directory found - skipping check');
    return true;
  }

  const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.yml'));
  
  if (files.length === 0) {
    console.log('No contract files found - skipping check');
    return true;
  }

  const errors = [];

  for (const file of files) {
    const filePath = path.join(contractsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const contract = yaml.parse(content);
      
      // Basic schema validation
      if (!contract.name) {
        errors.push(`${file}: Missing 'name' field`);
      }
      if (!contract.version) {
        errors.push(`${file}: Missing 'version' field`);
      }
      if (!contract.examples || !Array.isArray(contract.examples)) {
        errors.push(`${file}: Missing 'examples' array`);
      } else if (contract.examples.length === 0) {
        errors.push(`${file}: Must have at least one example`);
      }
    } catch (parseError) {
      errors.push(`${file}: YAML parse error - ${parseError.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('Contract validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✅ All ${files.length} contracts validated successfully`);
  return true;
}

checkExamples();
