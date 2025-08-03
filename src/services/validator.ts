import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { Contract } from '../types.js';

/**
 * Validate YAML contracts and check for required examples
 */
export function validateContracts(): { pass: boolean; errors: string[] } {
  const errors: string[] = [];
  const contractsDir = 'contracts';

  if (!fs.existsSync(contractsDir)) {
    return { pass: true, errors: [] }; // No contracts to validate
  }

  const files = fs.readdirSync(contractsDir).filter(f => f.endsWith('.yml'));
  
  if (files.length === 0) {
    return { pass: true, errors: [] }; // No contracts to validate
  }

  for (const file of files) {
    const filePath = path.join(contractsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');
    
    try {
      const contract: Contract = yaml.parse(content);
      
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
      
      // Validate examples structure
      if (contract.examples) {
        contract.examples.forEach((example, idx) => {
          if (!example.in || typeof example.in !== 'object') {
            errors.push(`${file}: Example ${idx + 1} missing 'in' object`);
          }
          if (!example.out || typeof example.out !== 'object') {
            errors.push(`${file}: Example ${idx + 1} missing 'out' object`);
          }
        });
      }
      
    } catch (parseError) {
      errors.push(`${file}: YAML parse error - ${parseError.message}`);
    }
  }

  return {
    pass: errors.length === 0,
    errors
  };
}
