import { validateEmailDeliverability, isDisposableEmail } from './src/utils/emailValidator.js';

async function testEnhancedValidation() {
  const testEmails = [
    'F2029266042@umt.edu.pk',  // The problematic email that bounces
    'F2030266001@umt.edu.pk',  // Another similar pattern  
    'john.doe@umt.edu.pk',     // Staff email (should pass)
    'F2023123001@umt.edu.pk',  // Valid-looking student pattern
    'test@gmail.com'           // Regular email
  ];

  console.log('🧪 Testing Enhanced Email Validation\n');

  for (const email of testEmails) {
    console.log(`\n=== Testing: ${email} ===`);
    
    try {
      const validation = await validateEmailDeliverability(email);
      console.log(`✅ Valid: ${validation.isValid}`);
      if (!validation.isValid) {
        console.log(`❌ Error: ${validation.error}`);
      }
    } catch (error) {
      console.log(`💥 Exception: ${error.message}`);
    }
  }
}

testEnhancedValidation().catch(console.error);
