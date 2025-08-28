/**
 * Test Template Engine - Phase 6B.2 Step 1
 * 
 * SDD Compliance:
 * - Uses CodeGenerationSeam.contract.v1.yml example #1 exactly
 * - Tests our own template engine with contract specifications
 * - Validates output matches expected format from contract
 */

// Ensure this path matches the compiled JS output location
import { CodeGenerationSeamService } from './src/services/codeGenerationSeam.js';
// Note: Using runtime type checking instead of TypeScript import types

console.log('🧪 Testing Template Engine - Phase 6B.2 Step 1');
console.log('📋 Using CodeGenerationSeam.contract.v1.yml Example #1');

// EXACT input from contract example - NO modifications
const contractExample = {
  operation: "generate_stub",
  contract: {
    name: "UserSeam",
    version: "v1",
    description: "User management seam",
    category: "api",
    inputs: {
      request: {
        type: "object",
        required: ["operation"],
        properties: {
          operation: { type: "string" },
          userId: { type: "string" }
        }
      }
    },
    outputs: {
      success: {
        type: "object",
        properties: {
          user: { type: "object" }
        }
      }
    },
    errors: [
      {
        code: "USER_NOT_FOUND",
        name: "UserNotFoundError",
        description: "User not found"
      }
    ],
    examples: [
      {
        name: "Get user",
        input: { operation: "get", userId: "123" },
        output: { ok: true, data: { user: { id: "123", name: "John" } } }
      }
    ]
  },
  templateType: "typescript",
  options: {
    includeComments: true,
    strictTypes: true,
    generateInterfaces: true
  }
};

async function testTemplateEngine() {
  try {
    console.log('🔧 Initializing CodeGenerationSeamService...');
    const service = new CodeGenerationSeamService();

    console.log('🔧 Processing contract example...');
    const result = await service.process(contractExample);

    console.log('✅ Template engine test results:');
    
    if (result.ok) {
      console.log(`📁 Files generated: ${result.data.files.length}`);
      console.log(`📊 Total lines: ${result.data.statistics.totalLines}`);
      console.log(`📊 Total size: ${result.data.statistics.totalSize} bytes`);
      console.log(`⏱️  Duration: ${result.data.generation.duration}ms`);
      console.log(`📋 Template used: ${result.data.generation.templateUsed}`);
      
      // Show generated content preview
      if (result.data.files.length > 0) {
        const firstFile = result.data.files[0];
        console.log(`\n📄 Generated file: ${firstFile.path}`);
        console.log(`📏 Lines: ${firstFile.lines}, Size: ${firstFile.size} bytes`);
        console.log('📝 Content preview (first 500 chars):');
        console.log('━'.repeat(50));
        console.log(firstFile.content.substring(0, 500) + '...');
        console.log('━'.repeat(50));
      }
      
      console.log('\n✅ Template engine test PASSED');
      return true;
    } else {
      console.log('❌ Template engine test FAILED:');
      result.errors.forEach(error => {
        console.log(`   • ${error.code}: ${error.message}`);
      });
      return false;
    }
    
  } catch (error) {
    console.log('💥 Template engine test ERROR:', error);
    return false;
  }
}

testTemplateEngine()
  .then(success => {
    if (success) {
      console.log('\n🎯 NEXT: Phase 6B.2 Step 2 - Generate LLMApiSeam.ts');
    } else {
      console.log('\n🚨 FIX TEMPLATE ENGINE BEFORE PROCEEDING');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.log('💥 Unexpected error:', error);
    process.exit(1);
  });
