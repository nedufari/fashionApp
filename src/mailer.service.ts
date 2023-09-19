import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService{
    constructor(private readonly mailservice:MailerService){}

    async SendPasswordResetLinkMail(email:string, resetlink: string):Promise<void>{
      const subject = "Password Reset Link";
      const content = `<!DOCTYPE html>
  <html>
    <head>
      <title>Forgot Password Reset Link</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          color: #333333;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 10px;
        }
        .verification-heading {
          text-align: center;
          color: #aa6c39;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .message {
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .otp {
          text-align: center;
          font-size: 30px;
          color: #aa6c39;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .instructions {
          font-size: 16px;
          line-height: 1.4;
        }
        .button {
         
          color:#aa6c39;
          
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://drive.google.com/file/d/1zpO-SfrIUlGky2YdT9UCtNdyc_Tu0MLs/view?usp=drive_link" alt="Walkway Logo" width="250" height="250" />
        </div>
        <h1 class="verification-heading">OTP Verification</h1>
        <p class="message"><span class="username">HI</span>,</p>
        <p class="otp">Your Password Reset Link : <span class="otp-code">${resetlink}</span></p>
        <div class="instructions">
          <p>
            We are sorry you can't get access into walkway. Please use the Reset link  provided above to enter a new password.
          </p>
          <p>
            The password reset link is valid for a limited time, and it should be used to complete the password reset process.
          </p>
          <p>
            If you did not request this OTP, please ignore this email. Your account will remain secure.
          </p>
          <p >
            If you have any questions or need assistance, please don't hesitate to contact our support team at support@walkway.com 
          </p>
        </div>
        <p>Happy modeling and designing!</p>
        <p>Team Walkway</p>
      </div>
    </body>
  </html>
  `;

      await this.mailservice.sendMail({to:email,subject,html:content })
      
  }

    async SendVerificationMail(email:string, verificationCode: string,username:string):Promise<void>{
        const subject = "Verify your email";
    const content = `<!DOCTYPE html>
    <html>
      <head>
        <title>OTP Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f2f2f2;
            color: #333333;
            line-height: 1.6;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }
          .logo {
            text-align: center;
            margin-bottom: 10px;
          }
          .verification-heading {
            text-align: center;
            color: #aa6c39;
            font-size: 20px;
            margin-bottom: 10px;
          }
          .message {
            text-align: center;
            font-size: 16px;
            margin-bottom: 20px;
          }
          .otp {
            text-align: center;
            font-size: 30px;
            color: #aa6c39;
            font-weight: bold;
            margin-bottom: 20px;
          }
          .instructions {
            font-size: 16px;
            line-height: 1.4;
          }
          .button {
           
            color:#aa6c39;
            
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://drive.google.com/file/d/1zpO-SfrIUlGky2YdT9UCtNdyc_Tu0MLs/view?usp=drive_link" alt="Walkway Logo" width="250" height="250" />
          </div>
          <h1 class="verification-heading">OTP Verification</h1>
          <p class="message">Hi <span class="username">${username}</span>,</p>
          <p class="otp">Your One-Time Password (OTP): <span class="otp-code">${verificationCode}</span></p>
          <div class="instructions">
            <p>
              Thank you for registering on Walkway. Please use the OTP provided above to verify your account.
            </p>
            <p>
              The OTP is valid for a limited time, and it should be used to complete the verification process.
            </p>
            <p>
              If you did not request this OTP, please ignore this email. Your account will remain secure.
            </p>
            <p >
              If you have any questions or need assistance, please don't hesitate to contact our support team at support@walkway.com 
            </p>
          </div>
          <p>Happy modeling and designing!</p>
          <p>Team Walkway</p>
        </div>
      </body>
    </html>
    `;


        await this.mailservice.sendMail({to:email,subject,html:content })
        
    }


    //send welcome email to new customer 
    async SendWelcomeEmail(email:string,username:string):Promise<void>{
        const subject = "welcome to walkway!";
        const content = 

        
        `<!DOCTYPE html>
        <html>
          <head>
            <title>Welcome to Walkway!</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
                color: #333333;
                line-height: 1.6;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              }
              .logo {
                text-align: center;
                margin-bottom: 20px;
              }
              .welcome-heading {
                text-align: center;
                color: #aa6c39;
                font-size: 24px;
                margin-bottom: 10px;
              }
              .message {
                text-align: center;
                font-size: 16px;
                margin-bottom: 20px;
              }
              .username {
                color: #aa6c39;
                font-weight: bold;
              }
              .onboarding-content {
                font-size: 14px;
                line-height: 1.4;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #aa6c39;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="logo">
                <img src="https://drive.google.com/file/d/1zpO-SfrIUlGky2YdT9UCtNdyc_Tu0MLs/view?usp=drive_link" alt="Walkway Logo" width="150" height="150" />
              </div>
              <h1 class="welcome-heading">Welcome to Walkway!</h1>
              <p class="message">Hi <span class="username">${username}</span>,</p>
              <div class="onboarding-content">
                <p>
                  We are excited to have you as a new member of Walkway, a platform where fashion designers and models
                  connect to create amazing experiences in the world of fashion.
                </p>
                <p>
                  Your journey on Walkway starts here! As a model or fashion designer, you can showcase your talent,
                  collaborate with brands, and build your career in the fashion industry.
                </p>
                <p>
                  Whether you are a seasoned professional or just starting, Walkway provides the tools and opportunities
                  to help you reach new heights in your fashion journey.
                </p>
                <p>
                  Feel free to explore the platform, connect with other users, and discover exciting projects.
                </p>
                <p>Ready to get started?</p>
                <a href="https://walkway.com/login" class="button">Sign In to Walkway</a>
              </div>
              <p>
                If you have any questions or need assistance, please don't hesitate to contact our support team at
                support@walkway.com.
              </p>
              <p>Happy modeling and designing!</p>
              <p>Team Walkway</p>
            </div>
          </body>
        </html>`;

  await this.mailservice.sendMail({to:email,subject,html:content})
    }



    //contraxt signature 

    async SendMailtoVendorModel(email:string,contract_duration:string,contract_worth:string,contract_validity_number:string,model:string,vendor:string,expiration_date:Date):Promise<void>{
      const subject = "contract signature certification and reciept"
      const content = `
      <!DOCTYPE html>
<html>
<head>
  <title>Contract Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 10px;
    }
    .contract-heading {
      text-align: center;
      color: #aa6c39;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .contract-details {
      font-size: 16px;
      line-height: 1.4;
    }
    .contract-qr-code {
      text-align: center;
      margin-top: 30px;
    }
    .signature {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo" width="150" height="150" />
    </div>
    <h1 class="contract-heading">Contract Agreement</h1>
    <p class="contract-details">
      Dear ${vendor},
    </p>
    <p class="contract-details">
      We are pleased to inform you that a contract agreement has been signed between ${vendor} and ${model}. The details of the contract are as follows:
    </p>
    <ul class="contract-details">
      <li>Contract Worth: ${contract_worth}</li>
      <li>Contract Validity Number: ${contract_validity_number}</li>
      <li>Contract Duration: ${contract_duration}</li>
      <li>Contract Expiration Date: ${expiration_date}</li>
    </ul>
    <div class="contract-qr-code">
      <!-- Insert the QR code here (if applicable) -->
      <img src="https://yourqrcode.com/contract_qr_code.png" alt="Contract QR Code" width="200" height="200" />
    </div>
    <p class="contract-details">
      Please review the contract carefully and make sure you agree with all the terms and conditions. If you have any questions or concerns, feel free to contact our support team at support@walkway.com.
    </p>
    <p class="contract-details">
      We look forward to a successful partnership with you. Thank you for choosing Walkway!
    </p>
    <p class="signature">
      Best regards,
      Walkway Team
    </p>
  </div>
</body>
</html>
      `
      await this.mailservice.sendMail({to:email,subject,html:content})

    }



    async SendMailtoModelVendor(email:string,contract_duration:string,contract_worth:string,contract_validity_number:string,model:string,vendor:string,expiration_date:Date):Promise<void>{
      const subject = "contract signature certification and reciept"
      const content = `
      <!DOCTYPE html>
<html>
<head>
  <title>Contract Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 10px;
    }
    .contract-heading {
      text-align: center;
      color: #aa6c39;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .contract-details {
      font-size: 16px;
      line-height: 1.4;
    }
    .contract-qr-code {
      text-align: center;
      margin-top: 30px;
    }
    .signature {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo" width="150" height="150" />
    </div>
    <h1 class="contract-heading">Contract Agreement</h1>
    <p class="contract-details">
      Dear ${model},
    </p>
    <p class="contract-details">
      We are pleased to inform you that a contract agreement has been signed between ${vendor} and ${model}. The details of the contract are as follows:
    </p>
    <ul class="contract-details">
      <li>Contract Worth: ${contract_worth}</li>
      <li>Contract Validity Number: ${contract_validity_number}</li>
      <li>Contract Duration: ${contract_duration}</li>
      <li>Contract Expiration Date: ${expiration_date}</li>
    </ul>
    <div class="contract-qr-code">
      <!-- Insert the QR code here (if applicable) -->
      <img src="https://yourqrcode.com/contract_qr_code.png" alt="Contract QR Code" width="200" height="200" />
    </div>
    <p class="contract-details">
      Please review the contract carefully and make sure you agree with all the terms and conditions. If you have any questions or concerns, feel free to contact our support team at support@walkway.com.
    </p>
    <p class="contract-details">
      We look forward to a successful partnership with you. Thank you for choosing Walkway!
    </p>
    <p class="signature">
      Best regards,
      Walkway Team
    </p>
  </div>
</body>
</html>
      `
      await this.mailservice.sendMail({to:email,subject,html:content})

    }


    async SendMailtoVendorPhotographer(email:string,contract_duration:string,contract_worth:string,contract_validity_number:string,photographer:string,vendor:string,expiration_date:Date):Promise<void>{
      const subject = "contract signature certification and reciept"
      const content = `
      <!DOCTYPE html>
<html>
<head>
  <title>Contract Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 10px;
    }
    .contract-heading {
      text-align: center;
      color: #aa6c39;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .contract-details {
      font-size: 16px;
      line-height: 1.4;
    }
    .contract-qr-code {
      text-align: center;
      margin-top: 30px;
    }
    .signature {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo" width="150" height="150" />
    </div>
    <h1 class="contract-heading">Contract Agreement</h1>
    <p class="contract-details">
      Dear ${vendor},
    </p>
    <p class="contract-details">
      We are pleased to inform you that a contract agreement has been signed between ${vendor} and ${photographer}. The details of the contract are as follows:
    </p>
    <ul class="contract-details">
      <li>Contract Worth: ${contract_worth}</li>
      <li>Contract Validity Number: ${contract_validity_number}</li>
      <li>Contract Duration: ${contract_duration}</li>
      <li>Contract Expiration Date: ${expiration_date}</li>
    </ul>
    <div class="contract-qr-code">
      <!-- Insert the QR code here (if applicable) -->
      <img src="https://yourqrcode.com/contract_qr_code.png" alt="Contract QR Code" width="200" height="200" />
    </div>
    <p class="contract-details">
      Please review the contract carefully and make sure you agree with all the terms and conditions. If you have any questions or concerns, feel free to contact our support team at support@walkway.com.
    </p>
    <p class="contract-details">
      We look forward to a successful partnership with you. Thank you for choosing Walkway!
    </p>
    <p class="signature">
      Best regards,
      Walkway Team
    </p>
  </div>
</body>
</html>
      `
      await this.mailservice.sendMail({to:email,subject,html:content})

    }


    async SendMailtoPhotographerVendor(email:string,contract_duration:string,contract_worth:string,contract_validity_number:string,photographer:string,vendor:string,expiration_date:Date):Promise<void>{
      const subject = "contract signature certification and reciept"
      const content = `
      <!DOCTYPE html>
<html>
<head>
  <title>Contract Agreement</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f2f2f2;
      color: #333333;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .logo {
      text-align: center;
      margin-bottom: 10px;
    }
    .contract-heading {
      text-align: center;
      color: #aa6c39;
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .contract-details {
      font-size: 16px;
      line-height: 1.4;
    }
    .contract-qr-code {
      text-align: center;
      margin-top: 30px;
    }
    .signature {
      text-align: right;
      font-size: 18px;
      font-weight: bold;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://yourcompanylogo.com/logo.png" alt="Company Logo" width="150" height="150" />
    </div>
    <h1 class="contract-heading">Contract Agreement</h1>
    <p class="contract-details">
      Dear ${photographer},
    </p>
    <p class="contract-details">
      We are pleased to inform you that a contract agreement has been signed between ${vendor} and ${photographer}. The details of the contract are as follows:
    </p>
    <ul class="contract-details">
      <li>Contract Worth: ${contract_worth}</li>
      <li>Contract Validity Number: ${contract_validity_number}</li>
      <li>Contract Duration: ${contract_duration}</li>
      <li>Contract Expiration Date: ${expiration_date}</li>
    </ul>
    <div class="contract-qr-code">
      <!-- Insert the QR code here (if applicable) -->
      <img src="https://yourqrcode.com/contract_qr_code.png" alt="Contract QR Code" width="200" height="200" />
    </div>
    <p class="contract-details">
      Please review the contract carefully and make sure you agree with all the terms and conditions. If you have any questions or concerns, feel free to contact our support team at support@walkway.com.
    </p>
    <p class="contract-details">
      We look forward to a successful partnership with you. Thank you for choosing Walkway!
    </p>
    <p class="signature">
      Best regards,
      Walkway Team
    </p>
  </div>
</body>
</html>
      `
      await this.mailservice.sendMail({to:email,subject,html:content})

    }


    async SendRandomMail(body:string,email:string,title:string):Promise<void>{
      const subject = title
      const content = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Walkway Announcement</title>
    <style>
        /* Reset some default styles for email clients */
        body, p {
            margin: 0;
            padding: 0;
        }

        /* Set a background color and text color */
        body {
            background-color: #f4f4f4;
            color: #333;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        /* Add some spacing to the top and bottom of the email */
        .container {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Style the heading and subheading */
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        /* Style the paragraph text */
        p {
            font-size: 16px;
        }

        /* Style the button */
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
        }

        /* Style the button on hover */
        .cta-button:hover {
            background-color: #aa6c39;
        }

        .signature {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">

    <h1>Dear Esteemed Customer</h1>
        <h1>${title}</h1>
        <p> ${body}
        
          <p>
        <a href="#" class="cta-button">Visit Walkway</a> </p>
        
        <p 
      Best regards,
      Walkway Team
    </p>

    </div>
</body>
</html>

      ` 
      await this.mailservice.sendMail({to:email,subject,html:content})

    }


    async SendCompliaitResolutionMail(body:string,email:string,title:string,issue:string):Promise<void>{
      const subject = title
      const content = `
      <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Walkway Announcement</title>
    <style>
        /* Reset some default styles for email clients */
        body, p {
            margin: 0;
            padding: 0;
        }

        /* Set a background color and text color */
        body {
            background-color: #f4f4f4;
            color: #333;
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }

        /* Add some spacing to the top and bottom of the email */
        .container {
            margin: 20px auto;
            padding: 20px;
            max-width: 600px;
            background: #fff;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Style the heading and subheading */
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }

        /* Style the paragraph text */
        p {
            font-size: 16px;
        }

        /* Style the button */
        .cta-button {
            display: inline-block;
            background-color: #007BFF;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 5px;
            margin-top: 20px;
        }

        /* Style the button on hover */
        .cta-button:hover {
            background-color: #aa6c39;
        }

        .signature {
          text-align: right;
          font-size: 18px;
          font-weight: bold;
          margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">

    <h1>Dear Esteemed Customer</h1>
        <h1>${title}</h1>
        <p> complaint with issue  ${issue} resolved </p>
        <p> ${body}
        
          <p>
        <a href="#" class="cta-button">Visit Walkway</a> </p>
        
        <p 
      Best regards,
      Walkway Team
    </p>

    </div>
</body>
</html>

      ` 
      await this.mailservice.sendMail({to:email,subject,html:content})

    }
}









