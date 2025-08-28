/**
 * SDD Core Types - Enhanced for Template System
 * These types define the structure of SDD entities and template data
 */

// Core SDD Entities
export interface Seam {
  name: string;
  description: string;
  type: 'api' | 'persistence' | 'computation' | 'integration' | 'ui';
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  confidence: number;
  rationale: string;
  ioHints?: {
    inputs: string[];
    outputs: string[];
  };
}

export interface Contract {
  name: string;
  version: string;
  versionDate: string;
  description: string;
  category: 'api' | 'persistence' | 'computation' | 'integration' | 'ui';
  inputs: ContractSchema;
  outputs: ContractSchema;
  errors: ContractError[];
  examples: ContractExample[];
  errorExamples?: ContractErrorExample[];
  dependencies?: ContractDependency[];
  metadata: ContractMetadata;
  // Legacy compatibility
  owner?: string;
}

export interface ContractSchema {
  request?: SchemaObject;
  success?: SchemaObject;
  error?: SchemaObject;
}

export interface SchemaObject {
  type: string;
  description?: string;
  required?: string[];
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  optional?: boolean;
  validation?: string;
}

export interface SchemaProperty {
  type: string;
  description?: string;
  optional?: boolean;
  validation?: string;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
}

export interface ContractError {
  code: string;
  name: string;
  description: string;
  httpStatus: number;
  retryable: boolean;
}

export interface ContractExample {
  name: string;
  description: string;
  input: Record<string, unknown>;
  output: {
    ok: true;
    data: Record<string, unknown>;
  };
  // Legacy compatibility
  in?: Record<string, any>;
  out?: Record<string, any>;
}

export interface ContractErrorExample {
  name: string;
  description: string;
  input: Record<string, unknown>;
  output: {
    ok: false;
    errors: Array<{
      code: string;
      message: string;
      details?: Record<string, unknown>;
    }>;
  };
}

export interface ContractDependency {
  seam: string;
  version: string;
  type: 'required' | 'optional' | 'dev';
}

export interface ContractMetadata {
  generatedBy: string;
  lastModified: string;
  tags: string[];
  stability: 'experimental' | 'stable' | 'deprecated';
}

// Template Data Structures
export interface TemplateData {
  // Contract metadata
  seamName: string;
  version: string;
  versionDate: string;
  description: string;
  category: string;
  timestamp: string;
  contractFile: string;
  generatorVersion: string;
  stability: string;
  tags: string[];

  // Schema properties
  requiredInputs: string[];
  inputProperties: TemplateProperty[];
  outputProperties: TemplateProperty[];
  
  // Errors
  errorTypes: TemplateError[];
  
  // Examples
  examples: TemplateExample[];
  errorExamples: TemplateErrorExample[];
  
  // Dependencies
  dependencies: TemplateDependency[];
  
  // Generated content
  successExampleInput: string;
  successExampleOutput: string;
  
  // Template-specific
  imports?: TemplateImport[];
}

export interface TemplateProperty {
  name: string;
  type: string;
  description?: string;
  optional?: boolean;
  validation?: string;
  properties?: TemplateProperty[];
  hasNext?: boolean;
}

export interface TemplateError {
  code: string;
  name: string;
  description: string;
  httpStatus: number;
  retryable: boolean;
  hasNext?: boolean;
}

export interface TemplateExample {
  name: string;
  description: string;
  inputData: string; // JSON string
  outputData: string; // JSON string
  inputJson?: string; // Formatted JSON for docs
  outputJson?: string; // Formatted JSON for docs
  hasNext?: boolean;
}

export interface TemplateErrorExample {
  name: string;
  description: string;
  inputData: string;
  inputJson?: string;
  errorCode: string;
  errorMessage: string;
  hasNext?: boolean;
}

export interface TemplateDependency {
  seamName: string;
  version: string;
  type: string;
  required?: boolean;
  hasNext?: boolean;
}

export interface TemplateImport {
  types: string;
  module: string;
}

// API Response Types
export interface APIResponse<T = unknown> {
  ok: boolean;
  data?: T;
  errors?: Array<{
    code: string;
    message: string;
    details?: Record<string, unknown>;
  }>;
}

// Cache Types
export interface PRDCache {
  requirements?: string;
  content?: string; // Legacy compatibility
  timestamp: string;
  seams?: Seam[];
  contracts?: string[];
  analysis?: {
    summary: string;
    features: string[];
    technical_requirements: string[];
  };
}

// Generation Types
export interface GenerationResult {
  generated: GeneratedFile[];
  errors: string[];
  warnings: string[];
}

export interface GeneratedFile {
  path: string;
  content: string;
  type: 'typescript' | 'markdown' | 'yaml' | 'json';
  contractReference?: string;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  file: string;
  field?: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  file: string;
  field?: string;
  message: string;
  suggestion?: string;
}

// Template Engine Types
export interface TemplateEngine {
  render(template: string, data: TemplateData): string;
  renderFile(templatePath: string, data: TemplateData): string;
  registerPartial(name: string, template: string): void;
  registerHelper(name: string, helper: Function): void;
}
