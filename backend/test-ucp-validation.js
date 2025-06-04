import { validateEmailDeliverability } from './src/utils/emailValidator.js';

async function testUCPValidation() {
  console.log('=== Testing UCP Email Validation ===');
  
  const testEmails = [
    'f30322661233@ucp.edu.pk',  // Should be rejected (suspicious pattern)
    'f2024123456@ucp.edu.pk',   // Should be valid (good pattern)
    'john.doe@ucp.edu.pk',      // Should be valid (staff email)
    'f2029322233@ucp.edu.pk',   // Should be rejected (invalid year)
    'f2023322661233@ucp.edu.pk' // Should be rejected (too many digits)
  ];
  
  for (const email of testEmails) {
    console.log(`\n🧪 Testing: ${email}`);
    try {
      const result = await validateEmailDeliverability(email);
      console.log(`Result: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
      if (!result.isValid) {
        console.log(`Reason: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
  }
  
  console.log('\n=== Test Complete ===');
}

testUCPValidation();
