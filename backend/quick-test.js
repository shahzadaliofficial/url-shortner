import { validateEmailDeliverability } from './src/utils/emailValidator.js';

async function quickTest() {
  console.log('Testing email validation...');
  
  try {
    const result = await validateEmailDeliverability('F2030266001@umt.edu.pk');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error);
  }
}

quickTest();
