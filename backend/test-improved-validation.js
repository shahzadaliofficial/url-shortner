#!/usr/bin/env node

// Test improved email validation to ensure legitimate emails aren't incorrectly flagged
import { validateEmailDeliverability } from './src/utils/emailValidator.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Improved Email Validation');
console.log('=====================================\n');

const testEmails = [
  // These should now PASS (not be flagged as fake)
  'test@gmail.com',
  'user@gmail.com', 
  'john@yahoo.com',
  'temp@hotmail.com',
  'simple@outlook.com',
  
  // These should still FAIL (correctly detected as fake)
  'afjwlkfhwlfhf@gmail.com',
  'qwertyuiopasdfgh@gmail.com',
  'aaaaaaaaaaaaa@gmail.com',
  'fake123456789@gmail.com',
  'abcdefghijklmnopqr@gmail.com',
  'bcdfghjklmnpqrst@gmail.com'
];

async function runTests() {
  for (const email of testEmails) {
    console.log(`\n📧 Testing: ${email}`);
    try {
      const result = await validateEmailDeliverability(email);
      
      if (result.isValid) {
        console.log(`✅ VALID - ${result.validationType || 'Unknown validation type'}`);
      } else {
        console.log(`❌ INVALID - ${result.error}`);
      }
    } catch (error) {
      console.log(`💥 ERROR - ${error.message}`);
    }
  }
  
  console.log('\n🏁 Test completed!');
  console.log('\nExpected Results:');
  console.log('- Simple emails like test@gmail.com should now be VALID (processed by Abstract API)');
  console.log('- Obviously fake emails should still be INVALID (caught by pattern detection)');
}

runTests().catch(console.error);
