import nodemailer from 'nodemailer'
import crypto from 'crypto'

// Email configuration - you can use Gmail, Outlook, or any SMTP service
const createTransporter = () => {
  // Check if we have proper SMTP configuration
  const hasEmailConfig = process.env.SMTP_HOST && 
                        process.env.SMTP_USER && 
                        process.env.SMTP_PASS;

  console.log('=== EMAIL TRANSPORTER DEBUG ===');
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'SET' : 'NOT SET');
  console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'NOT SET');
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'SET' : 'NOT SET');
  console.log('Has Email Config:', hasEmailConfig);
  console.log('===============================');

  if (!hasEmailConfig) {
    console.warn('Email configuration missing, emails will be logged to console');
    return null;
  }

  // For development, you can use a service like Ethereal Email for testing
  // In production, use your actual SMTP service
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    // Additional options for Gmail
    ...(process.env.SMTP_HOST === 'smtp.gmail.com' && {
      service: 'gmail',
      tls: {
        rejectUnauthorized: false
      }
    })
  });
}

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex')
}

export const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const transporter = createTransporter();
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`;

    // If no email configuration, log to console (for development/testing)
    if (!transporter) {
      console.log('=== EMAIL VERIFICATION DEBUG ===');
      console.log(`Email: ${email}`);
      console.log(`Name: ${name}`);
      console.log(`Verification Token: ${verificationToken}`);
      console.log(`Verification URL: ${verificationUrl}`);
      console.log('Email would be sent but no SMTP config found');
      console.log('================================');
      
      return {
        success: true,
        message: 'Verification email logged to console (no SMTP config)'
      };
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@urlshortener.com',
      to: email,
      subject: 'Verify Your Email Address - URL Shortener',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to URL Shortener!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for registering with our URL Shortener service. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Email Address
            </a>
          </div>
          
          <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
          
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This verification link will expire in 24 hours. If you didn't create an account with us, please ignore this email.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            URL Shortener Team<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      `
    };

    console.log('Attempting to send verification email to:', email);
    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      command: error.command
    });
    
    // Don't throw error, return a fallback response
    console.log('=== EMAIL FALLBACK DEBUG ===');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Verification Token: ${verificationToken}`);
    console.log(`Verification URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${verificationToken}`);
    console.log('Email failed to send, but user can still verify manually');
    console.log('============================');
    
    return {
      success: true,
      message: 'Registration successful. Please check console for verification details.',
      fallback: true
    };
  }
}

export const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();

    // If no email configuration, log to console
    if (!transporter) {
      console.log('=== WELCOME EMAIL DEBUG ===');
      console.log(`Sending welcome email to: ${email} (${name})`);
      console.log('==========================');
      return {
        success: true,
        message: 'Welcome email logged to console (no SMTP config)'
      };
    }
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@urlshortener.com',
      to: email,
      subject: 'Welcome to URL Shortener - Email Verified!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #10b981;">Email Verified Successfully!</h2>
          <p>Hi ${name},</p>
          <p>Congratulations! Your email address has been successfully verified. You now have full access to all URL Shortener features:</p>
          
          <ul style="color: #374151; line-height: 1.6;">
            <li>✅ Create custom short URLs</li>
            <li>✅ Track click analytics</li>
            <li>✅ Manage all your URLs in the dashboard</li>
            <li>✅ Access advanced features</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
               style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Go to Dashboard
            </a>
          </div>
          
          <p>Thank you for choosing our URL Shortener service!</p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #999; font-size: 12px; text-align: center;">
            URL Shortener Team<br>
            This is an automated email, please do not reply.
          </p>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent:', result.messageId);
    return result;
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email failure - just log it
    return {
      success: false,
      message: 'Welcome email failed but this is not critical'
    };
  }
}
