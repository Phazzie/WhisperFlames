#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

const contractsDir = 'contracts';

function lintYaml() {
  if (!fs.existsSync(contractsDir)) {
    console.log('No contracts directory found - skipping YAML lint');
    return true;
  }

  const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.yml'));
  
  if (files.length === 0) {
    console.log('No YAML files found - skipping lint');
    return true;
  }

  const errors = [];

  for (const file of files) {
    const filePath = path.join(contractsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      yaml.parse(content);
      console.log(`✅ ${file} - valid YAML`);
    } catch (parseError) {
      errors.push(`${file}: ${parseError.message}`);
    }
  }

  if (errors.length > 0) {
    console.error('YAML lint failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }

  console.log(`✅ All ${files.length} YAML files are valid`);
  return true;
}

lintYaml();
