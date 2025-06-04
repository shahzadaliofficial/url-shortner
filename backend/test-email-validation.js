import { validateEmailDeliverability, isDisposableEmail } from './src/utils/emailValidator.js';

// Test the email validation with various email patterns
async function testEmailValidation() {
  const testEmails = [
    'F2030266042@umt.edu.pk',     // Valid UMT student format
    'F2030266001@umt.edu.pk',     // Valid UMT student format  
    'F1990123456@umt.edu.pk',     // Invalid year (too old)
    'F2030@umt.edu.pk',           // Invalid format (too short)
    'john.doe@umt.edu.pk',        // Valid UMT staff format
    'test@umt.edu.pk',            // Suspicious pattern
    'fake@umt.edu.pk',            // Suspicious pattern
    'test@gmail.com',             // Suspicious + popular domain
    'real.person@gmail.com',      // Valid format
    'user@gmial.com',             // Typo in gmail
    'invalid@nonexistentdomain12345.com', // Invalid domain
    'test@tempmail.org',          // Disposable email
    'user@10minutemail.com'       // Disposable email
  ];

  console.log('🧪 Testing Enhanced Email Validation\n');

  for (const email of testEmails) {
    console.log(`Testing: ${email}`);
    
    try {
      const validation = await validateEmailDeliverability(email);
      const isDisposable = isDisposableEmail(email);
      
      console.log(`  ✅ Valid: ${validation.isValid}`);
      if (!validation.isValid) {
        console.log(`  ❌ Error: ${validation.error}`);
      } else {
        console.log(`  📧 MX Records found: ${validation.mxRecords?.length || 0}`);
        console.log(`  🔍 Validation Type: ${validation.validationType}`);
      }
      console.log(`  🗑️  Disposable: ${isDisposable}`);
      
    } catch (error) {
      console.log(`  💥 Exception: ${error.message}`);
    }
    
    console.log('-'.repeat(50)); // Separator line
  }
}

testEmailValidation().catch(console.error);
