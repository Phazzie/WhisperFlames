#!/usr/bin/env node

/**
 * SDD Workflow Helper
 * Enforces Seam-Driven Development practices
 */

import fs from 'fs';

const commands = {
  'check-generated': checkGeneratedFiles,
  'validate-structure': validateProjectStructure,
  'seam-status': showSeamStatus
};

function checkGeneratedFiles() {
  const generatedDir = 'src/generated';
  if (!fs.existsSync(generatedDir)) {
    console.log('✅ No generated files yet');
    return;
  }

  const files = fs.readdirSync(generatedDir, { recursive: true });
  console.log(`🔍 Found ${files.length} generated files:`);
  files.forEach(file => console.log(`  - ${file}`));
}

function validateProjectStructure() {
  const requiredDirs = ['src/services', 'contracts', 'templates', 'blueprints'];
  const missing = requiredDirs.filter(dir => !fs.existsSync(dir));
  
  if (missing.length === 0) {
    console.log('✅ Project structure is SDD-compliant');
  } else {
    console.log('❌ Missing SDD directories:');
    missing.forEach(dir => console.log(`  - ${dir}`));
  }
}

function showSeamStatus() {
  const contractsDir = 'contracts';
  if (!fs.existsSync(contractsDir)) {
    console.log('📋 No seams defined yet');
    return;
  }

  const contracts = fs.readdirSync(contractsDir).filter(f => f.endsWith('.yml'));
  console.log(`📋 ${contracts.length} seams defined:`);
  contracts.forEach(contract => {
    const name = contract.replace('.contract.v1.yml', '');
    console.log(`  - ${name}`);
  });
}

const command = process.argv[2];
if (!command || !commands[command]) {
  console.log('SDD Helper Commands:');
  console.log('  check-generated   - Show auto-generated files');
  console.log('  validate-structure - Check SDD project structure');
  console.log('  seam-status       - Show defined seams');
  process.exit(1);
}

commands[command]();
