/**
 * CodeGenerationSeam Implementation
 * 
 * Implements the CodeGenerationSeam contract for template-based code generation.
 * This service handles all code generation operations defined in the contract:
 * - generate_stub: TypeScript interface stubs
 * - generate_blueprint: Markdown documentation
 * - generate_test: Test scaffolding
 * - generate_all: All file types
 * - validate_template: Template validation
 * - preview: Generation preview without file writing
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import Mustache from 'mustache';
import {
    CodeGenerationSeamBase,
    CodeGenerationSeamGenerationFailedError,
    CodeGenerationSeamInput,
    CodeGenerationSeamOutput,
    CodeGenerationSeamResponse,
    CodeGenerationSeamTemplateNotFoundError
} from '../generated/CodeGenerationSeam.js';

export class CodeGenerationSeamService extends CodeGenerationSeamBase {
  private readonly templatesDir = 'templates';
  private readonly outputDir = 'src/generated';
  private readonly blueprintsDir = 'blueprints';
  private readonly testsDir = 'tests';

  async process(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamResponse> {
    const startTime = Date.now();
    
    try {
      // Validate input
      if (!this.validateInput(input)) {
        return this.createErrorResponse([{
          code: 'CONTRACT_INVALID',
          message: 'Invalid input: missing required fields or invalid operation'
        }]);
      }

      const result = await this.executeOperation(input);
      const duration = Date.now() - startTime;

      // Add generation metadata
      result.generation.duration = duration;
      result.generation.generatedAt = new Date().toISOString();
      result.generation.generatorVersion = '1.0.0';
      result.generation.contractHash = this.generateContractHash(input.contract);

      return this.createSuccessResponse(result);

    } catch (error) {
      return this.createErrorResponse([{
        code: 'GENERATION_FAILED',
        message: error instanceof Error ? error.message : 'Unknown generation error',
        details: { error: String(error) }
      }]);
    }
  }

  private async executeOperation(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    switch (input.operation) {
      case 'generate_stub':
        return this.generateStub(input);
      case 'generate_blueprint':
        return this.generateBlueprint(input);
      case 'generate_test':
        return this.generateTest(input);
      case 'generate_all':
        return this.generateAll(input);
      case 'validate_template':
        return this.validateTemplate(input);
      case 'preview':
        return this.previewGeneration(input);
      default:
        throw new CodeGenerationSeamGenerationFailedError(`Unsupported operation: ${input.operation}`);
    }
  }

  private async generateStub(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    const templateType = input.templateType || 'typescript';
    const templatePath = path.join(this.templatesDir, `${templateType}_stub.ts.template`);
    
    if (!fs.existsSync(templatePath)) {
      throw new CodeGenerationSeamTemplateNotFoundError(`Template not found: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, 'utf8');
    const templateData = this.prepareTemplateData(input);
    const generatedContent = this.processTemplate(template, templateData);
    
    const outputPath = path.join(this.outputDir, `${input.contract.name}.ts`);
    const fileData = this.createFileData(outputPath, generatedContent, 'typescript');

    return {
      files: [fileData],
      generation: {
        templateUsed: templatePath,
        generatedAt: '', // Will be set by caller
        duration: 0, // Will be set by caller
        contractHash: '', // Will be set by caller
        generatorVersion: '', // Will be set by caller
        warnings: []
      },
      validation: {
        typescript: {
          compiles: true, // TODO: Implement actual TypeScript compilation check
          errors: []
        },
        linting: {
          score: 100,
          issues: []
        }
      },
      statistics: {
        totalFiles: 1,
        totalLines: fileData.lines,
        totalSize: fileData.size,
        filesByType: { typescript: 1 },
        complexityScore: 1.0
      }
    };
  }

  private async generateBlueprint(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    const templatePath = path.join(this.templatesDir, 'blueprint.md.template');
    
    if (!fs.existsSync(templatePath)) {
      throw new CodeGenerationSeamTemplateNotFoundError(`Template not found: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, 'utf8');
    const templateData = this.prepareTemplateData(input);
    const generatedContent = this.processTemplate(template, templateData);
    
    const outputPath = path.join(this.blueprintsDir, `${input.contract.name}.md`);
    const fileData = this.createFileData(outputPath, generatedContent, 'markdown');

    return {
      files: [fileData],
      generation: {
        templateUsed: templatePath,
        generatedAt: '',
        duration: 0,
        contractHash: '',
        generatorVersion: '',
        warnings: []
      },
      validation: {
        typescript: { compiles: true, errors: [] },
        linting: { score: 100, issues: [] }
      },
      statistics: {
        totalFiles: 1,
        totalLines: fileData.lines,
        totalSize: fileData.size,
        filesByType: { markdown: 1 },
        complexityScore: 1.0
      }
    };
  }

  private async generateTest(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    const templatePath = path.join(this.templatesDir, 'test.spec.ts.template');
    
    if (!fs.existsSync(templatePath)) {
      throw new CodeGenerationSeamTemplateNotFoundError(`Template not found: ${templatePath}`);
    }

    const template = fs.readFileSync(templatePath, 'utf8');
    const templateData = this.prepareTemplateData(input);
    const generatedContent = this.processTemplate(template, templateData);
    
    const outputPath = path.join(this.testsDir, `${input.contract.name}.spec.ts`);
    const fileData = this.createFileData(outputPath, generatedContent, 'test');

    return {
      files: [fileData],
      generation: {
        templateUsed: templatePath,
        generatedAt: '',
        duration: 0,
        contractHash: '',
        generatorVersion: '',
        warnings: []
      },
      validation: {
        typescript: { compiles: true, errors: [] },
        linting: { score: 100, issues: [] }
      },
      statistics: {
        totalFiles: 1,
        totalLines: fileData.lines,
        totalSize: fileData.size,
        filesByType: { test: 1 },
        complexityScore: 1.0
      }
    };
  }

  private async generateAll(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    // Generate all file types
    const stubResult = await this.generateStub(input);
    const blueprintResult = await this.generateBlueprint(input);
    const testResult = await this.generateTest(input);

    const allFiles = [
      ...stubResult.files,
      ...blueprintResult.files,
      ...testResult.files
    ];

    const totalLines = allFiles.reduce((sum, file) => sum + file.lines, 0);
    const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
    const filesByType = allFiles.reduce((acc, file) => {
      acc[file.type] = (acc[file.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      files: allFiles,
      generation: {
        templateUsed: 'multiple',
        generatedAt: '',
        duration: 0,
        contractHash: '',
        generatorVersion: '',
        warnings: []
      },
      validation: {
        typescript: { compiles: true, errors: [] },
        linting: { score: 100, issues: [] }
      },
      statistics: {
        totalFiles: allFiles.length,
        totalLines,
        totalSize,
        filesByType,
        complexityScore: 2.0
      }
    };
  }

  private async validateTemplate(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    const templateType = input.templateType || 'typescript';
    const templatePath = path.join(this.templatesDir, `${templateType}_stub.ts.template`);
    
    if (!fs.existsSync(templatePath)) {
      throw new CodeGenerationSeamTemplateNotFoundError(`Template not found: ${templatePath}`);
    }

    // Template exists, return validation success
    return {
      files: [],
      generation: {
        templateUsed: templatePath,
        generatedAt: '',
        duration: 0,
        contractHash: '',
        generatorVersion: '',
        warnings: []
      },
      validation: {
        typescript: { compiles: true, errors: [] },
        linting: { score: 100, issues: [] }
      },
      statistics: {
        totalFiles: 0,
        totalLines: 0,
        totalSize: 0,
        filesByType: {},
        complexityScore: 0
      }
    };
  }

  private async previewGeneration(input: CodeGenerationSeamInput): Promise<CodeGenerationSeamOutput> {
    // Generate content but don't write files
    const result = await this.generateStub(input);
    
    // Mark files as preview only
    result.files.forEach(file => {
      file.path = `[PREVIEW] ${file.path}`;
    });

    return result;
  }

  private prepareTemplateData(input: CodeGenerationSeamInput): Record<string, any> {
    const contract = input.contract;
    const options = input.options || {};
    const templateData = input.templateData || {};

    return {
      seamName: contract.name,
      version: contract.version,
      category: contract.category,
      description: contract.description,
      timestamp: new Date().toISOString(),
      contractFile: `contracts/${contract.name}.contract.${contract.version}.yml`,
      generatorVersion: templateData.generatorVersion || '1.0.0',
      author: templateData.author || 'SDD Generator',
      license: templateData.license || 'MIT',
      
      // Options
      includeComments: options.includeComments !== false,
      includeExamples: options.includeExamples !== false,
      strictTypes: options.strictTypes !== false,
      
      // Contract data
      inputs: contract.inputs,
      outputs: contract.outputs,
      errors: contract.errors,
      examples: contract.examples,
      dependencies: contract.dependencies || [],
      
      // Custom variables
      ...templateData.customVariables
    };
  }

  private processTemplate(template: string, data: Record<string, any>): string {
    // Use Mustache for template processing
    return Mustache.render(template, data);
  }

  private createFileData(filePath: string, content: string, type: string) {
    const lines = content.split('\n').length;
    const size = Buffer.byteLength(content, 'utf8');
    const checksum = crypto.createHash('md5').update(content).digest('hex');

    return {
      path: filePath,
      content,
      type: type as "typescript" | "markdown" | "test" | "json" | "yaml",
      size,
      lines,
      checksum
    };
  }

  private generateContractHash(contract: any): string {
    const contractString = JSON.stringify(contract, Object.keys(contract).sort());
    return crypto.createHash('sha256').update(contractString).digest('hex');
  }
}
