// Simple email validation using only Abstract API
import https from 'https';

const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

/**
 * Simple email validation using only Abstract API
 */
export const validateEmailDeliverability = async (email) => {
  try {
    console.log(`🔍 Validating email: ${email}`);

    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        error: 'Invalid email format'
      };
    }

    // Use Abstract API for validation
    if (!ABSTRACT_API_KEY) {
      return {
        isValid: false,
        error: 'Email validation service not configured'
      };
    }

    console.log(`📞 Calling Abstract API for: ${email}`);
    try {
      const abstractResponse = await new Promise((resolve, reject) => {
        const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`;
        https.get(apiUrl, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            if (res.statusCode >= 200 && res.statusCode < 300) {
              try {
                resolve(JSON.parse(data));
              } catch (parseError) {
                reject(new Error(`Abstract API JSON parse error: ${parseError.message}`));
              }
            } else {
              reject(new Error(`Abstract API request failed with status ${res.statusCode}`));
            }
          });
        }).on('error', (err) => {
          reject(new Error(`Abstract API request error: ${err.message}`));
        });
      });

      console.log('Abstract API Response:', abstractResponse);

      // Check deliverability
      if (abstractResponse.deliverability === 'UNDELIVERABLE') {
        return { isValid: false, error: 'Email address does not exist or is undeliverable.' };
      }

      if (abstractResponse.is_smtp_valid && abstractResponse.is_smtp_valid.value === false) {
        return { isValid: false, error: 'Email address failed SMTP validation.' };
      }

      if (abstractResponse.deliverability === 'DELIVERABLE') {
        return {
          isValid: true,
          validationType: 'api_confirmed_deliverable'
        };
      }

      // For RISKY or UNKNOWN, allow but note it
      return {
        isValid: true,
        validationType: `api_${abstractResponse.deliverability.toLowerCase()}`
      };

    } catch (apiError) {
      console.error(`Abstract API Error for ${email}: ${apiError.message}`);
      return { isValid: false, error: 'Unable to validate email address.' };
    }

  } catch (error) {
    console.error('Email validation error:', error);
    return { isValid: false, error: 'Email validation failed.' };
  }
};
