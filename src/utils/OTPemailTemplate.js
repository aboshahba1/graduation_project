export const OTPemailTemplate = ({ otp = '' }) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Notification</title>
    <style>
    body {
    font-family: sans-serif;
    margin: 0;
    padding: 0;
    }
    .container {
    padding: 20px;
    }
    .content {
    line-height: 1.5;
    text-align: center;
    }
    .link {
    color: #007bff;
    text-decoration: none;
    }
    .verification-code {
    font-weight: bold;
    }
    </style>
    </head>
    <body>
    <div class="container">
    <div class="content">
    <h1>Welcome to fast medical service!</h1>
    <p>To reset your password, get your OTP verification code and don't share it with others. enter the verification code where you go:</p>
    <p>Verification code: <span class="verification-code">${otp}</span></p>
    <p>This code is valid for [60] minutes.</p>
    <p>If you have any questions, please don't hesitate to contact us.</p>
    <p>Sincerely,</p>
    <p>Arch_Reality</p>
    </div>
    </div>
    </body>
    </html>`
}