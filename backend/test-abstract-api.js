import { validateEmailDeliverability } from './src/utils/emailValidator.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('🚀 Starting Abstract API test...');

const testEmails = [
    // Obviously fake emails that should be rejected
    'afjwlkfhwlfhf@gmail.com',
    'f30322661233@ucp.edu.pk',
    'randomstring123456@gmail.com',
    'asdfghjkl@yahoo.com',
    'qwertyuiop@hotmail.com',
    
    // Valid emails that should pass (if they exist)
    'test@gmail.com',
    'admin@google.com',
    'support@microsoft.com',
    
    // Non-existent but properly formatted emails
    'thisdefinitelydoesnotexist@gmail.com',
    'fakeemail12345@yahoo.com'
];

async function testAbstractAPI() {
    console.log('🧪 Testing Abstract API Email Validation');
    console.log('=' .repeat(50));
    
    const apiKey = process.env.ABSTRACT_API_KEY;
    if (!apiKey) {
        console.log('❌ No Abstract API key found');
        return;
    }
    
    console.log('✅ Abstract API key found:', apiKey.substring(0, 8) + '...');
    console.log('');
    
    for (const email of testEmails) {
        console.log(`🔍 Testing: ${email}`);
        
        try {
            const result = await validateEmailDeliverability(email);
            
            console.log(`   Result: ${result.isValid ? '✅ VALID' : '❌ INVALID'}`);
            console.log(`   Reason: ${result.error || result.reason || 'No specific reason provided'}`);
            
            if (result.details) {
                console.log(`   Details: ${JSON.stringify(result.details, null, 2)}`);
            }
            
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
}

// Run the test
testAbstractAPI().catch(console.error);
