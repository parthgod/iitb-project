export const loginAcceptEmailHTML = ({ email }: { email: string }): string => {
  return `
      <!DOCTYPE html>
      <html lang="en">
      
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Login Credentials</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  color: #333;
              }
      
              .container {
                  max-width: 600px;
                  margin: 20px auto;
                  padding: 20px;
                  background-color: #fff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
      
              h1 {
                  color: #007bff;
              }
      
              p {
                  margin-bottom: 20px;
              }
      
              .credentials {
                  background-color: #f9f9f9;
                  padding: 10px;
                  border-radius: 4px;
              }

              .important{
                font-weight: bold;
              }
      
              .button {
                  display: inline-block;
                  background-color: #007bff;
                  color: white;
                  padding: 10px 20px;
                  text-decoration: none;
                  border-radius: 4px;
              }
      
              .button:hover {
                  background-color: #0056b3;
              }
          </style>
      </head>
      
      <body>
          <div class="container">
              <h1>Hello there!</h1>
              <p>Your login request has been accepted. You can now login using the following credentials:</p>
              <div class="credentials">
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Password:</strong> 12345</p>
              </div>
              <p>Click the button below to log in:</p>
              <a href="http://localhost:3000/login" class="button">Login Now</a>
              <p class='important'>Please change your password after logging in by clicking on your icon/avatar and going to 'Profile' page.</p>
              <p>If you have any questions or concerns, feel free to contact us.</p>
              <p>Thank you!</p>
          </div>
      </body>
      
      </html>
  `;
};

export const passwordResetEmail = (resetLink: string) => {
  return `
  <!DOCTYPE html>
      <html lang="en">
      
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset password</title>
        </head>
          
        <body>
            <div>
                <p>Dear User,</p>
                <p>We have received a request to reset your password. If you did not initiate this request, please ignore this email.</p>
                <p>To reset your password, please click on the link below:</p>
                <a href=${resetLink}>Reset Password</a>
                
                <p>This link will expire in 30 minutes for security reasons. If you need further assistance, please contact our support team.</p>
                <p>Best regards,<br />VoltVault</p>
            </div>
      </body>
    </html>`;
};
