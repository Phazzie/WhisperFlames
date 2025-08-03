import { Seam } from '../types.js';

/**
 * Placeholder LLM service for detecting seams in PRD content
 * TODO: Replace with actual LLM integration
 */
export function detectSeamsLLM(prdContent: string): Seam[] {
  // If PRD is empty or too short, return default seams
  if (!prdContent || prdContent.trim().length < 50) {
    return [
      {
        name: "BarcodeScanAPI",
        type: "http",
        description: "Scans product barcodes and returns product information",
        ioHints: {
          inputs: ["barcode", "storeId"],
          outputs: ["productId", "name", "price", "inStock"]
        }
      },
      {
        name: "ReviewsAPI", 
        type: "http",
        description: "Manages customer reviews and ratings",
        ioHints: {
          inputs: ["productId", "userId", "rating", "comment"],
          outputs: ["reviewId", "averageRating", "reviewCount"]
        }
      },
      {
        name: "ShoppingListAPI",
        type: "http", 
        description: "Creates and manages user shopping lists",
        ioHints: {
          inputs: ["userId", "listName", "items"],
          outputs: ["listId", "totalItems", "estimatedCost"]
        }
      }
    ];
  }

  // TODO: Implement actual LLM parsing logic
  // For now, extract potential seams based on keywords
  const seams: Seam[] = [];
  const content = prdContent.toLowerCase();

  if (content.includes('user') || content.includes('auth')) {
    seams.push({
      name: "UserAuthAPI",
      type: "http",
      description: "Handles user authentication and authorization",
      ioHints: {
        inputs: ["email", "password"],
        outputs: ["userId", "token", "role"]
      }
    });
  }

  if (content.includes('payment') || content.includes('checkout')) {
    seams.push({
      name: "PaymentAPI",
      type: "http", 
      description: "Processes payments and transactions",
      ioHints: {
        inputs: ["amount", "paymentMethod", "userId"],
        outputs: ["transactionId", "status", "confirmationCode"]
      }
    });
  }

  if (content.includes('email') || content.includes('notification')) {
    seams.push({
      name: "EmailService",
      type: "service",
      description: "Sends email notifications to users", 
      ioHints: {
        inputs: ["recipient", "subject", "template", "data"],
        outputs: ["messageId", "deliveryStatus"]
      }
    });
  }

  // If no seams detected, return defaults
  return seams.length > 0 ? seams : [
    {
      name: "BarcodeScanAPI",
      type: "http",
      description: "Scans product barcodes and returns product information",
      ioHints: {
        inputs: ["barcode", "storeId"],
        outputs: ["productId", "name", "price", "inStock"]
      }
    }
  ];
}

/**
 * Generate clarifying questions when PRD is thin or unclear
 */
export function generateClarifyingQuestions(prdContent: string): string[] {
  const questions: string[] = [];
  const content = prdContent.toLowerCase();

  if (content.length < 100) {
    questions.push("What are the main user workflows or actions in your system?");
  }

  if (!content.includes('database') && !content.includes('storage')) {
    questions.push("What data needs to be stored and retrieved?");
  }

  if (!content.includes('api') && !content.includes('integration')) {
    questions.push("Do you need to integrate with any external services or APIs?");
  }

  return questions.slice(0, 3); // Max 3 questions
}
