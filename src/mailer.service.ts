import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { generate2FACode4digits } from "./helpers";

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



    
}


