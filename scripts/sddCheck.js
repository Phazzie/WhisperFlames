#!/usr/bin/env node
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SDD Compliance Checker - Pre-Implementation Validation
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This script validates SDD compliance before any implementation work.
 * Run this before starting any new development to ensure contracts exist.
 * 
 * Usage: node scripts/sddCheck.js [feature-name]
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const CONTRACTS_DIR = 'contracts';
const GENERATED_DIR = 'src/generated';

class SddComplianceChecker {
  constructor() {
    this.violations = [];
    this.warnings = [];
  }

  async checkCompliance(featureName = null) {
    console.log('🛡️  SDD Compliance Check Starting...\n');

    await this.checkContractsExist();
    await this.checkGeneratedFileCompliance();
    await this.checkSeamFirstCompliance(featureName);
    
    this.reportResults();
    
    if (this.violations.length > 0) {
      console.log('\n❌ SDD VIOLATIONS DETECTED - Implementation blocked!');
      process.exit(1);
    } else {
      console.log('\n✅ SDD Compliance verified - Implementation may proceed');
    }
  }

  async checkContractsExist() {
    console.log('📋 Checking contracts directory...');
    
    try {
      const contracts = await fs.readdir(CONTRACTS_DIR);
      const ymlContracts = contracts.filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
      
      if (ymlContracts.length === 0) {
        this.violations.push('No contracts found in contracts/ directory');
      } else {
        console.log(`   ✅ Found ${ymlContracts.length} contracts: ${ymlContracts.join(', ')}`);
      }
    } catch (error) {
      this.violations.push('contracts/ directory not found or not accessible');
    }
  }

  async checkGeneratedFileCompliance() {
    console.log('🏭 Checking generated files compliance...');
    
    try {
      const generated = await fs.readdir(GENERATED_DIR);
      
      for (const file of generated) {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
          const filePath = path.join(GENERATED_DIR, file);
          const content = await fs.readFile(filePath, 'utf-8');
          
          // Check for Manual-Patch trailer if file exists
          if (!content.includes('Manual-Patch:') && !content.includes('Auto-Generated')) {
            this.violations.push(`File ${file} in src/generated/ missing Manual-Patch trailer or generation header`);
          }
        }
      }
      
      console.log(`   ✅ Checked ${generated.length} generated files`);
    } catch (error) {
      // Generated directory might not exist yet, that's ok
      console.log('   ℹ️  src/generated/ directory empty or not found (acceptable for new projects)');
    }
  }

  async checkSeamFirstCompliance(featureName) {
    if (!featureName) {
      console.log('💡 Seam-first check skipped (no feature name provided)');
      return;
    }
    
    console.log(`🔍 Checking seam-first compliance for feature: ${featureName}`);
    
    // Check if contract exists for this feature
    const expectedContract = `${featureName}Seam.contract.v1.yml`;
    const contractPath = path.join(CONTRACTS_DIR, expectedContract);
    
    try {
      await fs.access(contractPath);
      console.log(`   ✅ Contract found: ${expectedContract}`);
    } catch (error) {
      this.violations.push(`No contract found for feature '${featureName}' - expected ${expectedContract}`);
      this.violations.push('SDD Rule: Define contracts BEFORE implementation');
    }
  }

  reportResults() {
    console.log('\n📊 SDD Compliance Report:');
    console.log('─'.repeat(50));
    
    if (this.violations.length > 0) {
      console.log('❌ VIOLATIONS:');
      this.violations.forEach(v => console.log(`   • ${v}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('⚠️  WARNINGS:');
      this.warnings.forEach(w => console.log(`   • ${w}`));
    }
    
    if (this.violations.length === 0 && this.warnings.length === 0) {
      console.log('✅ No SDD violations detected');
    }
  }
}

// CLI Interface
const featureName = process.argv[2];
const checker = new SddComplianceChecker();

checker.checkCompliance(featureName).catch(error => {
  console.error('❌ SDD Compliance check failed:', error.message);
  process.exit(1);
});
