import { transporter } from '../config/email.js'

export const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Verify Your Email - PM Toolkit',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Geologica', Arial, sans-serif; line-height: 1.6; color: #102542; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #102542 0%, #f87060 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #CDD7D6; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f87060; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to PM Toolkit!</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thanks for signing up! Please verify your email address to get started with PM Toolkit.</p>
              <p>Click the button below to verify your account:</p>
              <a href="${verificationUrl}" class="button">Verify Email</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
              <p>This link will expire in 24 hours.</p>
              <p>If you didn't create an account with PM Toolkit, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PM Toolkit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  return transporter.sendMail(mailOptions)
}

export const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Reset Your Password - PM Toolkit',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Geologica', Arial, sans-serif; line-height: 1.6; color: #102542; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #102542 0%, #f87060 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #CDD7D6; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f87060; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your Password</h1>
            </div>
            <div class="content">
              <h2>Password Reset Request</h2>
              <p>We received a request to reset your password for your PM Toolkit account.</p>
              <p>Click the button below to reset your password:</p>
              <a href="${resetUrl}" class="button">Reset Password</a>
              <p>Or copy and paste this link into your browser:</p>
              <p style="color: #666; word-break: break-all;">${resetUrl}</p>
              <p>This link will expire in 1 hour.</p>
              <p>If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PM Toolkit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  return transporter.sendMail(mailOptions)
}

export const sendWelcomeEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: 'Welcome to PM Toolkit!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Geologica', Arial, sans-serif; line-height: 1.6; color: #102542; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #102542 0%, #f87060 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #ffffff; padding: 30px; border: 1px solid #CDD7D6; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #f87060; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Welcome to PM Toolkit!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name}!</h2>
              <p>Your account is now verified and ready to use. Here's what you can do:</p>
              <ul>
                <li><strong>Learn Best Practices</strong> - Understand how designers want requirements</li>
                <li><strong>Create Better Briefs</strong> - Use our guided questionnaire</li>
                <li><strong>Build Visual Site-Maps</strong> - Drag-and-drop builder</li>
                <li><strong>Map User Journeys</strong> - Show decision logic visually</li>
                <li><strong>Browse Prompts</strong> - 100+ AI prompts to build apps</li>
              </ul>
              <a href="${process.env.FRONTEND_URL}/dashboard" class="button">Go to Dashboard</a>
              <p>If you have any questions, feel free to reach out to our support team.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} PM Toolkit. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  return transporter.sendMail(mailOptions)
}
