// Test script for enhanced email validation
import { validateEmailDeliverability } from './src/utils/emailValidator.js';

const testEmails = [
  'afjwlkfhwlfhf@gmail.com',        // Random string
  'f30322661233@ucp.edu.pk',       // Invalid student ID  
  'testuser@gmail.com',            // Valid-looking
  'john.doe@gmail.com',            // Valid format
  'qwertyuiop@gmail.com',          // Keyboard pattern
  'abcdefghijklmn@gmail.com',      // Sequential/long
  'aaaaaaaaaa@gmail.com',          // Repetitive
  'randomxyz123456@gmail.com',     // Random with numbers
  'bcdfghjklm@gmail.com',          // No vowels
  'aeiouaeiou@gmail.com',          // Only vowels
];

console.log('=== Enhanced Email Validation Test ===\n');

for (const email of testEmails) {
  console.log(`Testing: ${email}`);
  try {
    const result = await validateEmailDeliverability(email);
    console.log(`Result: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
    if (!result.isValid) {
      console.log(`Reason: ${result.error}`);
    }
    console.log('---');
  } catch (error) {
    console.log(`❌ ERROR: ${error.message}`);
    console.log('---');
  }
}

console.log('=== Test Complete ===');
