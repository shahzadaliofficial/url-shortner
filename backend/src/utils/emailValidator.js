// Simple email validation using only Abstract API
import https from 'https';

/**
 * Simple email validation using only Abstract API
 */
export const validateEmailDeliverability = async (email) => {
  try {
    console.log(`🔍 Validating email: ${email}`);
    
    // Get API key at runtime to ensure env vars are loaded
    const ABSTRACT_API_KEY = process.env.ABSTRACT_API_KEY;

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
        const apiUrl = `https://emailvalidation.abstractapi.com/v1/?api_key=${ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}&auto_correct=false`;
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

      // Extract domain for special handling
      const domain = email.split('@')[1]?.toLowerCase();
      const isEducationalDomain = domain && (
         
        domain.endsWith('.edu.pk') || 
        domain.endsWith('.edu.bd') || 
        domain.endsWith('.ac.uk') ||
        domain.endsWith('.edu.au') ||
        domain.includes('.edu.')
      );

      // Check deliverability with special handling for educational domains
      if (abstractResponse.deliverability === 'UNDELIVERABLE') {
        // For educational domains, be more lenient if format is valid and MX records exist
        if (isEducationalDomain && abstractResponse.is_valid_format?.value && abstractResponse.is_mx_found?.value) {
          console.log(`⚠️ Educational domain ${domain} marked as UNDELIVERABLE by API, but has valid format and MX records. Allowing.`);
          return {
            isValid: true,
            validationType: 'educational_domain_override',
            warning: 'Educational domain - validation overridden due to potential API limitations'
          };
        }
        return { isValid: false, error: 'Email address does not exist or is undeliverable.' };
      }

      if (abstractResponse.is_smtp_valid && abstractResponse.is_smtp_valid.value === false) {
        // Again, be more lenient with educational domains
        if (isEducationalDomain && abstractResponse.is_valid_format?.value && abstractResponse.is_mx_found?.value) {
          console.log(`⚠️ Educational domain ${domain} failed SMTP check, but has valid format and MX records. Allowing.`);
          return {
            isValid: true,
            validationType: 'educational_domain_smtp_override',
            warning: 'Educational domain - SMTP validation overridden'
          };
        }
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
