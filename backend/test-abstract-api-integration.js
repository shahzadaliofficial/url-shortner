#!/usr/bin/env node

// Test Abstract API integration with proper environment loading
import { validateEmailDeliverability } from './src/utils/emailValidator.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧪 Testing Abstract API Integration');
console.log('==================================\n');

console.log('Environment check:');
console.log(`ABSTRACT_API_KEY: ${process.env.ABSTRACT_API_KEY ? 'SET' : 'NOT SET'}`);
console.log(`Key length: ${process.env.ABSTRACT_API_KEY ? process.env.ABSTRACT_API_KEY.length : 'N/A'}`);
console.log('');

const testEmails = [
  // These should use Abstract API if key is working
  'test@gmail.com',
  'hello@gmail.com',
  
  // These should be caught by pattern detection
  'afjwlkfhwlfhf@gmail.com',
  
  // Test a definitely non-existent email if API is working
  'thisemailshouldnotexist123456789@gmail.com',
];

async function runAPITests() {
  for (const email of testEmails) {
    console.log(`\n📧 Testing: ${email}`);
    try {
      const result = await validateEmailDeliverability(email);
      
      if (result.isValid) {
        console.log(`✅ VALID - ${result.validationType || 'Unknown validation type'}`);
        if (result.mxRecords) {
          console.log(`   MX Records: ${result.mxRecords.join(', ')}`);
        }
      } else {
        console.log(`❌ INVALID - ${result.error}`);
      }
    } catch (error) {
      console.log(`💥 ERROR - ${error.message}`);
    }
  }
  
  console.log('\n🏁 API Test completed!');
  console.log('\nIf Abstract API is working, you should see:');
  console.log('- API call logs in the output');
  console.log('- validationType as "api_confirmed_deliverable" or "api_fallback_mx_verified"');
  console.log('- More accurate rejection of non-existent emails');
}

runAPITests().catch(console.error);
